"""
DermAI — Pydantic Models / Schemas
====================================
Request and response models for the API.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ═══════════════════════════════════════════════════════════════════
#  AUTH MODELS
# ═══════════════════════════════════════════════════════════════════

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: Optional[str] = None
    password: str = Field(..., min_length=4, max_length=128)


class UserLogin(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class UserResponse(BaseModel):
    id: int
    username: str
    email: Optional[str]
    role: str
    is_active: bool
    created_at: str
    last_login: Optional[str]


# ═══════════════════════════════════════════════════════════════════
#  PREDICTION MODELS
# ═══════════════════════════════════════════════════════════════════

class PredictionResult(BaseModel):
    id: Optional[int] = None
    patient_name: str
    patient_age: Optional[int] = None
    result: str  # "Benign" or "Malignant"
    confidence: float  # 0.0 to 1.0
    risk_level: str  # "Low", "Medium", "High"
    image_path: Optional[str] = None
    created_at: Optional[str] = None
    model_info: Optional[dict] = None


class PredictionHistory(BaseModel):
    predictions: List[PredictionResult]
    total: int
    page: int = 1
    per_page: int = 20


# ═══════════════════════════════════════════════════════════════════
#  ADMIN / STATS MODELS
# ═══════════════════════════════════════════════════════════════════

class DashboardStats(BaseModel):
    total_predictions: int
    total_benign: int
    total_malignant: int
    total_users: int
    recent_predictions: List[dict]
    confidence_distribution: List[dict]
    daily_predictions: List[dict]


class AdminStats(BaseModel):
    total_users: int
    total_predictions: int
    total_benign: int
    total_malignant: int
    active_users_today: int
    model_loaded: bool
    storage_used_mb: float
    recent_activity: List[dict]


# ═══════════════════════════════════════════════════════════════════
#  CONTACT MODEL
# ═══════════════════════════════════════════════════════════════════

class ContactMessage(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=200)
    subject: str = Field(..., min_length=3, max_length=200)
    message: str = Field(..., min_length=10, max_length=5000)
