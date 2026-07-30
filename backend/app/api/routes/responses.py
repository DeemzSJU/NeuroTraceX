"""
NeuroTraceX — Response Submission API Routes

Endpoints for submitting every type of participant response:
REI-20, CRT, free recall, structured questions, and audio events.
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.models.participant import Participant
from app.models.response import QuestionType, Response
from app.models.score import Score
from app.schemas.response import (
    AudioEventSubmit,
    VideoEventSubmit,
    CRTScoreResponse,
    CRTSubmit,
    FreeRecallSubmit,
    REIScoreResponse,
    REISubmit,
    ResponseAck,
    StructuredAnswerSubmit,
)

from app.services.scoring import compute_rei_scores

router = APIRouter(prefix="/responses", tags=["Responses"])


# ── Helpers ──────────────────────────────────────────────────────────

async def _get_participant_by_session(
    session_id: uuid.UUID, db: AsyncSession
) -> Participant:
    """Look up a participant by session_id or raise 404."""
    result = await db.execute(
        select(Participant).where(Participant.session_id == session_id)
    )
    participant = result.scalar_one_or_none()
    if participant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Participant not found.",
        )
    return participant


# ── REI-20 ───────────────────────────────────────────────────────────

@router.post(
    "/rei",
    response_model=REIScoreResponse,
    summary="Submit REI-20 answers",
)
async def submit_rei(
    data: REISubmit,
    db: AsyncSession = Depends(get_db),
):
    """
    Step 2a — Submit all 20 REI Likert-scale answers.
    Stores each answer as a separate response row, then computes
    and stores experiential and rational subscale scores.
    """
    participant = await _get_participant_by_session(data.session_id, db)

    # Store individual answers
    for idx, value in enumerate(data.answers):
        response = Response(
            participant_id=participant.id,
            question_id=f"rei_{idx + 1}",
            question_type=QuestionType.REI,
            answer_value=value,
            session_number=1,
        )
        db.add(response)

    # Compute subscale scores using the scoring service
    try:
        experiential_score, rational_score = compute_rei_scores(data.answers)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    # Update the score record
    result = await db.execute(
        select(Score).where(Score.participant_id == participant.id)
    )
    score = result.scalar_one_or_none()
    if score:
        score.rei_experiential = experiential_score
        score.rei_rational = rational_score

    return REIScoreResponse(
        experiential_score=experiential_score,
        rational_score=rational_score,
    )


# ── CRT ──────────────────────────────────────────────────────────────

@router.post(
    "/crt",
    response_model=CRTScoreResponse,
    summary="Submit CRT answers",
)
async def submit_crt(
    data: CRTSubmit,
    db: AsyncSession = Depends(get_db),
):
    """
    Step 2b — Submit all 3 CRT answers.
    Scores each against the correct answer key.
    """
    participant = await _get_participant_by_session(data.session_id, db)

    # CRT correct answers (Frederick, 2005)
    correct_answers = ["0.05", "5", "47"]
    crt_score = 0

    for idx, answer in enumerate(data.answers):
        is_correct = answer.strip() == correct_answers[idx]
        if is_correct:
            crt_score += 1

        response = Response(
            participant_id=participant.id,
            question_id=f"crt_{idx + 1}",
            question_type=QuestionType.CRT,
            answer_text=answer,
            answer_value=1 if is_correct else 0,
            session_number=1,
        )
        db.add(response)

    # Update the score record
    result = await db.execute(
        select(Score).where(Score.participant_id == participant.id)
    )
    score = result.scalar_one_or_none()
    if score:
        score.crt_score = crt_score

    return CRTScoreResponse(crt_score=crt_score)


# ── Free Recall ──────────────────────────────────────────────────────

@router.post(
    "/free-recall",
    response_model=ResponseAck,
    summary="Submit free recall response",
)
async def submit_free_recall(
    data: FreeRecallSubmit,
    db: AsyncSession = Depends(get_db),
):
    """
    Step 4 — Submit the free recall text and duration.
    """
    participant = await _get_participant_by_session(data.session_id, db)

    response = Response(
        participant_id=participant.id,
        question_id="free_recall",
        question_type=QuestionType.FREE_RECALL,
        answer_text=data.recall_text,
        response_time_ms=data.duration_seconds * 1000,
        session_number=1,
    )
    db.add(response)

    return ResponseAck(message="Free recall recorded.")


# ── Structured Questions ─────────────────────────────────────────────

@router.post(
    "/structured",
    response_model=ResponseAck,
    summary="Submit a structured question answer",
)
async def submit_structured_answer(
    data: StructuredAnswerSubmit,
    db: AsyncSession = Depends(get_db),
):
    """
    Step 5 — Submit a single structured recall question answer.
    Called once per question (20 total per session).
    """
    participant = await _get_participant_by_session(data.session_id, db)

    question_type_map = {
        "factual": QuestionType.FACTUAL,
        "interpretive": QuestionType.INTERPRETIVE,
        "emotional": QuestionType.EMOTIONAL,
    }

    response = Response(
        participant_id=participant.id,
        question_id=data.question_id,
        question_type=question_type_map[data.question_type],
        answer_text=data.answer_text,
        response_time_ms=data.response_time_ms,
        session_number=data.session_number,
    )
    db.add(response)

    return ResponseAck()


# ── Video & Audio Events ─────────────────────────────────────────────

@router.post(
    "/video-event",
    response_model=ResponseAck,
    summary="Log video playback event",
)
async def submit_video_event(
    data: VideoEventSubmit,
    db: AsyncSession = Depends(get_db),
):
    """
    Step 3 — Log when the video stimulus starts and stops playing.
    """
    participant = await _get_participant_by_session(data.session_id, db)

    response = Response(
        participant_id=participant.id,
        question_id=data.event_type,
        question_type=QuestionType.VIDEO_EVENT,
        answer_text=data.timestamp.isoformat(),
        session_number=1,
    )
    db.add(response)

    return ResponseAck(message=f"Video {data.event_type} recorded.")


@router.post(
    "/audio-event",
    response_model=ResponseAck,
    summary="Log audio playback event",
)
async def submit_audio_event(
    data: AudioEventSubmit,
    db: AsyncSession = Depends(get_db),
):
    """
    Step 3 — Log when the audio/video stimulus starts and stops playing (legacy endpoint).
    """
    participant = await _get_participant_by_session(data.session_id, db)

    response = Response(
        participant_id=participant.id,
        question_id=data.event_type,
        question_type=QuestionType.VIDEO_EVENT,
        answer_text=data.timestamp.isoformat(),
        session_number=1,
    )
    db.add(response)

    return ResponseAck(message=f"Audio {data.event_type} recorded.")
