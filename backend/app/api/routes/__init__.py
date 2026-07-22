"""
NeuroTraceX — API Routes Package
"""

from app.api.routes.participants import router as participants_router
from app.api.routes.responses import router as responses_router
from app.api.routes.scores import router as scores_router
from app.api.routes.admin import router as admin_router

__all__ = [
    "participants_router",
    "responses_router",
    "scores_router",
    "admin_router",
]
