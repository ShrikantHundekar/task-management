import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "CodeFlow AI"
    TAGLINE: str = "Plan. Code. Debug. Ship."
    API_V1_STR: str = "/api/v1"
    
    # Database (SQLite default for seamless instant setup, or PostgreSQL)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./codeflow.db")
    
    # Security & JWT
    JWT_SECRET: str = os.getenv("JWT_SECRET", "supersecret-codeflow-jwt-key-2026-production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Groq API
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
