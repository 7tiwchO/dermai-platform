"""
DermAI — Patient / History Routes
====================================
Prediction history management endpoints.
"""

from fastapi import APIRouter, HTTPException, Depends, Query

from auth import get_current_user
from database import get_db

router = APIRouter(prefix="/api/patients", tags=["Patients"])


@router.get("")
async def list_predictions(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user)
):
    """Get paginated prediction history for the current user."""
    offset = (page - 1) * per_page

    with get_db() as conn:
        # Total count
        total = conn.execute(
            "SELECT COUNT(*) as count FROM predictions WHERE user_id = ?",
            (current_user["id"],)
        ).fetchone()["count"]

        # Paginated results
        predictions = conn.execute(
            """SELECT * FROM predictions WHERE user_id = ?
               ORDER BY created_at DESC LIMIT ? OFFSET ?""",
            (current_user["id"], per_page, offset)
        ).fetchall()

    return {
        "predictions": [dict(p) for p in predictions],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page
    }


@router.get("/stats")
async def get_user_stats(current_user: dict = Depends(get_current_user)):
    """Get prediction statistics for the current user."""
    with get_db() as conn:
        stats = conn.execute(
            """SELECT
                COUNT(*) as total,
                SUM(CASE WHEN result='Malignant' THEN 1 ELSE 0 END) as malignant,
                SUM(CASE WHEN result='Benign' THEN 1 ELSE 0 END) as benign,
                AVG(confidence) as avg_confidence
               FROM predictions WHERE user_id = ?""",
            (current_user["id"],)
        ).fetchone()

        recent = conn.execute(
            """SELECT * FROM predictions WHERE user_id = ?
               ORDER BY created_at DESC LIMIT 5""",
            (current_user["id"],)
        ).fetchall()

        # Confidence distribution
        distribution = conn.execute(
            """SELECT
                CASE
                    WHEN confidence < 0.5 THEN '0-50%'
                    WHEN confidence < 0.7 THEN '50-70%'
                    WHEN confidence < 0.85 THEN '70-85%'
                    ELSE '85-100%'
                END as range,
                COUNT(*) as count
               FROM predictions WHERE user_id = ?
               GROUP BY range ORDER BY range""",
            (current_user["id"],)
        ).fetchall()

        # Daily predictions (last 7 days)
        daily = conn.execute(
            """SELECT DATE(created_at) as date, COUNT(*) as count
               FROM predictions WHERE user_id = ?
               GROUP BY DATE(created_at)
               ORDER BY date DESC LIMIT 7""",
            (current_user["id"],)
        ).fetchall()

    return {
        "total": stats["total"] or 0,
        "malignant": stats["malignant"] or 0,
        "benign": stats["benign"] or 0,
        "avg_confidence": round(stats["avg_confidence"] or 0, 3),
        "recent": [dict(r) for r in recent],
        "confidence_distribution": [dict(d) for d in distribution],
        "daily_predictions": [dict(d) for d in daily]
    }


@router.delete("/{prediction_id}")
async def delete_prediction(
    prediction_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Delete a single prediction record."""
    with get_db() as conn:
        result = conn.execute(
            "DELETE FROM predictions WHERE id = ? AND user_id = ?",
            (prediction_id, current_user["id"])
        )
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Prediction not found")
        conn.commit()

    return {"message": "Prediction deleted successfully"}


@router.delete("")
async def clear_history(current_user: dict = Depends(get_current_user)):
    """Clear all prediction history for the current user."""
    with get_db() as conn:
        conn.execute(
            "DELETE FROM predictions WHERE user_id = ?",
            (current_user["id"],)
        )
        conn.commit()

    return {"message": "History cleared successfully"}
