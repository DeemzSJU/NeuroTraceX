# Local Development Setup Guide

## Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- PostgreSQL (or Supabase account)
- Git

## Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate       # Windows
# source .venv/bin/activate  # macOS/Linux

pip install -r requirements.txt

# Copy and configure environment variables
cp ../.env.example ../.env
# Edit ../.env with your actual values

# Run database migrations
alembic upgrade head

# Start the development server
uvicorn app.main:app --reload --port 8000
```

## Frontend Setup

```bash
cd frontend
npm install

# Start the development server
npm start
```

## Analysis Setup

```bash
cd analysis
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
jupyter notebook
```

## Environment Variables

See `.env.example` for all required environment variables and their descriptions.
