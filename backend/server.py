from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db import Base, engine, SessionLocal
from app.routes import router
from app.seed import seed

app = FastAPI(title="BlackBox Confections API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    # seed starter content
    db = SessionLocal()
    try:
        seed(db)
    finally:
        db.close()

app.include_router(router, prefix="/api")
