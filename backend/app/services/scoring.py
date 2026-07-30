"""
NeuroTraceX — REI-20 Scoring Logic

Computes the experiential (intuitive) and rational (analytical) subscale scores
from a list of 20 Likert-scale answers (1-5), handling reverse-scored items.
"""

from typing import Dict, List, Tuple

# 1-indexed item numbers that are reverse-scored in the REI-20 instrument
REVERSE_SCORED_ITEMS = {
    4, 6, 8, 9, 10, 12, 16, 18, 19, 20
}

# 1-indexed item numbers for each subscale
RATIONAL_ABILITY_ITEMS = {1, 4, 11, 16, 17}
RATIONAL_ENGAGEMENT_ITEMS = {2, 6, 9, 14, 18}
EXPERIMENTAL_ABILITY_ITEMS = {3, 5, 13, 19, 20}
EXPERIMENTAL_ENGAGEMENT_ITEMS = {7, 8, 10, 12, 15}


def compute_rei_scores(answers: List[int]) -> Tuple[float, float]:
    """
    Computes experiential and rational subscale scores.
    
    Args:
        answers: A list of 20 integers representing Likert responses (1 to 5).
                 Answers should be ordered from item 1 to item 20.
                 
    Returns:
        Tuple of (experiential_score, rational_score) as floats from 1.0 to 5.0.
    """
    if len(answers) != 20:
        raise ValueError("Exactly 20 answers are required for REI-20 scoring.")
    
    # Check that all answers are in the valid 1-5 range
    for idx, ans in enumerate(answers):
        if ans < 1 or ans > 5:
            raise ValueError(f"Answer at index {idx} ({ans}) must be between 1 and 5.")

    adjusted_answers = []
    
    # Process each item, reverse scoring where appropriate (1-indexed mapping)
    for i, score in enumerate(answers, start=1):
        if i in REVERSE_SCORED_ITEMS:
            # Reverse score: 1->5, 2->4, 3->3, 4->2, 5->1
            adjusted_answers.append(6 - score)
        else:
            adjusted_answers.append(score)
            
    # Subscale item scores (1-indexed for mapping)
    rational_scores = []
    experiential_scores = []
    
    for i, adjusted_score in enumerate(adjusted_answers, start=1):
        if i in RATIONAL_ABILITY_ITEMS or i in RATIONAL_ENGAGEMENT_ITEMS:
            rational_scores.append(adjusted_score)
        elif i in EXPERIMENTAL_ABILITY_ITEMS or i in EXPERIMENTAL_ENGAGEMENT_ITEMS:
            experiential_scores.append(adjusted_score)
            
    # Calculate averages (each scale has 10 items)
    avg_rational = sum(rational_scores) / len(rational_scores) if rational_scores else 0.0
    avg_experiential = sum(experiential_scores) / len(experiential_scores) if experiential_scores else 0.0
    
    return avg_experiential, avg_rational

