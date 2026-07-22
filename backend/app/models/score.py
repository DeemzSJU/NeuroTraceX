"""
NeuroTraceX — Score Model

Stores computed scores for each participant:
- REI-40 subscale scores (experiential, rational)
- CRT score (0-3)
- Divergence scores by question type (0-1)
- Overall divergence (immediate and delayed)
- AI-generated interpretation text
"""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, Text, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Score(Base):
    """Scores table — one row per participant with all computed metrics."""

    __tablename__ = "scores"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    participant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("participants.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    # --- Cognitive Style Scores ---
    rei_experiential: Mapped[float | None] = mapped_column(
        Float, nullable=True
    )
    rei_rational: Mapped[float | None] = mapped_column(
        Float, nullable=True
    )
    crt_score: Mapped[int | None] = mapped_column(
        Integer, nullable=True
    )

    # --- Divergence Scores (0–1 scale) ---
    factual_divergence: Mapped[float | None] = mapped_column(
        Float, nullable=True
    )
    interpretive_divergence: Mapped[float | None] = mapped_column(
        Float, nullable=True
    )
    emotional_divergence: Mapped[float | None] = mapped_column(
        Float, nullable=True
    )
    overall_divergence_immediate: Mapped[float | None] = mapped_column(
        Float, nullable=True
    )
    overall_divergence_delayed: Mapped[float | None] = mapped_column(
        Float, nullable=True
    )

    # --- AI Interpretation ---
    ai_interpretation_text: Mapped[str | None] = mapped_column(
        Text, nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    # Relationships
    participant: Mapped["Participant"] = relationship(
        "Participant",
        back_populates="score",
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.id:
            self.id = uuid.uuid4()

    def __repr__(self) -> str:
        return (
            f"<Score participant={self.participant_id} "
            f"rei_exp={self.rei_experiential} "
            f"rei_rat={self.rei_rational}>"
        )
