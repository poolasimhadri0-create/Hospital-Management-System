# Hospital-Management-System

## Setup

### Backend (FastAPI)
1. (Recommended) Create and activate a virtual environment (from project root):
   - `python -m venv backend/venv`
   - `backend/venv/Scripts/activate`
2. Install dependencies:
   - `pip install -r backend/requirements.txt`
3. Run the server:
   - `uvicorn backend.main:app --reload`


Backend will be available at `http://127.0.0.1:8000`.

### Frontend (React + Vite)
1. Install dependencies:
   - `cd frontend`
   - `npm install`
2. Run the dev server:
   - `npm run dev`

Frontend will be available at `http://127.0.0.1:5173`.

## Production builds

### Backend
- Use your preferred ASGI server, for example:
  - `uvicorn backend.main:app`

### Frontend
- `cd frontend`
- `npm run build`
- `npm run preview`

