"""
DermAI — Configuration Settings
=================================
Pydantic-based settings with environment variable support.
"""

import os
from pathlib import Path

# ─── Base Paths ──────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent

# ─── App Settings ────────────────────────────────────────────────
SECRET_KEY = os.getenv("DERMAI_SECRET_KEY", "dermai-dev-secret-key-change-in-production-2026")
DEBUG = os.getenv("DERMAI_DEBUG", "True").lower() == "true"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# ─── Database ────────────────────────────────────────────────────
DATABASE_PATH = str(BASE_DIR / "dermai.db")

# ─── Upload Settings ─────────────────────────────────────────────
UPLOAD_FOLDER = str(BASE_DIR / "static" / "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "bmp", "tiff", "webp"}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16 MB

# ─── Model Settings ──────────────────────────────────────────────
MODEL_PATH = str(BASE_DIR / "model.tflite")
IMAGE_SIZE = (224, 224)
CONFIDENCE_THRESHOLD = 0.5

# ─── Class Labels ────────────────────────────────────────────────
CLASS_LABELS = {0: "Benign", 1: "Malignant"}

# ─── CORS ────────────────────────────────────────────────────────
CORS_ORIGINS = os.getenv("DERMAI_CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")

# ─── Rate Limiting ───────────────────────────────────────────────
RATE_LIMIT_PREDICTIONS = 30  # per minute
RATE_LIMIT_AUTH = 10  # per minute

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
