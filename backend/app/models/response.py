"""
NeuroTraceX — Response Model

Stores every participant response: REI-40 items, CRT answers,
free recall text, structured question answers, and audio events.
Each response is tagged with question type, session number (1 or 2),
and response time in milliseconds.
"""

import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class QuestionType(str, enum.Enum):
    """Categories of questions in the experiment."""
    REI = "rei"
    CRT = "crt"
    FREE_RECALL = "free_recall"
    FACTUAL = "factual"
    INTERPRETIVE = "interpretive"
    EMOTIONAL = "emotional"
    AUDIO_EVENT = "audio_event"


class Response(Base):
    """Responses table — one row per answer submitted."""

    __tablename__ = "responses"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    participant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("participants.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    question_id: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    question_type: Mapped[QuestionType] = mapped_column(
        Enum(QuestionType, name="question_type_enum"),
        nullable=False,
    )
    answer_text: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    answer_value: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )
    response_time_ms: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )
    session_number: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    # Relationships
    participant: Mapped["Participant"] = relationship(
        "Participant",
        back_populates="responses",
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.id:
            self.id = uuid.uuid4()

    def __repr__(self) -> str:
        return (
            f"<Response q={self.question_id} "
            f"type={self.question_type} "
            f"session={self.session_number}>"
        )
