from pydantic import BaseSettings, Field
from typing import Optional
import os

class Settings(BaseSettings):
    # API Configuration
    mistral_api_key: str = Field(..., description="Mistral API key", min_length=1)
    
    # Application Configuration
    debug: bool = Field(default=False, description="Debug mode")
    environment: str = Field(default="development", description="Environment (development/production)")
    
    # File Upload Configuration
    max_file_size: int = Field(default=10 * 1024 * 1024, description="Max file size in bytes (10MB)")
    allowed_file_types: str = Field(default="image/jpeg,image/png,image/webp", description="Allowed MIME types")
    upload_dir: str = Field(default="receipts/temp", description="Upload directory")
    
    # API Rate Limiting
    rate_limit_requests: int = Field(default=100, description="Requests per minute")
    
    # CORS Configuration
    cors_origins: str = Field(
        default="http://localhost:19006,http://localhost:8081", 
        description="Comma-separated list of allowed origins"
    )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

    @property
    def allowed_file_types_list(self) -> list[str]:
        """Get allowed file types as a list"""
        return [t.strip() for t in self.allowed_file_types.split(",")]
    
    @property
    def cors_origins_list(self) -> list[str]:
        """Get CORS origins as a list"""
        return [origin.strip() for origin in self.cors_origins.split(",")]

# Global settings instance
_settings: Optional[Settings] = None

def get_settings() -> Settings:
    """Get settings singleton"""
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings
