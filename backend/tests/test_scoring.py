"""
NeuroTraceX — Tests for REI-40 Scoring Logic
"""

import pytest
from app.services.scoring import compute_rei_scores


def test_rei_scoring_all_threes():
    """Verify that all 3s result in an exact score of 3.0 (reverse scoring has no effect since 6 - 3 = 3)."""
    answers = [3] * 40
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
    # Reversed indices: 4, 6, 8, 9, 10, 12, 15, 16, 22, 25, 27, 29, 32, 33, 35, 36, 37, 38, 39
    # Total items = 40.
    answers = [4] * 40
    exp_score, rat_score = compute_rei_scores(answers)
    
    # Manually check:
    # Rationality subscale has 20 items:
    # - Rational Ability (1, 4, 8, 13, 14, 17, 25, 27, 30, 39)
    #   Reversed: 4, 8, 25, 27, 39 (5 items)
    #   Regular: 1, 13, 14, 17, 30 (5 items)
    # - Rational Engagement (2, 6, 10, 16, 20, 26, 28, 32, 33, 40)
    #   Reversed: 6, 10, 16, 32, 33 (5 items)
    #   Regular: 2, 20, 26, 28, 40 (5 items)
    # So Rationality has 10 reversed items and 10 regular items.
    # Sum = 10 * (6 - 4) + 10 * 4 = 10 * 2 + 10 * 4 = 60.
    # Avg = 60 / 20 = 3.0.
    assert rat_score == 3.0

    # Experientiality subscale has 20 items:
    # - Experiential Ability (3, 5, 18, 19, 21, 34, 35, 36, 37, 38)
    #   Reversed: 35, 36, 37, 38 (4 items)
    #   Regular: 3, 5, 18, 19, 21, 34 (6 items)
    # - Experiential Engagement (7, 9, 11, 12, 15, 22, 23, 24, 29, 31)
    #   Reversed: 9, 12, 15, 22, 29 (5 items)
    #   Regular: 7, 11, 23, 24, 31 (5 items)
    # So Experientiality has 9 reversed items and 11 regular items.
    # Sum = 9 * (6 - 4) + 11 * 4 = 18 + 44 = 62.
    # Avg = 62 / 20 = 3.1.
    assert exp_score == pytest.approx(3.1)


def test_rei_scoring_invalid_length():
    """Verify that a ValueError is raised if input is not exactly 40 items."""
    with pytest.raises(ValueError) as exc:
        compute_rei_scores([3] * 39)
    assert "Exactly 40 answers are required" in str(exc.value)


def test_rei_scoring_invalid_range():
    """Verify that a ValueError is raised if any answer is outside 1-5 range."""
    answers = [3] * 40
    answers[15] = 6  # Invalid
    with pytest.raises(ValueError) as exc:
        compute_rei_scores(answers)
    assert "must be between 1 and 5" in str(exc.value)
    
    answers[15] = 0  # Invalid
    with pytest.raises(ValueError) as exc:
        compute_rei_scores(answers)
    assert "must be between 1 and 5" in str(exc.value)
