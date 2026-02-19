from pydantic_settings import BaseSettings
from pydantic import PostgresDsn, computed_field
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "S-STUDY API"
    API_V1_STR: str = "/api/v1"
    
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "s_study"
    POSTGRES_PORT: int = 5432
    
    SECRET_KEY: str = "CHANGE_THIS_SECRET_KEY"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    GOOGLE_API_KEY: str = "CHANGE_THIS_GOOGLE_API_KEY"

    @computed_field
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> PostgresDsn:
        return PostgresDsn.build(
            scheme="postgresql+asyncpg",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_SERVER,
            port=self.POSTGRES_PORT,
            path=self.POSTGRES_DB,
        )

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
