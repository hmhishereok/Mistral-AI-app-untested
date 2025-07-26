import sys
import os
print("main.py loaded")
sys.path.append(os.path.join(os.path.dirname(__file__), "backend", "app"))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.v1.apirouter import router as api_router
from backend.app.core.settings import get_settings

def debug_get_settings():
    print("get_settings called")
    return get_settings()

app = FastAPI(
    title="Mistral OCR Receipt API",
    version="1.0.0",
    description="A secure API for processing receipts using Mistral AI OCR"
)

# Secure CORS configuration
allowed_origins = [
    "http://localhost:19006",  # Expo dev server
    "http://localhost:8081",   # Metro bundler
    "exp://192.168.1.100:19000",  # Expo app (update with your IP)
    # Add your production domains here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,  # Set to False for better security
    allow_methods=["GET", "POST"],  # Only allow needed methods
    allow_headers=["Content-Type", "Authorization"],  # Only allow needed headers
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

@app.get("/")
async def root():
    return {"message": "Receipt Scanner API", "docs": "/docs"}