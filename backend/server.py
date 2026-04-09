from pathlib import Path
import logging
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.db import Base, engine, SessionLocal
from app.routes import router
from app.seed import seed

# ── ensure all model classes are loaded so Base.metadata is complete ──
import app.models  # noqa: F401

logging.basicConfig(stream=sys.stdout, level=logging.INFO, force=True)
log = logging.getLogger("startup")

app = FastAPI(title="BlackBox Confections API", version="1.0.0")

allowed_origins = settings.cors_list()
log.info("CORS allow_origins: %s", allowed_origins)

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
    # ── 1. Create / migrate tables ────────────────────────────────────
    log.info(">>> Creating tables (create_all) ...")
    try:
        Base.metadata.create_all(bind=engine)
        log.info(">>> Tables ready.")
    except Exception as e:
        log.error(">>> create_all FAILED: %s", e, exc_info=True)

    # ── 2. Lightweight column migration for existing DBs ──────────────
    #    (adds columns that may be missing from an older schema)
    try:
        from sqlalchemy import inspect as sa_inspect, text
        inspector = sa_inspect(engine)
        if "contact_messages" in inspector.get_table_names():
            cols = [c["name"] for c in inspector.get_columns("contact_messages")]
            if "phone" not in cols:
                log.info(">>> Adding missing 'phone' column to contact_messages")
                with engine.begin() as conn:
                    conn.execute(
                        text("ALTER TABLE contact_messages ADD COLUMN phone VARCHAR(80) DEFAULT ''")
                    )
    except Exception as e:
        log.warning(">>> Column migration check failed (non-fatal): %s", e)

    # ── 3. Seed data ─────────────────────────────────────────────────
    log.info(">>> Running seed ...")
    db = SessionLocal()
    try:
        seed(db)
        log.info(">>> Seed complete.")
    except Exception as e:
        log.error(">>> Seed FAILED: %s", e, exc_info=True)
    finally:
        db.close()
    log.info(">>> Startup finished.")

app.include_router(router, prefix="/api")