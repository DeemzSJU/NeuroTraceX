# API Documentation

## Base URL
- Local: `http://localhost:8000/api/v1`
- Production: TBD (Render deployment)

## Endpoints

### Participants
| Method | Path | Description |
|--------|------|-------------|
| POST | `/consent` | Register participant with consent |
| GET | `/participant/{session_id}` | Get participant info for Session 2 |

### Responses
| Method | Path | Description |
|--------|------|-------------|
| POST | `/responses/rei` | Submit REI-40 answers |
| POST | `/responses/crt` | Submit CRT answers |
| POST | `/responses/free-recall` | Submit free recall text |
| POST | `/responses/structured` | Submit structured question answer |
| POST | `/responses/audio-event` | Log audio playback timestamps |

### Scores
| Method | Path | Description |
|--------|------|-------------|
| GET | `/scores/{session_id}` | Get divergence scores |
| POST | `/scores/compute/{session_id}` | Trigger score computation |
| GET | `/results/{session_id}` | Get full results + AI interpretation |

### Admin
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/participants` | List all participants |
| GET | `/admin/export` | Export dataset |
| GET | `/admin/stats` | Study statistics |
