"""
NeuroTraceX — Data Quality & Exclusion Criteria

Provides helper functions to filter and exclude low-quality datasets
as specified by the research paper's methodology.
"""

from typing import List


def is_free_recall_invalid(text: str, min_words: int = 50) -> bool:
    """
    Checks if the free recall text is too short (indicating disengagement).
    Rule: Under 50 words.
    """
    if not text:
        return True
    words = [w for w in text.strip().split() if w]
    return len(words) < min_words


def has_straightlining_rei(answers: List[int], max_consecutive: int = 5) -> bool:
    """
    Checks for random/pattern clicking on the REI-40.
    Rule: Identical answers to 5 or more consecutive REI items.
    """
    if len(answers) < max_consecutive:
        return False
        
    consecutive_count = 1
    for i in range(1, len(answers)):
        if answers[i] == answers[i - 1] and answers[i] is not None:
            consecutive_count += 1
            if consecutive_count >= max_consecutive:
                return True
        else:
            consecutive_count = 1
            
    return False


def are_structured_answers_invalid(answers: List[str], min_average_words: float = 5.0) -> bool:
    """
    Checks if structured recall questions show disengagement.
    Rule: Responses average under 5 words each.
    """
    valid_answers = [ans.strip() for ans in answers if ans and ans.strip()]
    if not valid_answers:
        return True
        
    total_words = 0
    for ans in valid_answers:
        words = [w for w in ans.split() if w]
        total_words += len(words)
        
    avg_words = total_words / len(valid_answers)
    return avg_words < min_average_words
