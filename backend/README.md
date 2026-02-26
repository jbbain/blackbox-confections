# BlackBox Confections — Backend (FastAPI)

## Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # mac/linux
# .venv\Scripts\activate  # windows
pip install -r requirements.txt
cp .env.example .env
```

## Run
```bash
uvicorn server:app --reload --port 8000
```

API base: `http://localhost:8000/api`

## Notes
- SQLite DB file: `backend/blackbox.db`
- CORS is configured for Vite dev server (`http://localhost:5173`)
