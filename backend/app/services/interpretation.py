"""
NeuroTraceX — AI Interpretation Service

Generates a personalized, clinical/research-grade 3-paragraph interpretation
using the Anthropic Claude API. Falls back to static rule-based generation
if the API call fails or if insufficient data exists.
"""

import logging
from anthropic import AsyncAnthropic

from app.config import get_settings
from app.services.interpret_static import generate_static_interpretation

logger = logging.getLogger("neurotracex.interpretation")
settings = get_settings()


async def get_ai_interpretation(
    first_name: str,
    rei_experiential: float,
    rei_rational: float,
    crt_score: int,
    factual_div: float,
    interpretive_div: float,
    emotional_div: float,
    total_participants: int,
) -> str:
    """
    Calls the Anthropic Claude API to generate a personalized interpretation.
    Falls back to static rule-based interpretation on error or if the study
    is below the minimum participant threshold.
    
    Returns:
        A 3-paragraph markdown interpretation.
    """
    # Force static fallback if we don't have enough participants for comparison
    if total_participants < settings.min_participants_for_ai:
        logger.info(
            f"Insufficient participant count ({total_participants} < {settings.min_participants_for_ai}). "
            "Using static fallback interpretation."
        )
        return generate_static_interpretation(
            rei_experiential, rei_rational, crt_score,
            factual_div, interpretive_div, emotional_div
        )

    if not settings.anthropic_api_key:
        logger.warning("Anthropic API key is not configured. Using static fallback.")
        return generate_static_interpretation(
            rei_experiential, rei_rational, crt_score,
            factual_div, interpretive_div, emotional_div
        )

    # Construct the prompt for Claude
    prompt = f"""
Participant Name: {first_name}
Cognitive Style Scores:
- REI Experiential (Intuition): {rei_experiential:.2f} / 5.0
- REI Rational (Analytical): {rei_rational:.2f} / 5.0
- Cognitive Reflection Test (CRT): {crt_score} / 3

Memory Divergence Scores (0 to 1 scale, where 0 is identical to the group mean, and 1 is maximally different):
- Factual Divergence: {factual_div:.3f}
- Interpretive Divergence: {interpretive_div:.3f}
- Emotional Divergence: {emotional_div:.3f}

Comparative Context:
- Total Study Participants: {total_participants}

Based on these scores, generate a highly engaging, scientific, and personalized 3-paragraph interpretation for the participant:

Paragraph 1: Analyze their cognitive style (REI & CRT). Explain how they process information. Use warm but academic language.
Paragraph 2: Discuss their memory divergence scores. How does their recall of the factual, interpretive, and emotional aspects of the ambiguous audio compare to the group? Relate this back to their cognitive style.
Paragraph 3: Provide a real-world implication for their daily life, career, or relationships based on this subjective reality profile.

Format the output strictly as 3 paragraphs separated by double newlines. Do not include titles, headers, greetings, or intro/outro text. Write directly to the participant.
"""

    try:
        # Initialize Anthropic Async Client
        client = AsyncAnthropic(api_key=settings.anthropic_api_key)
        
        # Determine appropriate model identifier
        model = settings.claude_model
        if model == "claude-sonnet-4-6":
            # Map to actual API model name
            model = "claude-3-5-sonnet-20241022"

        response = await client.messages.create(
            model=model,
            max_tokens=1000,
            temperature=0.7,
            system=(
                "You are an expert cognitive psychologist writing personalized feedback "
                "for a study on subjective reality, cognitive styles, and memory reconstruction."
            ),
            messages=[{"role": "user", "content": prompt}],
        )
        
        interpretation = response.content[0].text.strip()
        if interpretation:
            return interpretation

    except Exception as e:
        logger.error(f"Error calling Anthropic API: {str(e)}. Falling back to static.")
        
    # Fallback to static rule-based generator on any failure
    return generate_static_interpretation(
        rei_experiential, rei_rational, crt_score,
        factual_div, interpretive_div, emotional_div
    )
