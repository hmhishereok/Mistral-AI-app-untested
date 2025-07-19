from fastapi import APIRouter
from .endpoints import receipt

router = APIRouter()
router.include_router(receipt.router, prefix="/receipt", tags=["Receipt OCR"])
