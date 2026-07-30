"""
NeuroTraceX — Tests for REI-20 Scoring Logic
"""

import pytest
from app.services.scoring import compute_rei_scores


def test_rei_scoring_all_threes():
    """Verify that all 3s result in an exact score of 3.0 (reverse scoring has no effect since 6 - 3 = 3)."""
    answers = [3] * 20
    exp_score, rat_score = compute_rei_scores(answers)
    assert exp_score == 3.0
    assert rat_score == 3.0


def test_rei_scoring_exact_values():
    """Verify scoring with known values where reverse scoring is applied."""
    # Let's create answers where non-reversed are 4 and reversed are 2
    # Since reversed items get mapped to 6 - answer:
    # If we pass 4 to non-reversed and 4 to reversed, then:
    # Non-reversed stay 4
    # Reversed become 6 - 4 = 2
    #
    # Reversed indices: 4, 6, 8, 9, 10, 12, 16, 18, 19, 20
    # Total items = 20.
    answers = [4] * 20
    exp_score, rat_score = compute_rei_scores(answers)
    
    # Manually check:
    # Rationality subscale has 10 items:
    # - Rational Ability (1, 4, 11, 16, 17) -> Reversed: 4, 16 (2 items), Regular: 1, 11, 17 (3 items)
    # - Rational Engagement (2, 6, 9, 14, 18) -> Reversed: 6, 9, 18 (3 items), Regular: 2, 14 (2 items)
    # So Rationality has 5 reversed items and 5 regular items.
    # Sum = 5 * (6 - 4) + 5 * 4 = 5 * 2 + 5 * 4 = 30.
    # Avg = 30 / 10 = 3.0.
    assert rat_score == 3.0

    # Experientiality subscale has 10 items:
    # - Experiential Ability (3, 5, 13, 19, 20) -> Reversed: 19, 20 (2 items), Regular: 3, 5, 13 (3 items)
    # - Experiential Engagement (7, 8, 10, 12, 15) -> Reversed: 8, 10, 12 (3 items), Regular: 7, 15 (2 items)
    # So Experientiality has 5 reversed items and 5 regular items.
    # Sum = 5 * (6 - 4) + 5 * 4 = 5 * 2 + 5 * 4 = 30.
    # Avg = 30 / 10 = 3.0.
    assert exp_score == 3.0


def test_rei_scoring_invalid_length():
    """Verify that a ValueError is raised if input is not exactly 20 items."""
    with pytest.raises(ValueError) as exc:
        compute_rei_scores([3] * 19)
    assert "Exactly 20 answers are required" in str(exc.value)


def test_rei_scoring_invalid_range():
    """Verify that a ValueError is raised if any answer is outside 1-5 range."""
    answers = [3] * 20
    answers[15] = 6  # Invalid
    with pytest.raises(ValueError) as exc:
        compute_rei_scores(answers)
    assert "must be between 1 and 5" in str(exc.value)
    
    answers[15] = 0  # Invalid
    with pytest.raises(ValueError) as exc:
        compute_rei_scores(answers)
    assert "must be between 1 and 5" in str(exc.value)
