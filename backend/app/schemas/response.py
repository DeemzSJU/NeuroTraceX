"""
NeuroTraceX — Response Schemas

Pydantic v2 models for experiment response submission and retrieval.
"""

import uuid
from datetime import datetime

from pydantic import BaseModel, Field


# --- Request Schemas ---

class REISubmit(BaseModel):
    """Submit all 40 REI items at once."""
    session_id: uuid.UUID
    answers: list[int] = Field(
        ...,
        min_length=40,
        max_length=40,
        description="40 Likert values (1-5), one per REI item.",
    )


class CRTSubmit(BaseModel):
    """Submit all 3 CRT answers."""
    session_id: uuid.UUID
    answers: list[str] = Field(
        ...,
        min_length=3,
        max_length=3,
        description="3 text answers, one per CRT item.",
    )


class FreeRecallSubmit(BaseModel):
    """Submit the free recall response (Step 4)."""
    session_id: uuid.UUID
    recall_text: str = Field(..., min_length=1)
    duration_seconds: int = Field(..., ge=0, description="Time spent writing (seconds).")


class StructuredAnswerSubmit(BaseModel):
    """Submit a single structured question answer."""
    session_id: uuid.UUID
    question_id: str
    question_type: str = Field(
        ...,
        pattern="^(factual|interpretive|emotional)$",
    )
    answer_text: str = Field(..., min_length=1)
    response_time_ms: int = Field(..., ge=0)
    session_number: int = Field(..., ge=1, le=2)


class AudioEventSubmit(BaseModel):
    """Log audio playback start/end timestamps (Step 3)."""
    session_id: uuid.UUID
    event_type: str = Field(..., pattern="^(playback_start|playback_end)$")
    timestamp: datetime


# --- Response Schemas ---

class ResponseAck(BaseModel):
    """Generic acknowledgement after a response is stored."""
    success: bool = True
    message: str = "Response recorded."


class REIScoreResponse(BaseModel):
    """Computed REI scores returned after REI submission."""
    experiential_score: float
    rational_score: float
    message: str = "REI-40 scores computed."


class CRTScoreResponse(BaseModel):
    """Computed CRT score returned after CRT submission."""
    crt_score: int = Field(..., ge=0, le=3)
    message: str = "CRT score computed."
