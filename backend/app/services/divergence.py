"""
NeuroTraceX — Divergence Scoring Service

Computes memory reconstruction divergence scores comparing a participant's
answers against objective ground truth (for factual questions) and the group's
collective consensus (for interpretive/emotional questions).

Uses sentence-transformers (all-MiniLM-L6-v2) for semantic embeddings.
Includes a lightweight fallback (Jaccard similarity/Levenshtein) if the
heavy ML packages are not yet installed, ensuring the server runs out-of-the-box.
"""

import json
import logging
from typing import List, Dict, Optional, Tuple
import os

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.response import Response, QuestionType
from app.models.score import Score
from app.services.interpretation import get_ai_interpretation

logger = logging.getLogger("neurotracex.divergence")

# Try importing ML dependencies
try:
    from sentence_transformers import SentenceTransformer
    import numpy as np
    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False
    logger.warning("ML dependencies not available. Divergence scoring will run in fallback mode.")

# --- Globals / Config ---
STIMULI_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../stimuli"))
ANSWER_KEY_PATH = os.path.join(STIMULI_DIR, "answer_key.json")

# Lazy-loaded transformer model
_model: Optional['SentenceTransformer'] = None


def get_model() -> 'SentenceTransformer':
    """Lazy loader for the SentenceTransformer model."""
    global _model
    if not ML_AVAILABLE:
        raise RuntimeError("ML packages not installed.")
    if _model is None:
        logger.info("Initializing SentenceTransformer: all-MiniLM-L6-v2")
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


# --- Fallback Comparison Logic ---

def _levenshtein_distance(s1: str, s2: str) -> int:
    """Calculates Levenshtein distance between two strings."""
    if len(s1) < len(s2):
        return _levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]


def _fallback_cosine_distance(text1: str, text2: str) -> float:
    """
    Fallback word-level Jaccard similarity mapped to distance [0, 1].
    Used when sentence-transformers is not installed.
    """
    t1_words = set(text1.lower().split())
    t2_words = set(text2.lower().split())
    if not t1_words or not t2_words:
        return 1.0
    
    intersection = len(t1_words.intersection(t2_words))
    union = len(t1_words.union(t2_words))
    similarity = intersection / union if union > 0 else 0.0
    return 1.0 - similarity


# --- Ground Truth Loading ---

def _load_ground_truth_key() -> Dict[str, str]:
    """Loads factual answer key from stimuli folder."""
    try:
        if os.path.exists(ANSWER_KEY_PATH):
            with open(ANSWER_KEY_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception as e:
        logger.error(f"Failed to read answer key: {str(e)}")
    return {}


# --- Core Scoring Functions ---

async def compute_participant_divergence(
    participant_id_str: str,
    db: AsyncSession,
) -> Score:
    """
    Runs the pipeline to compute divergence scores (factual, interpretive, emotional)
    for both Session 1 (immediate) and Session 2 (delayed), and generates
    the AI interpretation feedback block.
    """
    from app.models.participant import Participant
    
    # 1. Fetch participant details
    part_result = await db.execute(
        select(Participant).where(Participant.id == participant_id_str)
    )
    participant = part_result.scalar_one()

    # 2. Fetch all responses of this participant
    resp_result = await db.execute(
        select(Response).where(Response.participant_id == participant.id)
    )
    participant_responses = resp_result.scalars().all()

    # 3. Fetch responses of all other participants for group consensus
    other_resp_result = await db.execute(
        select(Response).where(Response.participant_id != participant.id)
    )
    other_responses = other_resp_result.scalars().all()

    # Organise other responses by (session_number, question_id)
    others_by_q: Dict[Tuple[int, str], List[str]] = {}
    for r in other_responses:
        if r.answer_text:
            key = (r.session_number, r.question_id)
            others_by_q.setdefault(key, []).append(r.answer_text)

    # Ground truth for factual scoring
    ground_truth = _load_ground_truth_key()

    # Store scores
    scores_by_type: Dict[str, List[float]] = {
        "factual_1": [], "factual_2": [],
        "interpretive_1": [], "interpretive_2": [],
        "emotional_1": [], "emotional_2": [],
    }

    # Process each response
    for resp in participant_responses:
        if resp.question_type == QuestionType.REI or resp.question_type == QuestionType.CRT:
            continue
        if (
            resp.question_type == QuestionType.AUDIO_EVENT
            or resp.question_type == QuestionType.VIDEO_EVENT
            or resp.question_type == QuestionType.FREE_RECALL
        ):
            continue

        q_id = resp.question_id
        session = resp.session_number
        ans_text = resp.answer_text or ""
        q_type_str = resp.question_type.value

        # A. Factual category uses ground truth comparison
        if resp.question_type == QuestionType.FACTUAL:
            correct_ans = ground_truth.get(q_id, "").strip().lower()
            user_ans = ans_text.strip().lower()
            
            # Exact string matching as specified: 0 = correct, 1 = incorrect
            divergence = 0.0 if user_ans == correct_ans else 1.0
            scores_by_type[f"factual_{session}"].append(divergence)

        # B. Interpretive or Emotional uses semantic cosine distance to group mean
        elif resp.question_type in (QuestionType.INTERPRETIVE, QuestionType.EMOTIONAL):
            group_answers = others_by_q.get((session, q_id), [])
            
            # If no other participants yet, consensus is distance 0.0
            if not group_answers:
                divergence = 0.0
            else:
                if ML_AVAILABLE:
                    try:
                        # Vectorized cosine distance to the group's mean vector
                        model = get_model()
                        user_emb = model.encode(ans_text)
                        group_embs = model.encode(group_answers)
                        
                        # Mean embedding of group
                        mean_emb = np.mean(group_embs, axis=0)
                        
                        # Cosine distance = 1 - cosine_similarity
                        user_norm = np.linalg.norm(user_emb)
                        mean_norm = np.linalg.norm(mean_emb)
                        
                        if user_norm > 0 and mean_norm > 0:
                            similarity = np.dot(user_emb, mean_emb) / (user_norm * mean_norm)
                            divergence = float(1.0 - similarity)
                        else:
                            divergence = 1.0
                    except Exception as e:
                        logger.error(f"Embedding error: {str(e)}. Using fallback distance.")
                        divergence = sum(_fallback_cosine_distance(ans_text, ga) for ga in group_answers) / len(group_answers)
                else:
                    # Fallback to Jaccard-like distance
                    divergence = sum(_fallback_cosine_distance(ans_text, ga) for ga in group_answers) / len(group_answers)

            scores_by_type[f"{q_type_str}_{session}"].append(divergence)

    # 4. Compute averages per category
    def avg_list(lst: List[float]) -> Optional[float]:
        return sum(lst) / len(lst) if lst else None

    # Fetch existing Score row or create
    score_result = await db.execute(
        select(Score).where(Score.participant_id == participant.id)
    )
    score_row = score_result.scalar_one()

    # Aggregate scores
    # Immediate recall categories
    score_row.factual_divergence = avg_list(scores_by_type["factual_1"])
    score_row.interpretive_divergence = avg_list(scores_by_type["interpretive_1"])
    score_row.emotional_divergence = avg_list(scores_by_type["emotional_1"])

    # Session overall divergence
    all_immediate = (
        scores_by_type["factual_1"] + 
        scores_by_type["interpretive_1"] + 
        scores_by_type["emotional_1"]
    )
    all_delayed = (
        scores_by_type["factual_2"] + 
        scores_by_type["interpretive_2"] + 
        scores_by_type["emotional_2"]
    )

    score_row.overall_divergence_immediate = avg_list(all_immediate)
    score_row.overall_divergence_delayed = avg_list(all_delayed)

    # 5. Generate AI Interpretation Text
    # Count total participants to feed context
    count_result = await db.execute(
        select(func.count(Participant.id))
    )
    total_participants = count_result.scalar() or 0

    # Safely unpack values or use defaults
    rei_exp = score_row.rei_experiential or 3.0
    rei_rat = score_row.rei_rational or 3.0
    crt = score_row.crt_score or 0
    fact_div = score_row.factual_divergence or 0.5
    int_div = score_row.interpretive_divergence or 0.5
    em_div = score_row.emotional_divergence or 0.5

    interpretation = await get_ai_interpretation(
        first_name=participant.first_name,
        rei_experiential=rei_exp,
        rei_rational=rei_rat,
        crt_score=crt,
        factual_div=fact_div,
        interpretive_div=int_div,
        emotional_div=em_div,
        total_participants=total_participants
    )
    
    score_row.ai_interpretation_text = interpretation
    
    # Save changes
    db.add(score_row)
    await db.flush()

    return score_row
