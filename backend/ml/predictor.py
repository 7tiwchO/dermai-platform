"""
DermAI — ML Prediction Engine
================================
TFLite model loading and inference for skin lesion classification.
Falls back to demo mode when model file is absent.
"""

import os
import time
import random
import numpy as np
from PIL import Image
from typing import Tuple, Optional

from config import MODEL_PATH, IMAGE_SIZE, CONFIDENCE_THRESHOLD, CLASS_LABELS

# ─── Model State ─────────────────────────────────────────────────
_interpreter = None
_model_loaded = False
_model_load_time = None

# Try importing TFLite
try:
    import tensorflow as tf
    TF_AVAILABLE = True
except ImportError:
    try:
        import tflite_runtime.interpreter as tflite
        TF_AVAILABLE = True
    except ImportError:
        TF_AVAILABLE = False
        print("[WARNING] TensorFlow/TFLite not installed. Running in demo mode.")


def load_model() -> bool:
    """Load the TFLite model. Returns True if successful."""
    global _interpreter, _model_loaded, _model_load_time

    if not TF_AVAILABLE:
        print("[INFO] TensorFlow not available — demo mode active.")
        return False

    if not os.path.exists(MODEL_PATH):
        print(f"[INFO] Model not found at {MODEL_PATH} — demo mode active.")
        return False

    try:
        start = time.time()
        if 'tf' in dir():
            _interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
        else:
            _interpreter = tflite.Interpreter(model_path=MODEL_PATH)
        _interpreter.allocate_tensors()
        _model_load_time = time.time() - start
        _model_loaded = True
        print(f"[SUCCESS] TFLite model loaded in {_model_load_time:.2f}s")
        return True
    except Exception as e:
        print(f"[WARNING] Could not load model: {e}")
        return False


def is_model_loaded() -> bool:
    """Check if a real model is loaded."""
    return _model_loaded


def get_model_info() -> dict:
    """Get information about the loaded model."""
    return {
        "loaded": _model_loaded,
        "type": "VGG16 Transfer Learning (TFLite)",
        "input_size": f"{IMAGE_SIZE[0]}x{IMAGE_SIZE[1]}",
        "classes": list(CLASS_LABELS.values()),
        "threshold": CONFIDENCE_THRESHOLD,
        "load_time_ms": round(_model_load_time * 1000, 1) if _model_load_time else None,
        "mode": "production" if _model_loaded else "demo"
    }


def preprocess_image(image_path: str) -> np.ndarray:
    """Load and preprocess an image for model inference."""
    img = Image.open(image_path).convert("RGB")
    img = img.resize(IMAGE_SIZE, Image.Resampling.LANCZOS)
    img_array = np.array(img, dtype=np.float32)
    img_array = img_array / 255.0  # Normalize to [0, 1]
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    return img_array


def predict(image_path: str) -> dict:
    """
    Run prediction on a skin lesion image.
    Returns dict with result, confidence, risk_level, inference_time.
    """
    start_time = time.time()

    if _model_loaded and _interpreter is not None:
        # ─── Real Model Inference ────────────────────────────────
        img_array = preprocess_image(image_path)

        input_details = _interpreter.get_input_details()
        output_details = _interpreter.get_output_details()

        _interpreter.set_tensor(input_details[0]["index"], img_array)
        _interpreter.invoke()

        prediction = _interpreter.get_tensor(output_details[0]["index"])
        probability = float(prediction[0][0])
    else:
        # ─── Demo Mode ───────────────────────────────────────────
        # Generate a deterministic prediction based on the image content
        import hashlib
        with open(image_path, "rb") as f:
            file_hash = hashlib.md5(f.read()).hexdigest()
        hash_val = int(file_hash, 16)
        probability = (hash_val % 10000) / 10000.0

    inference_time = time.time() - start_time

    # Determine result and risk level
    is_malignant = probability > CONFIDENCE_THRESHOLD
    result = CLASS_LABELS[1] if is_malignant else CLASS_LABELS[0]
    confidence = probability if is_malignant else (1.0 - probability)

    # Risk level based on confidence
    if confidence > 0.85:
        risk_level = "High"
    elif confidence > 0.65:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return {
        "result": result,
        "confidence": round(confidence, 4),
        "risk_level": risk_level,
        "raw_probability": round(probability, 4),
        "inference_time_ms": round(inference_time * 1000, 1),
        "model_mode": "production" if _model_loaded else "demo"
    }
