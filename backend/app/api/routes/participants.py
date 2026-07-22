"""
NeuroTraceX — Participant API Routes

Handles consent registration and participant session lookup.
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.models.participant import Participant
from app.models.score import Score
from app.schemas.participant import (
    ConsentCreate,
    ConsentResponse,
    ParticipantResponse,
)

router = APIRouter(prefix="/participants", tags=["Participants"])


@router.post(
    "/consent",
    response_model=ConsentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register participant consent",
)
async def create_consent(
    data: ConsentCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    Step 1 — Record informed consent.
    Creates a new participant with a unique anonymous session_id.
    Also initialises an empty Score row for later computation.
    """
    participant = Participant(
        first_name=data.first_name,
        email=data.email,
    )
    db.add(participant)
    await db.flush()

    # Pre-create the score row so it's ready when we compute later
    score = Score(participant_id=participant.id)
    db.add(score)

    return ConsentResponse(session_id=participant.session_id)


@router.get(
    "/{session_id}",
    response_model=ParticipantResponse,
    summary="Look up participant by session ID",
)
async def get_participant(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieve participant info by their anonymous session_id.
    Used when a participant returns for Session 2 via their unique link.
    """
    result = await db.execute(
        select(Participant).where(Participant.session_id == session_id)
    )
    participant = result.scalar_one_or_none()

    if participant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Participant not found. Please check your session link.",
        )

    return participant
