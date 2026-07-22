"""
NeuroTraceX — Score & Results API Routes

Endpoints for retrieving computed scores and triggering
divergence score computation.
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.models.participant import Participant
from app.models.score import Score
from app.schemas.score import ResultsResponse, ScoreResponse

router = APIRouter(prefix="/scores", tags=["Scores"])


@router.get(
    "/{session_id}",
    response_model=ScoreResponse,
    summary="Get divergence scores",
)
async def get_scores(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Retrieve computed divergence scores for a participant."""
    result = await db.execute(
        select(Score)
        .join(Participant, Score.participant_id == Participant.id)
        .where(Participant.session_id == session_id)
    )
    score = result.scalar_one_or_none()

    if score is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scores not found for this session.",
        )

    return score


@router.post(
    "/compute/{session_id}",
    response_model=ScoreResponse,
    summary="Trigger divergence score computation",
)
async def compute_scores(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Trigger the divergence scoring pipeline for a participant.
    This will be implemented with sentence-transformers later.
    For now, returns existing scores or a placeholder.
    """
    result = await db.execute(
        select(Score)
        .join(Participant, Score.participant_id == Participant.id)
        .where(Participant.session_id == session_id)
    )
    score = result.scalar_one_or_none()

    if score is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Participant not found.",
        )

    # Call the divergence service
    from app.services.divergence import compute_participant_divergence
    score = await compute_participant_divergence(score.participant_id, db)

    return score


@router.get(
    "/results/{session_id}",
    response_model=ResultsResponse,
    summary="Get full results page data",
)
async def get_results(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Get everything needed for the participant's results page:
    scores, AI interpretation, and total participant count.
    """
    # Get participant
    part_result = await db.execute(
        select(Participant).where(Participant.session_id == session_id)
    )
    participant = part_result.scalar_one_or_none()

    if participant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Participant not found.",
        )

    # Get scores
    score_result = await db.execute(
        select(Score).where(Score.participant_id == participant.id)
    )
    score = score_result.scalar_one_or_none()

    if score is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scores not yet computed.",
        )

    # Count total completed participants
    count_result = await db.execute(
        select(func.count(Participant.id))
    )
    total = count_result.scalar() or 0

    return ResultsResponse(
        session_id=participant.session_id,
        first_name=participant.first_name,
        scores=ScoreResponse.model_validate(score),
        total_participants=total,
    )
