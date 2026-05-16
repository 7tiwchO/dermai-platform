"""
DermAI — Prediction Routes
============================
Image upload and cancer detection prediction endpoints.
"""

import os
from datetime import datetime
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from werkzeug.utils import secure_filename

from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS, MAX_FILE_SIZE
from auth import get_current_user
from database import get_db, log_activity
from ml.predictor import predict, get_model_info

router = APIRouter(prefix="/api", tags=["Predictions"])


def validate_file(file: UploadFile) -> str:
    """Validate uploaded file type and return safe filename."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type '.{ext}' not allowed. Use: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Sanitize filename with timestamp
    safe_name = secure_filename(file.filename)
    name, extension = os.path.splitext(safe_name)
    return f"{name}_{int(datetime.now().timestamp())}{extension}"


@router.post("/predict")
async def run_prediction(
    file: UploadFile = File(...),
    patient_name: str = Form(...),
    patient_age: int = Form(None),
    notes: str = Form(None),
    current_user: dict = Depends(get_current_user)
):
    """Upload an image and run cancer detection prediction."""

    # Validate file
    filename = validate_file(file)

    # Check file size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 16MB.")

    # Save file
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    with open(filepath, "wb") as f:
        f.write(contents)

    try:
        # Run AI prediction
        result = predict(filepath)

        # Save to database
        with get_db() as conn:
            cursor = conn.execute(
                """INSERT INTO predictions
                   (user_id, patient_name, patient_age, result, confidence, risk_level, image_path, notes)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    current_user["id"],
                    patient_name,
                    patient_age,
                    result["result"],
                    result["confidence"],
                    result["risk_level"],
                    f"uploads/{filename}",
                    notes
                )
            )
            prediction_id = cursor.lastrowid
            conn.commit()

        log_activity(
            current_user["id"], "prediction",
            f"Prediction: {result['result']} ({result['confidence']:.1%}) for {patient_name}"
        )

        return {
            "id": prediction_id,
            "patient_name": patient_name,
            "patient_age": patient_age,
            "result": result["result"],
            "confidence": result["confidence"],
            "risk_level": result["risk_level"],
            "inference_time_ms": result["inference_time_ms"],
            "model_mode": result["model_mode"],
            "image_path": f"/static/uploads/{filename}",
            "created_at": datetime.utcnow().isoformat()
        }

    except Exception as e:
        # Clean up uploaded file on error
        if os.path.exists(filepath):
            os.remove(filepath)
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.get("/model/info")
async def model_info():
    """Get information about the loaded ML model."""
    return get_model_info()
