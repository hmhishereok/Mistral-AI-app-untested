from fastapi import FastAPI
from app.v1.apirouter import router as v1_router
from app.v1.services.ocr import extract_markdown_from_image
import asyncio

app = FastAPI(title="Receipt Parser API")
app.include_router(v1_router, prefix="/api/v1")

extracted_text = asyncio.run(extract_markdown_from_image(r"./backend/receipts/images/receipt_00000.png"))