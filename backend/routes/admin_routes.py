"""
DermAI — Admin Routes
======================
Admin-only endpoints for system management and monitoring.
"""

import os
from fastapi import APIRouter, Depends, Query

from auth import require_admin
from database import get_db
from config import UPLOAD_FOLDER
from ml.predictor import is_model_loaded

router = APIRouter(prefix="/api/admin", tags=["Admin"])


def get_folder_size_mb(path: str) -> float:
    """Calculate folder size in MB."""
    total = 0
    if os.path.exists(path):
        for dirpath, dirnames, filenames in os.walk(path):
            for f in filenames:
                fp = os.path.join(dirpath, f)
                total += os.path.getsize(fp)
    return round(total / (1024 * 1024), 2)


@router.get("/stats")
async def admin_stats(admin: dict = Depends(require_admin)):
    """Get comprehensive system statistics."""
    with get_db() as conn:
        user_count = conn.execute("SELECT COUNT(*) as c FROM users").fetchone()["c"]

        prediction_stats = conn.execute(
            """SELECT
                COUNT(*) as total,
                SUM(CASE WHEN result='Malignant' THEN 1 ELSE 0 END) as malignant,
                SUM(CASE WHEN result='Benign' THEN 1 ELSE 0 END) as benign
               FROM predictions"""
        ).fetchone()

        active_today = conn.execute(
            """SELECT COUNT(DISTINCT user_id) as c FROM activity_logs
               WHERE DATE(created_at) = DATE('now')"""
        ).fetchone()["c"]

        recent_activity = conn.execute(
            """SELECT al.*, u.username
               FROM activity_logs al
               LEFT JOIN users u ON al.user_id = u.id
               ORDER BY al.created_at DESC LIMIT 20"""
        ).fetchall()

    return {
        "total_users": user_count,
        "total_predictions": prediction_stats["total"] or 0,
        "total_benign": prediction_stats["benign"] or 0,
        "total_malignant": prediction_stats["malignant"] or 0,
        "active_users_today": active_today,
        "model_loaded": is_model_loaded(),
        "storage_used_mb": get_folder_size_mb(UPLOAD_FOLDER),
        "recent_activity": [dict(a) for a in recent_activity]
    }


@router.get("/users")
async def list_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    admin: dict = Depends(require_admin)
):
    """List all users with pagination."""
    offset = (page - 1) * per_page

    with get_db() as conn:
        total = conn.execute("SELECT COUNT(*) as c FROM users").fetchone()["c"]

        users = conn.execute(
            """SELECT u.id, u.username, u.email, u.role, u.is_active,
                      u.created_at, u.last_login,
                      COUNT(p.id) as prediction_count
               FROM users u
               LEFT JOIN predictions p ON u.id = p.user_id
               GROUP BY u.id
               ORDER BY u.created_at DESC
               LIMIT ? OFFSET ?""",
            (per_page, offset)
        ).fetchall()

    return {
        "users": [dict(u) for u in users],
        "total": total,
        "page": page,
        "per_page": per_page
    }


@router.get("/predictions")
async def all_predictions(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    admin: dict = Depends(require_admin)
):
    """List all predictions across all users."""
    offset = (page - 1) * per_page

    with get_db() as conn:
        total = conn.execute("SELECT COUNT(*) as c FROM predictions").fetchone()["c"]

        predictions = conn.execute(
            """SELECT p.*, u.username
               FROM predictions p
               LEFT JOIN users u ON p.user_id = u.id
               ORDER BY p.created_at DESC
               LIMIT ? OFFSET ?""",
            (per_page, offset)
        ).fetchall()

    return {
        "predictions": [dict(p) for p in predictions],
        "total": total,
        "page": page,
        "per_page": per_page
    }


@router.patch("/users/{user_id}/toggle")
async def toggle_user(user_id: int, admin: dict = Depends(require_admin)):
    """Enable or disable a user account."""
    with get_db() as conn:
        user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        if not user:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="User not found")

        new_status = 0 if user["is_active"] else 1
        conn.execute("UPDATE users SET is_active = ? WHERE id = ?", (new_status, user_id))
        conn.commit()

    return {"message": f"User {'enabled' if new_status else 'disabled'} successfully"}
