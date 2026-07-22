"""
NeuroTraceX — Rule-based Static Fallback Interpretation

Generates a personalized 3-paragraph interpretation when the Claude API
fails or when there is insufficient cumulative study data to run
relative percentile rankings.
"""

def generate_static_interpretation(
    rei_experiential: float,
    rei_rational: float,
    crt_score: int,
    factual_div: float,
    interpretive_div: float,
    emotional_div: float,
) -> str:
    """
    Generates a high-quality, personalized 3-paragraph text interpreting
    the participant's scores based on psychological theory.
    
    Args:
        rei_experiential: Experiential score (1.0 to 5.0).
        rei_rational: Rational score (1.0 to 5.0).
        crt_score: CRT score (0 to 3).
        factual_div: Factual divergence score (0.0 to 1.0).
        interpretive_div: Interpretive divergence score (0.0 to 1.0).
        emotional_div: Emotional divergence score (0.0 to 1.0).
        
    Returns:
        A 3-paragraph markdown-formatted string.
    """
    # --- Paragraph 1: Cognitive Style Profile ---
    # Determine dominant style
    if rei_rational >= 3.5 and rei_experiential >= 3.5:
        style_desc = (
            "You exhibit a balanced cognitive style, scoring highly in both rational (analytical) "
            "and experiential (intuitive) processing. According to dual-process theory, you possess "
            "the ability to easily switch between logical analysis and rapid, gut-level intuition. "
            "Your high Rational score shows an appreciation for effortful problem-solving, while your "
            "high Experiential score indicates strong trust in your subconscious feelings."
        )
    elif rei_rational >= 3.5 and rei_experiential < 3.5:
        style_desc = (
            "Your cognitive style is predominantly rational and analytical. You show a strong preference "
            "for systematic, logic-driven thinking and likely feel most comfortable making decisions "
            "when you have clear data and structured arguments. Your relatively low experiential "
            "score suggests you tend to suppress or double-check intuitive 'hunches' in favor of deliberate reasoning."
        )
    elif rei_rational < 3.5 and rei_experiential >= 3.5:
        style_desc = (
            "Your cognitive style is highly experiential and intuitive. You rely heavily on gut feelings, "
            "initial impressions, and holistic understanding. You process information quickly and "
            "associatively, preferring to trust your instincts. Your lower rationality score indicates "
            "you generally avoid unnecessary, effortful analytical thinking unless explicitly forced to."
        )
    else:
        style_desc = (
            "Your cognitive style profile shows moderate, balanced engagement across both systems. "
            "You do not heavily rely on or heavily avoid either rational analysis or experiential intuition. "
            "You likely process everyday decisions using a mixture of moderate reasoning and basic instinct, "
            "without showing a strong commitment to either processing pathway."
        )
        
    # Incorporate CRT context
    if crt_score >= 2:
        crt_desc = (
            f" This self-report profile is validated by your performance on the Cognitive Reflection Test (CRT: {crt_score}/3), "
            "indicating a high behavioral ability to suppress immediate, impulsive answers in favor of analytical deliberation."
        )
    else:
        crt_desc = (
            f" Your behavioral reflection performance (CRT: {crt_score}/3) indicates a tendency to rely on "
            "rapid, intuitively appealing shortcuts, occasionally bypassing deeper analytical checks when solving tricky problems."
        )
        
    paragraph_1 = style_desc + crt_desc

    # --- Paragraph 2: Divergence Profile ---
    # Compare factual vs emotional/interpretive divergence
    div_mean = (factual_div + interpretive_div + emotional_div) / 3.0
    
    if emotional_div > factual_div + 0.15:
        div_desc = (
            f"Your memory reconstruction pattern reveals high emotional divergence ({emotional_div:.2f}) compared "
            f"to your factual recall divergence ({factual_div:.2f}). This suggests that when recreating "
            "shared experiences, your mind heavily filters and rebuilds the narrative's emotional tone "
            "through your own subjective expectations and intuitive lens, even while keeping objective, "
            "factual details closer to the consensus view."
        )
    elif factual_div > emotional_div + 0.15:
        div_desc = (
            f"You show higher factual divergence ({factual_div:.2f}) than emotional divergence ({emotional_div:.2f}). "
            "This pattern indicates that your memory of the objective facts and details of the event diverged "
            "more from other participants, while your interpretation of the social and emotional dynamics of the "
            "scene aligned closely with the group's collective perception."
        )
    else:
        div_desc = (
            f"Your memory divergence across factual ({factual_div:.2f}), interpretive ({interpretive_div:.2f}), "
            f"and emotional ({emotional_div:.2f}) domains is relatively uniform. Your reconstruction of the shared experience "
            "did not shift selectively in any single dimension, demonstrating a balanced consolidation of both "
            "factual structure and socio-emotional tone."
        )
        
    # Relate divergence to cognitive style
    if rei_experiential >= 3.5 and emotional_div >= 0.4:
        rel_desc = (
            " This aligns with our primary hypothesis that highly intuitive individuals show greater divergence "
            "in episodic memory reconstruction, particularly for emotionally loaded and ambiguous content."
        )
    elif rei_rational >= 3.5 and factual_div <= 0.3:
        rel_desc = (
            " This supports the idea that highly analytical individuals maintain a more standardized, "
            "consensus-aligned reconstruction of objective details over time."
        )
    else:
        rel_desc = (
            " This highlights how your cognitive style interacts with memory consolidation in a highly "
            "individualized manner, showcasing the complex pathways of human subjective recall."
        )
        
    paragraph_2 = div_desc + rel_desc

    # --- Paragraph 3: Real World Implication ---
    if rei_rational >= 3.5:
        implication = (
            "In real-world settings, your logical orientation makes you an excellent critical thinker and "
            "objective problem-solver. However, when collaborating with others, keep in mind that memories and "
            "shared events are rarely purely objective. Acknowledging and validating the diverse, emotional "
            "reconstructions of others can enhance your interpersonal communication and collective decision-making."
        )
    else:
        implication = (
            "In your day-to-day life, your strong intuitive guidance helps you navigate complex social situations "
            "and make rapid, holistic judgments. Nonetheless, when discussing past events with colleagues or friends, "
            "remember that your mind naturally reconstructs details to fit your emotional narrative. Double-checking "
            "objective timelines can prevent misunderstandings in critical communications."
        )
        
    paragraph_3 = implication

    # Combine into 3 paragraphs separated by double newlines
    return f"{paragraph_1}\n\n{paragraph_2}\n\n{paragraph_3}"
