from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

# Resolve paths relative to the backend/ directory (parent of app/)
_BACKEND_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_BACKEND_DIR / ".env"),
        extra="ignore",
    )

    database_url: str = f"sqlite:///{_BACKEND_DIR / 'blackbox.db'}"
    cors_origins: str = (
        "http://localhost:5173,"
        "http://localhost:5174,"
        "http://127.0.0.1:5173,"
        "http://127.0.0.1:5174,"
        "https://blackboxconfections.com,"
        "https://www.blackboxconfections.com"
    )

    mail_username: str = ""
    mail_password: str = ""
    mail_from: str = ""
    mail_port: int = 587
    mail_server: str = "smtp.gmail.com"
    mail_from_name: str = "BlackBox Confections"
    mail_starttls: bool = True
    mail_ssl_tls: bool = False

    vercel_api_token: str = ""
    vercel_project_id: str = ""

    def cors_list(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

settings = Settings()