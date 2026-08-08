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
    email: EmailStr | None = None   # no longer required on the consent form
    user_id: uuid.UUID | None = None


class SessionCompleteRequest(BaseModel):
    """Request body for marking a session stage completed."""
    session_id: uuid.UUID



# --- Response Schemas ---

class ParticipantResponse(BaseModel):
    """Participant data returned to the frontend."""
    id: uuid.UUID
    session_id: uuid.UUID
    first_name: str
    consent_timestamp: datetime
    session1_completed: bool
    session1_completed_at: datetime | None
    session2_completed: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ConsentResponse(BaseModel):
    """Response after successful consent registration."""
    session_id: uuid.UUID
    message: str = "Consent recorded successfully."


class ParticipantProgressResponse(BaseModel):
    """Current participant progress state."""
    has_consented: bool
    session_id: uuid.UUID | None = None
    first_name: str | None = None
    email: str | None = None
    current_step: str
    session1_completed: bool
    session1_completed_at: datetime | None = None
    session2_completed: bool
    session2_available_at: datetime | None = None
    time_remaining_seconds: int | None = None
