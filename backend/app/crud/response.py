"""
NeuroTraceX — Response CRUD Operations
"""

import uuid
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.response import Response, QuestionType


async def create_response(
    db: AsyncSession,
    participant_id: uuid.UUID,
    question_id: str,
    question_type: QuestionType,
    answer_text: Optional[str] = None,
    answer_value: Optional[int] = None,
    response_time_ms: Optional[int] = None,
    session_number: int = 1,
) -> Response:
    """Create and return a new Response record."""
    response = Response(
        participant_id=participant_id,
        question_id=question_id,
        question_type=question_type,
        answer_text=answer_text,
        answer_value=answer_value,
        response_time_ms=response_time_ms,
        session_number=session_number,
    )
    db.add(response)
    await db.flush()
    return response


async def get_participant_responses(
    db: AsyncSession, participant_id: uuid.UUID
) -> List[Response]:
    """Retrieve all responses submitted by a specific participant."""
    result = await db.execute(
        select(Response)
        .where(Response.participant_id == participant_id)
        .order_by(Response.created_at)
    )
    return list(result.scalars().all())
