"""
NeuroTraceX — Participant Model

Represents a study participant. Identified only by a random
session_id (UUID) — never by name. Email is stored for Session 2
reminders only and is kept separate in analysis.
"""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Participant(Base):
    """Participants table — one row per consented individual."""

    __tablename__ = "participants"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        unique=True,
        nullable=False,
        default=uuid.uuid4,
        index=True,
    )
    first_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    consent_timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    session2_completed: Mapped[bool] = mapped_column(
        default=False,
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    # Relationships
    responses: Mapped[list["Response"]] = relationship(
        "Response",
        back_populates="participant",
        cascade="all, delete-orphan",
    )
    score: Mapped["Score"] = relationship(
        "Score",
        back_populates="participant",
        uselist=False,
        cascade="all, delete-orphan",
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.id:
            self.id = uuid.uuid4()
        if not self.session_id:
            self.session_id = uuid.uuid4()

    def __repr__(self) -> str:
        return f"<Participant session_id={self.session_id}>"
