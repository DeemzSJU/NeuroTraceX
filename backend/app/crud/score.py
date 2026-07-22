"""
NeuroTraceX — Score CRUD Operations
"""

import uuid
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.score import Score


async def get_score_by_participant_id(
    db: AsyncSession, participant_id: uuid.UUID
) -> Optional[Score]:
    """Retrieve the score record for a participant."""
    result = await db.execute(
        select(Score).where(Score.participant_id == participant_id)
    )
    return result.scalar_one_or_none()


async def create_empty_score(
    db: AsyncSession, participant_id: uuid.UUID
) -> Score:
    """Creates a default empty Score row for a participant."""
    score = Score(participant_id=participant_id)
    db.add(score)
    await db.flush()
    return score
