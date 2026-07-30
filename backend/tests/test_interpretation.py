"""
NeuroTraceX — Tests for AI Interpretation Service (Groq API + Static Fallback)
"""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock

from app.services.interpretation import get_ai_interpretation


@pytest.mark.asyncio
async def test_interpretation_static_fallback_low_sample():
    """Verify static fallback is returned when sample count is below threshold."""
    result = await get_ai_interpretation(
        first_name="Alice",
        rei_experiential=4.2,
        rei_rational=4.0,
        crt_score=3,
        factual_div=0.2,
        interpretive_div=0.4,
        emotional_div=0.5,
        total_participants=5, # < 20 min_participants_for_ai
    )

    assert isinstance(result, str)
    assert len(result.split("\n\n")) == 3
    assert "balanced cognitive style" in result or "rational" in result


@pytest.mark.asyncio
async def test_interpretation_static_fallback_missing_key():
    """Verify static fallback is used when GROQ_API_KEY is blank."""
    with patch("app.services.interpretation.get_settings") as mock_get_settings:
        mock_settings = MagicMock()
        mock_settings.min_participants_for_ai = 5
        mock_settings.groq_api_key = "" # Empty API key
        mock_get_settings.return_value = mock_settings

        result = await get_ai_interpretation(
            first_name="Bob",
            rei_experiential=2.5,
            rei_rational=4.5,
            crt_score=2,
            factual_div=0.1,
            interpretive_div=0.3,
            emotional_div=0.2,
            total_participants=100,
        )

        assert isinstance(result, str)
        assert len(result.split("\n\n")) == 3


@pytest.mark.asyncio
async def test_interpretation_groq_api_success():
    """Verify successful response from Groq API."""
    mock_groq_response = MagicMock()
    mock_choice = MagicMock()
    mock_choice.message.content = "Paragraph 1 AI feedback.\n\nParagraph 2 AI feedback.\n\nParagraph 3 AI feedback."
    mock_groq_response.choices = [mock_choice]

    mock_client = MagicMock()
    mock_client.chat.completions.create = AsyncMock(return_value=mock_groq_response)

    with patch("app.services.interpretation.get_settings") as mock_get_settings, \
         patch("app.services.interpretation.AsyncGroq", return_value=mock_client):
        
        mock_settings = MagicMock()
        mock_settings.min_participants_for_ai = 5
        mock_settings.groq_api_key = "gsk_test_mock_key"
        mock_settings.groq_model = "llama-3.3-70b-versatile"
        mock_get_settings.return_value = mock_settings

        result = await get_ai_interpretation(
            first_name="Charlie",
            rei_experiential=4.0,
            rei_rational=4.0,
            crt_score=3,
            factual_div=0.25,
            interpretive_div=0.35,
            emotional_div=0.45,
            total_participants=50,
        )

        assert result == "Paragraph 1 AI feedback.\n\nParagraph 2 AI feedback.\n\nParagraph 3 AI feedback."
        mock_client.chat.completions.create.assert_called_once()
