"""
NeuroTraceX — Participant Schemas

Pydantic v2 models for participant data validation and serialization.
"""

import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# --- Request Schemas ---

class ConsentCreate(BaseModel):
    """Request body for registering a new participant (Step 1 — Consent)."""
    first_name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr


# --- Response Schemas ---

class ParticipantResponse(BaseModel):
    """Participant data returned to the frontend."""
    id: uuid.UUID
    session_id: uuid.UUID
    first_name: str
    consent_timestamp: datetime
    session2_completed: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ConsentResponse(BaseModel):
    """Response after successful consent registration."""
    session_id: uuid.UUID
    message: str = "Consent recorded successfully."
