"""
NeuroTraceX — Score Schemas

Pydantic v2 models for divergence scores and AI interpretation results.
"""

import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class ScoreResponse(BaseModel):
    """Full score breakdown for a participant."""
    participant_id: uuid.UUID
    rei_experiential: float | None = None
    rei_rational: float | None = None
    crt_score: int | None = None
    factual_divergence: float | None = None
    interpretive_divergence: float | None = None
    emotional_divergence: float | None = None
    overall_divergence_immediate: float | None = None
    overall_divergence_delayed: float | None = None
    ai_interpretation_text: str | None = None
    created_at: datetime | None = None

    model_config = {"from_attributes": True}


class ResultsResponse(BaseModel):
    """Full results page data — scores + interpretation + metadata."""
    session_id: uuid.UUID
    first_name: str
    scores: ScoreResponse
    total_participants: int = Field(
        ...,
        description="Total completed participants (for percentile context).",
    )


class ComputeScoreRequest(BaseModel):
    """Request to trigger divergence score computation."""
    session_id: uuid.UUID


class AdminStatsResponse(BaseModel):
    """Aggregate study statistics for the researcher dashboard."""
    total_participants: int
    session1_completed: int
    session2_completed: int
    avg_rei_experiential: float | None = None
    avg_rei_rational: float | None = None
    avg_overall_divergence: float | None = None
