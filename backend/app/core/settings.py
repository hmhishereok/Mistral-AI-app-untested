from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mistral_api_key: str

    class Config:
        env_file = ".env"

settings = Settings()

def get_settings():
    return settings
