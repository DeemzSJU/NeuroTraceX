"""
NeuroTraceX — Application Configuration

Loads environment variables from .env and provides typed,
validated settings via Pydantic BaseSettings.
"""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file="../../.env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # --- Application ---
    app_name: str = "NeuroTraceX"
    environment: str = "development"
    debug: bool = True
    secret_key: str = "change-me-in-production"

    # --- Database (Supabase / PostgreSQL) ---
    database_url: str = "postgresql+asyncpg://user:pass@localhost:5432/neurotracex"
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""

    # --- CORS ---
    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origin_list(self) -> list[str]:
        """Parse comma-separated CORS origins into a list."""
        return [origin.strip() for origin in self.cors_origins.split(",")]

    # --- Anthropic Claude API ---
    anthropic_api_key: str = ""

    # --- Resend Email API ---
    resend_api_key: str = ""
    resend_from_email: str = "noreply@neurotracex.com"

    # --- AI Interpretation ---
    min_participants_for_ai: int = 20
    claude_model: str = "claude-sonnet-4-6"


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance — parsed once, reused everywhere."""
    return Settings()
