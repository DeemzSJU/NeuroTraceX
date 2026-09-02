"""
NeuroTraceX — Baseline Participants Seeder

Seeds the database with realistic synthetic participants who completed both Session 1 and Session 2.
This provides a statistically rich group consensus distribution so that any real participant
who tests the system sees realistic, non-zero divergence scores on the Results page.
"""

import asyncio
import datetime as dt
import random
import uuid

from app.database import async_session_factory
from app.models.participant import Participant
from app.models.response import QuestionType, Response
from app.models.score import Score
from app.services.divergence import compute_participant_divergence
from app.services.scoring import compute_rei_scores

SEED_PARTICIPANTS = [
    {
        "first_name": "Maya",
        "email": "maya.lin@sample.edu",
        "rei_profile": [4, 5, 4, 2, 4, 2, 5, 2, 2, 1, 4, 2, 5, 4, 5, 2, 4, 2, 5, 4], # Intuitive
        "crt_answers": ["0.05", "5", "47"], # 3/3
        "free_recall": "Two colleagues met in a conference room discussing an overdue project milestone. Character A seemed defensive while Character B tried to keep things calm.",
        "s1_answers": {
            "q1": "Hello",
            "q2": "office",
            "q3": "folder",
            "q4": "Character A",
            "q5": "walked out",
            "q6": "morning",
            "q7": "why now",
            "q8": "She felt unappreciated and overwhelmed by the sudden timeline changes.",
            "q9": "Misaligned expectations regarding task ownership and lack of communication.",
            "q10": "Professional peers with underlying peer rivalry.",
            "q11": "Character A for jumping to conclusions without listening.",
            "q12": "They will likely need a mediator or manager to resolve the deadline issue.",
            "q13": "Fear of being blamed for previous sprint delays.",
            "q14": "Mostly sincere but guarded in her tone.",
            "q15": "Anxious and on edge.",
            "q16": "Frustrated yet trying to maintain composure.",
            "q17": "Tense and confrontational.",
            "q18": "High tension throughout the conversation.",
            "q19": "Character B showed mild empathy by asking clarifying questions.",
            "q20": "A bit stressed observing the lack of mutual understanding."
        },
        "s2_answers": {
            "q1": "Hello there",
            "q2": "office room",
            "q3": "folder",
            "q4": "Character A",
            "q5": "left the room",
            "q6": "morning",
            "q7": "why now",
            "q8": "She felt blamed and wanted to avoid further confrontation.",
            "q9": "Unclear responsibilities on the team roadmap.",
            "q10": "Coworkers with historical tension.",
            "q11": "Both shared fault, but Character A escalated it.",
            "q12": "A formal team meeting to clarify ownership.",
            "q13": "Protecting her credibility before the leadership review.",
            "q14": "Fairly diplomatic and sincere.",
            "q15": "Nervous and defensive.",
            "q16": "Exhausted and resigned.",
            "q17": "Strained and urgent.",
            "q18": "Very tense.",
            "q19": "Character B attempted to defuse the anger.",
            "q20": "Uneasy and reflective."
        }
    },
    {
        "first_name": "Marcus",
        "email": "marcus.v@sample.org",
        "rei_profile": [5, 5, 2, 1, 2, 1, 2, 1, 1, 1, 5, 1, 2, 5, 2, 1, 5, 1, 2, 1], # Highly Rational
        "crt_answers": ["0.05", "5", "47"], # 3/3
        "free_recall": "The interaction began at approximately 9 AM in an office. Itemized discussion of project deliverables occurred before abrupt termination by one party.",
        "s1_answers": {
            "q1": "Hello",
            "q2": "office",
            "q3": "folder",
            "q4": "Character A",
            "q5": "walked out",
            "q6": "morning",
            "q7": "why now",
            "q8": "Cognitive overload from conflicting deadline constraints.",
            "q9": "Incompatible analytical interpretations of the project schedule.",
            "q10": "Direct team collaborators with formal working relationship.",
            "q11": "Procedural breakdown rather than personal fault.",
            "q12": "Formal email exchange summarizing action items.",
            "q13": "Uncertainty about her data metrics.",
            "q14": "Strictly professional and task-focused.",
            "q15": "Focused but impatient.",
            "q16": "Perplexed by the sudden departure.",
            "q17": "Analytical friction with rising irritation.",
            "q18": "Moderate tension driven by time pressure.",
            "q19": "Minimal affective empathy; focused strictly on facts.",
            "q20": "Neutral and objective."
        },
        "s2_answers": {
            "q1": "Hello",
            "q2": "office",
            "q3": "folder",
            "q4": "Character A",
            "q5": "left",
            "q6": "morning",
            "q7": "why now",
            "q8": "Inability to reconcile project timeline discrepancies.",
            "q9": "Objective conflict over resource allocation.",
            "q10": "Colleagues in a technical domain.",
            "q11": "Lack of structured documentation.",
            "q12": "Follow-up audit of the timeline.",
            "q13": "Doubts regarding budget estimates.",
            "q14": "Composed and business-like.",
            "q15": "Pressured by schedule.",
            "q16": "Baffled by the emotional outburst.",
            "q17": "Formal and adversarial.",
            "q18": "Moderate to high.",
            "q19": "No significant empathy observed.",
            "q20": "Detached observation."
        }
    },
    {
        "first_name": "Elena",
        "email": "elena.r@sample.io",
        "rei_profile": [3, 4, 5, 2, 4, 3, 4, 2, 3, 2, 3, 2, 4, 4, 4, 2, 3, 2, 4, 3], # Balanced
        "crt_answers": ["0.10", "5", "47"], # 2/3
        "free_recall": "I remember a quick meeting where someone brought in documents. Voices rose quickly, and one person left abruptly.",
        "s1_answers": {
            "q1": "hello",
            "q2": "office",
            "q3": "folder",
            "q4": "Character A",
            "q5": "walked out",
            "q6": "morning",
            "q7": "why now",
            "q8": "She felt cornered into taking full responsibility for a shared error.",
            "q9": "Erosion of trust over recent weeks regarding team credit.",
            "q10": "Close coworkers whose trust has begun to fray.",
            "q11": "Character B for being somewhat dismissive initially.",
            "q12": "An awkward cooling-off period followed by a tense apology.",
            "q13": "She felt sidelined in recent executive decisions.",
            "q14": "Genuine in her surprise but poorly attuned to A's stress.",
            "q15": "Defensive and emotionally vulnerable.",
            "q16": "Hurt and misunderstood.",
            "q17": "Emotionally charged and uncomfortable.",
            "q18": "Strong interpersonal friction.",
            "q19": "Character B tried to show concern at the end.",
            "q20": "Sympathy for both individuals."
        },
        "s2_answers": {
            "q1": "hello",
            "q2": "room",
            "q3": "folder",
            "q4": "Character A",
            "q5": "walked out",
            "q6": "morning",
            "q7": "why now",
            "q8": "Overwhelming frustration and fear of being blamed.",
            "q9": "Interpersonal misunderstandings and accumulated resentment.",
            "q10": "Formerly friendly colleagues.",
            "q11": "Character B's blunt tone triggered Character A.",
            "q12": "They will avoid each other for a few days.",
            "q13": "Protecting personal vulnerability.",
            "q14": "Somewhat empathetic but defensive.",
            "q15": "Sad and defensive.",
            "q16": "Disappointed.",
            "q17": "Melodramatic and strained.",
            "q18": "High emotional tension.",
            "q19": "Slight empathy from Character B.",
            "q20": "Compassion for their stress."
        }
    },
    {
        "first_name": "Liam",
        "email": "liam.oc@sample.net",
        "rei_profile": [2, 3, 5, 4, 5, 4, 5, 1, 1, 1, 2, 1, 5, 3, 5, 4, 2, 4, 5, 5], # High Intuition / Low Need for Cognition
        "crt_answers": ["0.10", "100", "24"], # 0/3 (heuristic)
        "free_recall": "Two people having a big argument about some papers. It felt really hostile from the get-go.",
        "s1_answers": {
            "q1": "Hello",
            "q2": "office",
            "q3": "folder",
            "q4": "Character A",
            "q5": "walked out",
            "q6": "morning",
            "q7": "why now",
            "q8": "Angry reaction to an perceived insult.",
            "q9": "Personality clash and lack of mutual respect.",
            "q10": "Rivals forced to work together.",
            "q11": "Character A was very aggressive.",
            "q12": "They will fight again in the next department meeting.",
            "q13": "Jealousy over recent promotions.",
            "q14": "Not very sincere, mostly defensive.",
            "q15": "Enraged and ready to snap.",
            "q16": "Bitter and resentful.",
            "q17": "Hostile and chaotic.",
            "q18": "Extremely high and explosive.",
            "q19": "None whatsoever; total lack of empathy.",
            "q20": "Annoyed at how childish they both acted."
        },
        "s2_answers": {
            "q1": "Hey",
            "q2": "conference room",
            "q3": "papers",
            "q4": "Character A",
            "q5": "slammed door",
            "q6": "morning",
            "q7": "why now",
            "q8": "Pure anger and pride.",
            "q9": "Deep-seated personal rivalry.",
            "q10": "Toxic competitors.",
            "q11": "Character A for starting the drama.",
            "q12": "One of them will quit or complain to HR.",
            "q13": "Desire to undermine the other.",
            "q14": "Fake concern.",
            "q15": "Furious.",
            "q16": "Smug and indignant.",
            "q17": "Hostile and toxic.",
            "q18": "Off the charts.",
            "q19": "Zero empathy from either side.",
            "q20": "Frustration with their behavior."
        }
    },
    {
        "first_name": "Aisha",
        "email": "aisha.k@sample.edu",
        "rei_profile": [4, 5, 3, 2, 3, 1, 3, 2, 2, 1, 5, 2, 3, 4, 3, 1, 4, 2, 3, 2], # Moderate-High Analytical
        "crt_answers": ["0.05", "5", "47"], # 3/3
        "free_recall": "Character A came in holding files to discuss a deadline. Character B asked several clarifying questions, but A terminated the meeting prematurely.",
        "s1_answers": {
            "q1": "hello",
            "q2": "office",
            "q3": "folder",
            "q4": "Character A",
            "q5": "walked out",
            "q6": "morning",
            "q7": "why now",
            "q8": "To prevent an escalation while her emotions were running high.",
            "q9": "Ambiguity around deliverable ownership in a high-stakes setting.",
            "q10": "Professional peers navigating an organizational transition.",
            "q11": "Systemic lack of clear communication rather than individual malice.",
            "q12": "They will re-engage in writing with bullet points.",
            "q13": "Fatigue from continuous overwork.",
            "q14": "Sincere and attempting to remain rational.",
            "q15": "Exhausted and hyper-vigilant.",
            "q16": "Surprised and concerned.",
            "q17": "Tense but constructive until the sudden exit.",
            "q18": "Elevated workplace stress.",
            "q19": "Character B made attempts to de-escalate with calm tone.",
            "q20": "Empathetic towards high workplace burnout."
        },
        "s2_answers": {
            "q1": "hello",
            "q2": "office",
            "q3": "folder",
            "q4": "Character A",
            "q5": "walked out",
            "q6": "morning",
            "q7": "why now",
            "q8": "Taking a timeout to avoid saying something regretful.",
            "q9": "Misaligned process definitions on the joint initiative.",
            "q10": "Teammates under heavy workload.",
            "q11": "Both, due to poor active listening.",
            "q12": "Constructive realignment with senior manager.",
            "q13": "Burnout and stress.",
            "q14": "Reasonable and composed.",
            "q15": "Stressed and overwhelmed.",
            "q16": "Concerned.",
            "q17": "High stakes pressure.",
            "q18": "Moderate tension.",
            "q19": "Character B attempted to facilitate a solution.",
            "q20": "Understanding of professional pressure."
        }
    },
    {
        "first_name": "Devon",
        "email": "devon.m@sample.com",
        "rei_profile": [3, 3, 4, 3, 4, 3, 4, 3, 3, 2, 3, 3, 4, 3, 4, 3, 3, 3, 4, 3], # Middle distribution
        "crt_answers": ["0.05", "5", "24"], # 2/3
        "free_recall": "Two workers met up in the office in the morning. One had a blue folder and complained about timing before leaving abruptly.",
        "s1_answers": {
            "q1": "Hello",
            "q2": "office",
            "q3": "folder",
            "q4": "Character A",
            "q5": "walked out",
            "q6": "morning",
            "q7": "why now",
            "q8": "Felt defensive about project feedback.",
            "q9": "Different priorities regarding immediate tasks.",
            "q10": "Standard colleagues.",
            "q11": "Character A for overreacting to routine questions.",
            "q12": "They will chat over coffee later to clear the air.",
            "q13": "Worried about project metrics.",
            "q14": "Moderately sincere.",
            "q15": "Slightly irritable.",
            "q16": "Confused and taken aback.",
            "q17": "Awkward and uncomfortable.",
            "q18": "Moderate friction.",
            "q19": "Minimal empathy displayed.",
            "q20": "Mildly uncomfortable."
        },
        "s2_answers": {
            "q1": "Hello",
            "q2": "office",
            "q3": "folder",
            "q4": "Character A",
            "q5": "walked away",
            "q6": "morning",
            "q7": "why now",
            "q8": "Frustrated with the discussion.",
            "q9": "Deadline dispute.",
            "q10": "Coworkers.",
            "q11": "Character A.",
            "q12": "They will talk later.",
            "q13": "Stress.",
            "q14": "Normal sincerity.",
            "q15": "Irritated.",
            "q16": "Baffled.",
            "q17": "Awkward.",
            "q18": "Moderate.",
            "q19": "Not really.",
            "q20": "Neutral."
        }
    }
]

async def seed_participants():
    print("[Seeder] Starting baseline participants generation...")
    async with async_session_factory() as session:
        # Check existing emails to avoid duplicates
        for pdata in SEED_PARTICIPANTS:
            # Check if participant already exists by email
            from sqlalchemy import select
            existing = (await session.execute(select(Participant).where(Participant.email == pdata["email"]))).scalar_one_or_none()
            if existing:
                print(f"[Seeder] Participant {pdata['first_name']} ({pdata['email']}) already exists. Skipping.")
                continue

            session_id = uuid.uuid4()
            now = dt.datetime.now(dt.timezone.utc)
            s1_time = now - dt.timedelta(days=3)
            s2_time = now - dt.timedelta(days=1)

            part = Participant(
                first_name=pdata["first_name"],
                email=pdata["email"],
                session_id=session_id,
                consent_timestamp=s1_time,
                session1_completed=True,
                session1_completed_at=s1_time,
                session2_completed=True,
                created_at=s1_time,
            )
            session.add(part)
            await session.flush()

            # Create Score row
            score = Score(
                participant_id=part.id,
                created_at=s1_time,
            )
            session.add(score)
            await session.flush()

            # Add REI responses & compute score
            rei_answers = pdata["rei_profile"]
            for idx, val in enumerate(rei_answers):
                r = Response(
                    participant_id=part.id,
                    question_id=f"rei_{idx + 1}",
                    question_type=QuestionType.REI,
                    answer_value=val,
                    session_number=1,
                    created_at=s1_time,
                )
                session.add(r)
            exp_s, rat_s = compute_rei_scores(rei_answers)
            score.rei_experiential = exp_s
            score.rei_rational = rat_s

            # Add CRT responses & compute score
            crt_answers = pdata["crt_answers"]
            crt_correct = ["0.05", "5", "47"]
            crt_total = 0
            for idx, ans in enumerate(crt_answers):
                is_corr = ans.strip() == crt_correct[idx]
                if is_corr:
                    crt_total += 1
                r = Response(
                    participant_id=part.id,
                    question_id=f"crt_{idx + 1}",
                    question_type=QuestionType.CRT,
                    answer_text=ans,
                    answer_value=1 if is_corr else 0,
                    session_number=1,
                    created_at=s1_time,
                )
                session.add(r)
            score.crt_score = crt_total

            # Add Free Recall
            session.add(Response(
                participant_id=part.id,
                question_id="free_recall",
                question_type=QuestionType.FREE_RECALL,
                answer_text=pdata["free_recall"],
                response_time_ms=45000,
                session_number=1,
                created_at=s1_time,
            ))

            # Add Structured Qs - Session 1
            for q_id, ans_text in pdata["s1_answers"].items():
                cat_num = int(q_id.replace("q", ""))
                q_type = QuestionType.FACTUAL if cat_num <= 7 else (QuestionType.INTERPRETIVE if cat_num <= 14 else QuestionType.EMOTIONAL)
                session.add(Response(
                    participant_id=part.id,
                    question_id=q_id,
                    question_type=q_type,
                    answer_text=ans_text,
                    response_time_ms=random.randint(4000, 12000),
                    session_number=1,
                    created_at=s1_time,
                ))

            # Add Structured Qs - Session 2
            for q_id, ans_text in pdata["s2_answers"].items():
                cat_num = int(q_id.replace("q", ""))
                q_type = QuestionType.FACTUAL if cat_num <= 7 else (QuestionType.INTERPRETIVE if cat_num <= 14 else QuestionType.EMOTIONAL)
                session.add(Response(
                    participant_id=part.id,
                    question_id=q_id,
                    question_type=q_type,
                    answer_text=ans_text,
                    response_time_ms=random.randint(3000, 10000),
                    session_number=2,
                    created_at=s2_time,
                ))

            await session.commit()
            print(f"[Seeder] Seeded participant: {pdata['first_name']}")

        # Re-compute divergence scores for all participants now that a cohort exists
        from sqlalchemy import select
        all_parts = (await session.execute(select(Participant))).scalars().all()
        print(f"[Seeder] Computing divergence for all {len(all_parts)} participants...")
        for p in all_parts:
            if p.session1_completed:
                try:
                    await compute_participant_divergence(p.id, session)
                    await session.commit()
                    print(f"  -> Updated divergence scores for: {p.first_name}")
                except Exception as e:
                    print(f"  -> Error calculating for {p.first_name}: {e}")

    print("[Seeder] Seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_participants())
