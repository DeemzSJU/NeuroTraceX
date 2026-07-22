"""
NeuroTraceX — Participant CRUD Operations
"""

import uuid
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.participant import Participant


async def get_participant_by_session_id(
    db: AsyncSession, session_id: uuid.UUID
) -> Optional[Participant]:
    """Retrieve a participant record by session_id."""
    result = await db.execute(
        select(Participant).where(Participant.session_id == session_id)
    )
    return result.scalar_one_or_none()


async def create_participant(
    db: AsyncSession, first_name: str, email: str
) -> Participant:
    """Create a new participant record."""
    participant = Participant(
        first_name=first_name,
        email=email,
    )
    db.add(participant)
    await db.flush()
    return participant


async def mark_session2_completed(
    db: AsyncSession, participant_id: uuid.UUID
) -> Optional[Participant]:
    """Mark a participant's Session 2 as completed."""
    result = await db.execute(
        select(Participant).where(Participant.id == participant_id)
    )
    participant = result.scalar_one_or_none()
    if participant:
        participant.session2_completed = True
        db.add(participant)
    return participant
