"""
NeuroTraceX — Pytest Configuration & Shared Fixtures
"""

import pytest
import pytest_asyncio
from unittest.mock import AsyncMock, MagicMock
from collections.abc import Generator

from app.config import Settings


@pytest.fixture
def mock_settings() -> Settings:
    """Fixture returning settings overrides for tests."""
    return Settings(
        environment="test",
        debug=True,
        secret_key="test-secret-key",
        database_url="postgresql+asyncpg://test:test@localhost:5432/test_db",
        anthropic_api_key="mock-api-key",
        resend_api_key="mock-resend-key",
    )


@pytest_asyncio.fixture
async def mock_db() -> AsyncMock:
    """Fixture returning a mocked SQLAlchemy AsyncSession."""
    session = AsyncMock()
    # Mock return values for common database operations
    session.execute = AsyncMock()
    session.add = MagicMock()
    session.flush = AsyncMock()
    session.commit = AsyncMock()
    session.rollback = AsyncMock()
    session.close = AsyncMock()
    return session
