"""
NeuroTraceX — Utility Helpers
"""

import uuid
from datetime import datetime, timezone


def generate_session_id() -> uuid.UUID:
    """Generates a secure, cryptographically random UUID v4 session ID."""
    return uuid.uuid4()


def get_utc_now() -> datetime:
    """Returns the current timezone-aware UTC datetime."""
    return datetime.now(timezone.utc)
