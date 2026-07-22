"""
NeuroTraceX — Admin / Researcher Dashboard API Routes

Endpoints for monitoring study progress and exporting data.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.models.participant import Participant
from app.models.score import Score
from app.schemas.participant import ParticipantResponse
from app.schemas.score import AdminStatsResponse

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get(
    "/participants",
    response_model=list[ParticipantResponse],
    summary="List all participants",
)
async def list_participants(
    db: AsyncSession = Depends(get_db),
):
    """List all registered participants with their completion status."""
    result = await db.execute(
        select(Participant).order_by(Participant.created_at.desc())
    )
    return result.scalars().all()


@router.get(
    "/stats",
    response_model=AdminStatsResponse,
    summary="Get aggregate study statistics",
)
async def get_stats(
    db: AsyncSession = Depends(get_db),
):
    """
    Aggregate study statistics for the researcher dashboard:
    total enrolled, completion rates, average scores.
    """
    # Total participants
    total_result = await db.execute(select(func.count(Participant.id)))
    total = total_result.scalar() or 0

    # Session 2 completed
    s2_result = await db.execute(
        select(func.count(Participant.id)).where(
            Participant.session2_completed.is_(True)
        )
    )
    s2_completed = s2_result.scalar() or 0

    # Average scores
    avg_result = await db.execute(
        select(
            func.avg(Score.rei_experiential),
            func.avg(Score.rei_rational),
            func.avg(Score.overall_divergence_immediate),
        )
    )
    row = avg_result.one_or_none()

    return AdminStatsResponse(
        total_participants=total,
        session1_completed=total,  # All consented = Session 1 started
        session2_completed=s2_completed,
        avg_rei_experiential=row[0] if row else None,
        avg_rei_rational=row[1] if row else None,
        avg_overall_divergence=row[2] if row else None,
    )


@router.get(
    "/export",
    summary="Export full dataset (JSON)",
)
async def export_data(
    db: AsyncSession = Depends(get_db),
):
    """
    Export the full study dataset as JSON.
    For CSV export, use the scripts/export_data.py utility.
    """
    result = await db.execute(
        select(Participant).order_by(Participant.created_at)
    )
    participants = result.scalars().all()

    # Build export payload
    export = []
    for p in participants:
        export.append({
            "session_id": str(p.session_id),
            "consent_timestamp": p.consent_timestamp.isoformat() if p.consent_timestamp else None,
            "session2_completed": p.session2_completed,
        })

    return {"count": len(export), "data": export}
