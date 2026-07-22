# Database Schema Documentation

## Tables

### participants
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Auto-generated |
| session_id | UUID (unique) | Anonymous participant identifier |
| first_name | VARCHAR | For email greeting only |
| email | VARCHAR | Stored separately, Session 2 reminder only |
| consent_timestamp | TIMESTAMP | When consent was given |
| created_at | TIMESTAMP | Row creation time |

### responses
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Auto-generated |
| session_id | UUID (FK) | Links to participant |
| question_id | VARCHAR | Question identifier |
| question_type | ENUM | 'rei', 'crt', 'free_recall', 'factual', 'interpretive', 'emotional' |
| answer_text | TEXT | Full response text |
| answer_value | INTEGER | Numeric value (REI Likert 1-5, CRT 0/1) |
| response_time_ms | INTEGER | Time to respond in milliseconds |
| session_number | INTEGER | 1 (immediate) or 2 (delayed 48hr) |
| created_at | TIMESTAMP | Row creation time |

### scores
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Auto-generated |
| session_id | UUID (FK) | Links to participant |
| rei_experiential | FLOAT | Experiential subscale (1-5) |
| rei_rational | FLOAT | Rational subscale (1-5) |
| crt_score | INTEGER | Correct CRT answers (0-3) |
| factual_divergence | FLOAT | Factual question divergence (0-1) |
| interpretive_divergence | FLOAT | Interpretive question divergence (0-1) |
| emotional_divergence | FLOAT | Emotional question divergence (0-1) |
| overall_divergence_immediate | FLOAT | Overall Session 1 divergence (0-1) |
| overall_divergence_delayed | FLOAT | Overall Session 2 divergence (0-1) |
| ai_interpretation_text | TEXT | Claude-generated interpretation |
| created_at | TIMESTAMP | Row creation time |

### emails (separate — not linked to responses)
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Auto-generated |
| email | VARCHAR | Participant email |
| session_id | UUID | For generating Session 2 link |
| sent_at | TIMESTAMP | When reminder was sent |
| session2_completed | BOOLEAN | Whether Session 2 was completed |
