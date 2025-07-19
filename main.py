import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), "backend", "app"))


from fastapi import FastAPI
from backend.app.api.v1.apirouter import router as api_router

app = FastAPI(
    title="Mistral OCR Receipt API",
    version="1.0"
)

app.include_router(api_router, prefix="/api/v1")
