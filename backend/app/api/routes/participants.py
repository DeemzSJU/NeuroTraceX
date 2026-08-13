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
from app.models.response import Response
from app.models.score import Score
from app.schemas.participant import (
    ConsentCreate,
    ConsentResponse,
    ParticipantResponse,
    ParticipantProgressResponse,
    SessionCompleteRequest,
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
        user_id=data.user_id,
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


@router.get(
    "/user/{user_id}/progress",
    response_model=ParticipantProgressResponse,
    summary="Look up participant progress by user ID",
)
async def get_participant_progress(
    user_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Look up participant progress details by their Supabase user_id.
    """
    import datetime as dt
    from app.models.response import QuestionType

    # 1. Query participant
    result = await db.execute(
        select(Participant).where(Participant.user_id == user_id)
    )
    participant = result.scalar_one_or_none()
    
    if not participant:
        return ParticipantProgressResponse(
            has_consented=False,
            current_step="consent",
            session1_completed=False,
            session2_completed=False,
        )

    # 2. Query all responses to evaluate completed sections
    resp_result = await db.execute(
        select(Response).where(Response.participant_id == participant.id)
    )
    responses = resp_result.scalars().all()

    has_rei = any(r.question_type == QuestionType.REI for r in responses)
    has_crt = any(r.question_type == QuestionType.CRT for r in responses)
    has_video_end = any(r.question_id == "playback_end" for r in responses)
    has_recall = any(r.question_type == QuestionType.FREE_RECALL for r in responses)
    
    # Check session 1 structured questions directly from the model
    session1_completed = participant.session1_completed

    # Determine current step
    if not has_rei:
        current_step = "rei"
    elif not has_crt:
        current_step = "crt"
    elif not has_video_end:
        current_step = "stimulus"
    elif not has_recall:
        current_step = "free_recall"
    elif not session1_completed:
        current_step = "structured"
    elif not participant.session2_completed:
        current_step = "thank_you"
    else:
        current_step = "results"

    # Calculate session 2 availability details
    session2_available_at = None
    time_remaining_seconds = None
    
    if session1_completed:
        # Completion timestamp of Session 1 from the database
        completion_time = participant.session1_completed_at or participant.created_at
        if completion_time.tzinfo is None:
            completion_time = completion_time.replace(tzinfo=dt.timezone.utc)
        
        session2_available_at = completion_time + dt.timedelta(hours=48)
        now = dt.datetime.now(dt.timezone.utc)
        time_remaining_seconds = int((session2_available_at - now).total_seconds())
        
        # If 48 hours have passed and session 2 hasn't been completed yet
        if time_remaining_seconds <= 0 and current_step == "thank_you":
            current_step = "session2"

    # Calculate how many structured questions have been answered for the current session
    structured_types = {QuestionType.FACTUAL, QuestionType.INTERPRETIVE, QuestionType.EMOTIONAL}
    session_number = 2 if current_step in ("session2", "results") else 1
    structured_responses = [
        r for r in responses
        if r.question_type in structured_types and r.session_number == session_number
    ]
    structured_q_index = len(structured_responses)

    return ParticipantProgressResponse(
        has_consented=True,
        session_id=participant.session_id,
        first_name=participant.first_name,
        email=participant.email,
        current_step=current_step,
        session1_completed=session1_completed,
        session1_completed_at=participant.session1_completed_at,
        session2_completed=participant.session2_completed,
        session2_available_at=session2_available_at,
        time_remaining_seconds=time_remaining_seconds,
        structured_q_index=structured_q_index,
    )


@router.post(
    "/session1/complete",
    response_model=ParticipantResponse,
    summary="Mark Session 1 as completed",
)
async def complete_session1(
    data: SessionCompleteRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Explicitly mark Session 1 as completed and record the completion timestamp.
    """
    import datetime as dt

    result = await db.execute(
        select(Participant).where(Participant.session_id == data.session_id)
    )
    participant = result.scalar_one_or_none()

    if participant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Participant not found.",
        )

    participant.session1_completed = True
    participant.session1_completed_at = dt.datetime.now(dt.timezone.utc)
    
    db.add(participant)
    await db.flush()

    return participant

