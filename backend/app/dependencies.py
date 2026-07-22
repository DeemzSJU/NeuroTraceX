"""
NeuroTraceX — FastAPI Dependency Injection

Provides reusable dependencies for route handlers:
- Database sessions
- Settings access
"""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession

from app.config import Settings, get_settings
from app.database import async_session_factory


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Yield an async database session per request.
    Automatically commits on success, rolls back on error,
    and closes when the request is done.
    """
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


def get_app_settings() -> Settings:
    """Return the cached application settings."""
    return get_settings()
