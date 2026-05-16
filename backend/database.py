"""
DermAI — Database Layer
========================
SQLite database with schema initialization and helper functions.
"""

import sqlite3
import secrets
from datetime import datetime
from contextlib import contextmanager
from passlib.hash import bcrypt

from config import DATABASE_PATH


@contextmanager
def get_db():
    """Context manager for database connections."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db():
    """Initialize the database schema and default admin user."""
    with get_db() as conn:
        cursor = conn.cursor()

        # Users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE,
                password_hash TEXT NOT NULL,
                role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
                is_active INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP
            )
        """)

        # Patients / Prediction records table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS predictions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                patient_name TEXT NOT NULL,
                patient_age INTEGER,
                result TEXT NOT NULL,
                confidence REAL NOT NULL,
                risk_level TEXT NOT NULL,
                image_path TEXT,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)

        # Activity logs table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS activity_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                action TEXT NOT NULL,
                details TEXT,
                ip_address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            )
        """)

        # Insert default admin if not exists
        cursor.execute("SELECT id FROM users WHERE username = ?", ("admin",))
        if cursor.fetchone() is None:
            hashed = bcrypt.hash("admin123")
            cursor.execute(
                "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
                ("admin", "admin@dermai.local", hashed, "admin")
            )
            print("[SUCCESS] Default admin account created (admin / admin123)")

        conn.commit()
    print("[SUCCESS] Database initialized successfully")


def log_activity(user_id: int, action: str, details: str = None, ip_address: str = None):
    """Log a user activity."""
    with get_db() as conn:
        conn.execute(
            "INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)",
            (user_id, action, details, ip_address)
        )


if __name__ == "__main__":
    init_db()
