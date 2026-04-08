from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from alembic.config import Config as AlembicConfig
from alembic import command as alembic_command

from app.config import settings
from app.db import Base, engine, SessionLocal
from app.routes import router
from app.seed import seed

app = FastAPI(title="BlackBox Confections API", version="1.0.0")

allowed_origins = settings.cors_list()
print("CORS allow_origins:", allowed_origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.on_event("startup")
def on_startup():
    # Run Alembic migrations to bring DB schema up to date
    # This safely adds new columns/tables without deleting data
    alembic_ini = str(BASE_DIR / "alembic.ini")
    alembic_cfg = AlembicConfig(alembic_ini)
    alembic_cfg.set_main_option("script_location", str(BASE_DIR / "alembic"))
    alembic_command.upgrade(alembic_cfg, "head")

    db = SessionLocal()
    try:
      seed(db)
    finally:
      db.close()

app.include_router(router, prefix="/api")