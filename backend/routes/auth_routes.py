"""
DermAI — Authentication Routes
================================
Login, register, and user profile endpoints.
"""

from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends

from models import UserCreate, UserLogin, TokenResponse, UserResponse
from auth import hash_password, verify_password, create_access_token, get_current_user
from database import get_db, log_activity

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(user: UserCreate):
    """Register a new user account."""
    with get_db() as conn:
        # Check if username exists
        existing = conn.execute(
            "SELECT id FROM users WHERE username = ?", (user.username,)
        ).fetchone()
        if existing:
            raise HTTPException(status_code=409, detail="Username already taken")

        # Check if email exists (if provided)
        if user.email:
            existing_email = conn.execute(
                "SELECT id FROM users WHERE email = ?", (user.email,)
            ).fetchone()
            if existing_email:
                raise HTTPException(status_code=409, detail="Email already registered")

        # Create user
        hashed = hash_password(user.password)
        cursor = conn.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
            (user.username, user.email, hashed)
        )
        user_id = cursor.lastrowid
        conn.commit()

    # Generate token
    token = create_access_token({"sub": str(user_id), "role": "user"})
    log_activity(user_id, "register", f"New user registered: {user.username}")

    return TokenResponse(
        access_token=token,
        user={"id": user_id, "username": user.username, "role": "user"}
    )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """Authenticate user and return JWT token."""
    with get_db() as conn:
        user = conn.execute(
            "SELECT * FROM users WHERE username = ?", (credentials.username,)
        ).fetchone()

        if not user or not verify_password(credentials.password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid username or password")

        if not user["is_active"]:
            raise HTTPException(status_code=403, detail="Account is disabled")

        # Update last login
        conn.execute(
            "UPDATE users SET last_login = ? WHERE id = ?",
            (datetime.utcnow().isoformat(), user["id"])
        )
        conn.commit()

    token = create_access_token({"sub": str(user["id"]), "role": user["role"]})
    log_activity(user["id"], "login", f"User logged in: {user['username']}")

    return TokenResponse(
        access_token=token,
        user={
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "role": user["role"]
        }
    )


@router.get("/me", response_model=UserResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get current user's profile."""
    with get_db() as conn:
        user = conn.execute(
            "SELECT * FROM users WHERE id = ?", (current_user["id"],)
        ).fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse(
        id=user["id"],
        username=user["username"],
        email=user["email"],
        role=user["role"],
        is_active=bool(user["is_active"]),
        created_at=str(user["created_at"]),
        last_login=str(user["last_login"]) if user["last_login"] else None
    )
