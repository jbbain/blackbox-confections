# BlackBox Confections (Full Stack)

Luxurious, minimal, premium red/black/white bakery site with:
- Pages: Home, About, Gallery, Contact, Orde
- Dark mode toggle
- Online ordering (no payments/auth yet)
- Customer testimonials (Reviews)
- Admin CRUD: Products, Orders, Reviews, Gallery, Contact inbox
- Backend: FastAPI + SQLite + SQLAlchemy (CRUD endpoints)

---

## 1) Run the backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # mac/linux
# .venv\Scripts\activate  # windows
pip install -r requirements.txt
cp .env.example .env
uvicorn server:app --reload --port 8000
```

API: `http://localhost:8000/api`

---

## 2) Run the frontend
```bash
cd frontend
npm install
npm run dev
```

Site: `http://localhost:5173`

---

## Notes
- Seed data auto-loads on first backend startup (products, gallery, reviews).
- No authentication implemented (as requested). Add it later by protecting `/admin` routes + backend endpoints.
- Styling:
  - Dark: `#050505` (ink)
  - Accent: `#D2042D` (cherry)
  - Fonts: Playfair Display (headings), Manrope (body)
  - Sharp corners, no gradients
