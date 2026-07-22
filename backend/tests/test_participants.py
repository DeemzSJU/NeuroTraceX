"""
NeuroTraceX — Tests for Participant API Routes
"""

import pytest
import uuid
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock

from app.main import app
from app.dependencies import get_db
from app.models.participant import Participant


@pytest.fixture
def client(mock_db) -> TestClient:
    """Fixture returning a TestClient with get_db dependency overridden."""
    app.dependency_overrides[get_db] = lambda: mock_db
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_consent_api_success(client, mock_db):
    """Verify that the /consent endpoint succeeds and registers consent."""
    payload = {
        "first_name": "Alice",
        "email": "alice@example.com"
    }
    
    response = client.post("/api/v1/participants/consent", json=payload)
    
    assert response.status_code == 201
    data = response.json()
    assert "session_id" in data
    assert data["message"] == "Consent recorded successfully."
    
    # Verify database insert was called
    assert mock_db.add.called
    assert mock_db.flush.called


def test_participant_lookup_success(client, mock_db):
    """Verify that a participant is returned when queried by session_id."""
    session_id = uuid.uuid4()
    mock_participant = Participant(
        id=uuid.uuid4(),
        session_id=session_id,
        first_name="Bob",
        email="bob@example.com"
    )
    
    # Mock query result
    mock_result = AsyncMock()
    mock_result.scalar_one_or_none.return_value = mock_participant
    mock_db.execute.return_value = mock_result
    
    response = client.get(f"/api/v1/participants/{session_id}")
    
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "Bob"
    assert data["session_id"] == str(session_id)


def test_participant_lookup_not_found(client, mock_db):
    """Verify that 404 is returned if session_id is not found."""
    session_id = uuid.uuid4()
    
    # Mock query result to return None
    mock_result = AsyncMock()
    mock_result.scalar_one_or_none.return_value = None
    mock_db.execute.return_value = mock_result
    
    response = client.get(f"/api/v1/participants/{session_id}")
    
    assert response.status_code == 404
    assert "Participant not found" in response.json()["detail"]
