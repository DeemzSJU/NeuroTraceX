"""
NeuroTraceX — Tests for Response Submission API Routes
"""

import pytest
import uuid
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock

from app.main import app
from app.dependencies import get_db
from app.models.participant import Participant
from app.models.score import Score


@pytest.fixture
def client(mock_db) -> TestClient:
    app.dependency_overrides[get_db] = lambda: mock_db
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_submit_crt_answers(client, mock_db):
    """Verify that CRT answers are scored and stored correctly."""
    session_id = uuid.uuid4()
    participant = Participant(id=uuid.uuid4(), session_id=session_id)
    score = Score(participant_id=participant.id, crt_score=0)

    # Mock DB participant query
    mock_p_result = AsyncMock()
    mock_p_result.scalar_one_or_none.return_value = participant
    
    # Mock DB score query
    mock_s_result = AsyncMock()
    mock_s_result.scalar_one_or_none.return_value = score
    
    # We will return participant for first query, score for second
    mock_db.execute.side_effect = [mock_p_result, mock_s_result]

    payload = {
        "session_id": str(session_id),
        "answers": ["0.05", "wrong-ans", "47"] # 2 correct, 1 incorrect
    }
    
    response = client.post("/api/v1/responses/crt", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["crt_score"] == 2
    assert score.crt_score == 2
    
    # Check that individual responses were added
    assert mock_db.add.called
