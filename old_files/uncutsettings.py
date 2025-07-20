from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    mistral_api_key: str = Field(..., description="Mistral API Key")

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8"
    }

settings = Settings()
