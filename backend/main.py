"""
DermAI — FastAPI Main Application
====================================
Entry point for the cancer detection API server.
"""

import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from datetime import datetime

from config import CORS_ORIGINS, DEBUG
from database import init_db
from ml.predictor import load_model, is_model_loaded


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # ─── Startup ─────────────────────────────────────────────
    print("\n" + "=" * 55)
    print("  [DermAI] — Cancer Detection Platform")
    print("=" * 55)

    init_db()
    load_model()

    if is_model_loaded():
        print("  [Model] VGG16 TFLite (PRODUCTION mode)")
    else:
        print("  [WARNING] Model: DEMO mode (random predictions)")

    print(f"  [API] http://localhost:8000")
    print(f"  [Docs] http://localhost:8000/docs")
    print(f"  [Admin] Default admin: admin / admin123")
    print("=" * 55 + "\n")

    yield

    # ─── Shutdown ────────────────────────────────────────────
    print("\n[STOP] DermAI shutting down...")


# ─── Create App ──────────────────────────────────────────────────
app = FastAPI(
    title="DermAI — Cancer Detection API",
    description="AI-powered skin lesion analysis using VGG16 deep learning",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs" if DEBUG else None,
    redoc_url="/redoc" if DEBUG else None,
)

# ─── CORS Middleware ─────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Static Files ────────────────────────────────────────────────
static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# ─── Register Routes ────────────────────────────────────────────
from routes.auth_routes import router as auth_router
from routes.predict_routes import router as predict_router
from routes.patient_routes import router as patient_router
from routes.admin_routes import router as admin_router

app.include_router(auth_router)
app.include_router(predict_router)
app.include_router(patient_router)
app.include_router(admin_router)


# ─── Health Check ────────────────────────────────────────────────
@app.get("/api/health", tags=["System"])
async def health_check():
    """API health check endpoint."""
    return {
        "status": "healthy",
        "model_loaded": is_model_loaded(),
        "timestamp": datetime.utcnow().isoformat(),
        "version": "2.0.0"
    }


# ─── Root Redirect ──────────────────────────────────────────────
@app.get("/", tags=["System"])
async def root():
    """Root endpoint — API info."""
    return {
        "app": "DermAI — Cancer Detection Platform",
        "version": "2.0.0",
        "api_docs": "/docs",
        "health": "/api/health"
    }


# ─── Entry Point ────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=DEBUG)
