"""
NeuroTraceX — FastAPI Application Entry Point

Main application with CORS middleware, all API routers mounted
under /api/v1, and a health check endpoint.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.api import (
    auth_router,
    participants_router,
    responses_router,
    scores_router,
    admin_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # ── Startup ──
    settings = get_settings()
    print(f"[NeuroTraceX] starting in {settings.environment} mode")
    print(f"[NeuroTraceX] CORS origins: {settings.cors_origin_list}")
    yield
    # ── Shutdown ──
    print("[NeuroTraceX] shutting down")


def create_app() -> FastAPI:
    """Application factory — creates and configures the FastAPI instance."""
    settings = get_settings()

    app = FastAPI(
        title="NeuroTraceX API",
        description=(
            "Backend API for the NeuroTraceX cognitive psychology experiment. "
            "Manages participant consent, response collection, divergence "
            "scoring, and AI-powered interpretation."
        ),
        version="0.1.0",
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # ── CORS Middleware ──
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── API Routers ──
    api_prefix = "/api/v1"
    app.include_router(auth_router, prefix=api_prefix)
    app.include_router(participants_router, prefix=api_prefix)
    app.include_router(responses_router, prefix=api_prefix)
    app.include_router(scores_router, prefix=api_prefix)
    app.include_router(admin_router, prefix=api_prefix)

    # ── Health Check ──
    @app.get("/health", tags=["Health"])
    async def health_check():
        return {
            "status": "healthy",
            "app": settings.app_name,
            "environment": settings.environment,
        }

    return app


# Create the app instance used by uvicorn
app = create_app()
