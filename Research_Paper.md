**Problem Statement:**  
Does cognitive style (intuitive vs analytical) predict the degree of divergence in episodic memory reconstruction following exposure to an ambiguous shared stimulus?

**Objectives:**

**Study Design:**  
Phase 1: Foundation

- [ ] Literature  
- [ ] Theory  
- [ ] Ethics Approval  
- [ ] Research Questions  
      

Phase 2: Build

- [ ] Designing Web Page/Application  
- [ ] Stimuli and data pipeline

Phase 3: Run

- [ ] Plot test  
- [ ] Recruit participants and collect data  
      

Phase 4: Analyze Findings

- [ ] Statistical Analysis  
- [ ] Find results  
- [ ] Interpret Findings  
      

Phase 5: Write and Submit

- [ ] Write  
- [ ] Revise  
- [ ] Submit

**Core Question:**  
Does an individual's cognitive style, specifically their tendency toward intuitive vs analytical thinking predict the degree to which their reconstruction of a shared ambiguous experience diverges from other participants’ reconstructions?

**Hypotheses**  
**Major**

1. Participants with a higher intuitive cognitive style scores will show significantly greater divergence in episodic memory reconstruction compared to highly analytical participants, particularly for emotionally ambiguous content.  
2. The divergence gap between intuitive and analytical participants will increase significantly between immediate recall and delayed recall (48hr) suggesting cognitive style influences memory consolidation, not just initial encoding

**Minor:**  
Divergence will be greater for emotionally loaded content within the stimulus compared to factual/objective content and this effect will be moderated by cognitive style.

**Tech Stack:**

- **Frontend**  
  * React \- UI framework. npx create-react-app to start.  
  * React Router \- Page navigation. npm install react-router-dom.  
  * Axios \- HTTP requests to Flask backend. npm install axios.  
  * Recharts \- Scatter plot on results page. npm install recharts.  
  * Vercel \- Hosts React app. Connect GitHub, auto-deploys on push.  
- **Backend**  
  * Python \+ Flask \- API server. pip install flask flask-cors.  
  * sentence-transformers AI \- Powers your divergence score. pip install sentence-transformers. Use "all-MiniLM-L6-v2" model.  
  * Anthropic Python SDK AI \- Calls Claude API for personalized interpretations. pip install anthropic. Use claude-sonnet-4-6 model. (\~$5–15 total)  
  * Supabase-py \- Python database client. pip install supabase.  
  * Render \- Hosts Flask backend. Free tier. Start command: gunicorn app:app.  
  * Resend \- 48-hour reminder emails. Free tier (100/day). Simple Python API.  
- **Database**  
  * Supabase \- PostgreSQL with visual editor. Free tier handles entire study. Real-time dashboard to watch data arriving.  
- **Analysis**  
  * Jupyter Notebook \- All analysis lives here. Comes with Anaconda.  
  * pandas \+ scipy \+ pingouin \- Data cleaning and statistical tests.  
  * krippendorff AI validation \- Inter-rater reliability for AI interpretation quality. pip install krippendorff.  
  * seaborn \+ matplotlib \- Publication-quality figures.

# **Data Collection Methodology**

## **The Architecture of Subjective Reality: Cognitive Style as a Predictor of Episodic Memory Divergence**

## **Overview**

Data is collected through a custom-built, web-based experiment platform that guides participants through a structured two-session study protocol. Every interaction — every answer, every response time, every button click — is automatically captured and stored in a cloud database in real time. There are no paper forms, no manual data entry, and no researcher present during the session. The entire experience is self-administered by the participant through a browser on any device.

## **The Platform**

The experiment platform is built as a full-stack web application using the following technology stack:

* Frontend: React.js — handles everything the participant sees and interacts with. Each stage of the study is a separate page component, and the participant is guided through them in a fixed sequence they cannot skip or reorder.  
* Backend: Python with Flask — a lightweight API server that receives data from the frontend, runs all computations, and communicates with the database. Every time a participant submits a response, it is sent as a structured JSON request to the Flask backend, which processes and stores it.  
* Database: Supabase (PostgreSQL) — a cloud-hosted relational database where all participant responses, scores, and computed results are stored securely and anonymously. Each participant is identified only by a randomly generated session ID, never by name.  
* Hosting: The frontend is deployed on Vercel and the backend on Render, both of which are cloud platforms accessible from any internet-connected device globally.

## **Who Participates**

The target sample is 60 participants, recruited with the expectation of retaining a minimum of 40 complete, usable datasets after accounting for dropout and data quality exclusions. Participants are adults (18+) recruited through university networks, social media platforms, and online research participation communities (such as Reddit's r/SampleSize). Participation is entirely voluntary. Participants are informed of the study's general purpose (memory and thinking styles), the time commitment, and their right to withdraw at any point without consequence. Informed consent is obtained digitally at the start of Session 1 before any study material is shown.

## Session 1 (\~22 Minutes)

### Step 1 — Informed Consent

The participant reads the full consent form on screen, confirms they understand it by checking a box, and provides their first name and email address. The email is used solely to send the 48-hour Session 2 reminder link and is stored separately from all response data.

### Step 2 — Cognitive Style Measurement (REI-20 \+ CRT)

Rational Experiential Inventory — 20 items (REI-20) The REI-20 is a validated psychometric instrument developed by Pacini & Epstein (1999) that measures cognitive style across two independent dimensions:

* Experiential subscale (10 items): captures the tendency to rely on intuition, gut feeling, and emotion-based processing. Example item: "I trust my initial feelings about people."  
* Rational subscale (10 items): captures the tendency toward deliberate, logical, analytical thinking. Example item: "I have a logical mind."

Each item is rated on a 5-point Likert scale (1 \= definitely not true of myself, 5 \= definitely true of myself). Several items are reverse-scored per the original instrument's scoring key. The two subscale scores are computed separately and treated as independent variables in the analysis — a participant can score high on both, low on both, or high on one and low on the other.

The REI-20 is displayed as a single scrollable page. All 20 items must be answered before the participant can proceed. Responses are timestamped and submitted to the backend via the API, which immediately computes and stores both subscale scores in Supabase.

Cognitive Reflection Test — 3 items (CRT) The CRT, developed by Frederick (2005), is a short behavioral measure of analytical thinking. It presents three problems that have an intuitively appealing but incorrect answer — only participants who suppress the impulsive response and think carefully arrive at the correct answer. Example: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?" (The intuitive answer is $0.10; the correct answer is $0.05.)

The CRT score (0–3) serves as a secondary, behavioral measure of cognitive style, used to cross-validate the self-report REI-20 scores. The CRT is displayed immediately after the REI-20 on the same page.

### Step 3 — The Shared Stimulus

All participants listen to the same 4–5 minute original audio recording — a scripted scene featuring two characters in an emotionally tense, deliberately ambiguous situation. The motivations of the characters are intentionally unclear, the emotional tone is complex, and the outcome is open to interpretation. The scene contains both objective, factual details (names, sequence of events, specific phrases used) and highly interpretive elements (why characters behave as they do, what they are feeling, what the relationship between them is).

The audio is delivered through an HTML5 audio player with the seek bar disabled — participants cannot fast-forward, rewind, or replay. A "Continue" button only appears once the audio has finished playing, enforced via the browser's onEnded event. The exact timestamps at which playback starts and ends are recorded.

This stimulus is the shared event — the single experience that all participants have in common, and whose reconstruction is the subject of the entire study.

### Step 4 — Free Recall

Immediately after the audio ends, participants are taken to a free recall page with a large text input field and the following prompt:

"In as much detail as possible, describe everything you remember about what you just heard. Include what happened, what was said, how the characters seemed to feel, and anything else that stands out to you. Take at least 3 minutes."

A visible timer starts automatically. The "Continue" button is locked for the first 3 minutes to ensure minimum engagement. The total time spent writing and the full text of the response are both recorded.

### Step 5 — Structured Recall Questions

Participants then answer 20 structured questions about the audio stimulus, presented one at a time on separate screens. The questions are divided into three categories:

* 7 Factual questions — have a single objectively correct answer based on the audio (e.g., "What was the first thing Character A said when they entered the room?"). These are scored against a ground truth answer key constructed by the research team.  
* 7 Interpretive questions — have no correct answer; they ask what the participant believes about ambiguous aspects of the scene (e.g., "Why do you think Character A decided to leave?").  
* 6 Emotional questions — ask about the emotional content of the scene as the participant perceived it (e.g., "How do you think Character B was feeling at the end of the conversation?").

For each question, the participant's full text answer and the time taken to respond (in milliseconds) are both recorded. Faster response times may indicate stronger or more confident memory traces and serve as a secondary behavioral measure.

All responses are submitted to the Flask backend and stored in the Supabase database tagged by question ID, question type, participant session ID, and a flag indicating this is Session 1 (not delayed recall).

### Step 6 — Thank You Page and Session 2 Reminder

The participant is shown a brief debrief explaining that the study is about how different people remember shared experiences differently. They are asked not to discuss the study with anyone until they receive their final results. An automated email is triggered via the Resend API, delivering a unique personalized link for Session 2 to arrive exactly 48 hours later.

---

## Session 2 — 48-Hour Delayed Recall (\~10 Minutes)

Forty-eight hours after Session 1, participants return via their unique emailed link and answer the same 20 structured questions again — this time entirely from memory, without re-exposure to the stimulus. The free recall task is not repeated in Session 2 to avoid fatigue effects contaminating the data.

Session 2 responses are stored identically to Session 1, but flagged as delayed recall. This allows direct comparison of each participant's answers across the two sessions, measuring how their reconstruction of the event has shifted, consolidated, or drifted over 48 hours.

## **How the Divergence Score is Computed**

Once a participant completes Session 1, their responses are processed by an AI pipeline built into the Flask backend:

For factual questions: the participant's answer is compared against the ground truth key using exact string matching. A score of 0 indicates a correct match (no divergence from objective reality); a score of 1 indicates an incorrect answer (divergence from objective reality).

For interpretive and emotional questions: there is no ground truth. Instead, a pre-trained transformer model — all-MiniLM-L6-v2 from the sentence-transformers library — converts each participant's text response into a 384-dimensional semantic embedding vector. The cosine distance between this participant's embedding and the mean embedding of all other participants' responses to the same question is computed. This distance is the divergence score for that question — 0 meaning the participant's interpretation was nearly identical to the group's collective interpretation, and 1 meaning it was maximally different.

Three separate divergence scores are computed per participant — one for factual questions, one for interpretive questions, and one for emotional questions — as well as an overall divergence score. The separation is essential for testing whether cognitive style predicts emotional divergence more strongly than factual divergence (Hypothesis 3).

This entire computation pipeline runs automatically in the backend each time a participant completes the study. Results are cached in Supabase so they do not need to be recomputed on every page load.

## **The AI Interpretation Layer**

Once the divergence scores are computed and at least 20 participants have completed the study (providing enough data for percentile rankings to be meaningful), the platform calls the Claude API (Anthropic, claude-sonnet-4-6 model) with a structured prompt containing the participant's REI subscale scores, CRT score, immediate divergence score, delayed divergence score, and the breakdown by question type.

The model returns a personalized 3-paragraph interpretation — specific to the participant's actual numbers — explaining what their cognitive style means, what their divergence pattern reveals about how they construct reality, and one concrete real-world implication. This interpretation is displayed to the participant on their results page.

A rule-based fallback system (interpret\_static.py) is in place for cases where the API call fails or where insufficient participant data exists to generate a meaningful interpretation. The quality of AI-generated interpretations is validated during the analysis phase through independent human rater assessment.

## **What Data is Stored**

For every participant, the following data is stored in Supabase:

| Data point | Where stored | Format |
| ----- | ----- | ----- |
| Session ID (anonymous) | participants table | Random UUID |
| Consent timestamp | participants table | Datetime |
| REI-20 answers (all 20\) | responses table | Integer 1–5 per item |
| REI experiential score | scores table | Float 1–5 |
| REI rational score | scores table | Float 1–5 |
| CRT score | scores table | Integer 0–3 |
| Free recall text | responses table | Full text string |
| Free recall duration | responses table | Integer (seconds) |
| 20 structured answers × 2 sessions | responses table | Text string per answer |
| Response time per question × 2 sessions | responses table | Integer (milliseconds) |
| Factual divergence score | scores table | Float 0–1 |
| Interpretive divergence score | scores table | Float 0–1 |
| Emotional divergence score | scores table | Float 0–1 |
| Overall divergence score (immediate) | scores table | Float 0–1 |
| Overall divergence score (delayed) | scores table | Float 0–1 |
| AI interpretation text | scores table | Text string |
| Audio playback start/end timestamps | responses table | Datetime |

No names, identifying information, or IP addresses are stored. The email address collected for Session 2 reminders is stored in a separate table and is not linked to response data in any analysis.

---

## **Data Quality and Exclusion Criteria**

After data collection closes, the dataset is cleaned in Python using pandas. Participants are excluded if:

* They did not complete Session 2  
* Their free recall response is under 50 words (indicating insufficient engagement)  
* They gave identical answers to 5 or more consecutive REI items (indicating random clicking)  
* Their structured question responses average under 5 words each (indicating disengagement)

Every exclusion decision is documented with the reason and reported in the paper's Methods section.

## **Ethical Considerations**

* Participation is fully voluntary with the right to withdraw at any time  
* All data is anonymized — no participant can be identified from the stored data  
* Participant emails are stored separately from response data and deleted after the study closes  
* The study presents no risk of psychological harm — the stimulus contains no graphic, distressing, or sensitive content  
* A full debrief is provided to all participants at the end of Session 1  
* Ethics approval is obtained from the university's Institutional Review Board before any recruitment begins  
* All data is stored on Supabase servers with encryption at rest and in transit

---

Document prepared for research proposal and faculty review purposes. Project: The Architecture of Subjective Reality

