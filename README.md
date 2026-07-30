# NeuroTraceX — The Architecture of Subjective Reality

> **Research Question:** Does cognitive style (intuitive vs analytical) predict the degree of divergence in episodic memory reconstruction following exposure to an ambiguous shared stimulus?

## Project Overview

NeuroTraceX is a full-stack web-based experiment platform for a cognitive psychology study investigating how cognitive style influences episodic memory reconstruction. Participants complete a two-session protocol (Session 1 + 48hr delayed Session 2) involving cognitive style measurement (REI-20 & CRT), exposure to an ambiguous audio stimulus, and structured/free recall tasks. AI-powered divergence scoring and personalised interpretation are computed server-side.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router, Axios, Recharts |
| Backend | Python 3.11+, FastAPI, Uvicorn |
| Database | PostgreSQL (Supabase-hosted) |
| AI / ML | sentence-transformers (all-MiniLM-L6-v2), Groq API (Free Tier — Llama 3.3 70B) |
| Email | Resend API |
| Analysis | Jupyter, pandas, scipy, pingouin, seaborn, matplotlib |
| Deployment | Vercel (frontend), Render (backend) |

## Directory Structure

```
NeuroTraceX/
├── frontend/          # React.js SPA — participant-facing experiment UI
├── backend/           # FastAPI server — API, scoring, AI interpretation
├── analysis/          # Jupyter notebooks & statistical analysis
├── docs/              # Research documentation & protocols
├── stimuli/           # Audio stimulus & question bank assets
└── scripts/           # Utility & deployment scripts
```

## Getting Started

See `docs/SETUP.md` for full local development setup instructions.

## License

This project is part of an academic research study. All rights reserved.
