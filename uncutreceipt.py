from fastapi import APIRouter, UploadFile, File
from app.v1.services.ocr import extract_markdown_from_image
from app.v1.services.parser import parse_receipt_json
from app.v1.schemas import Receipt

router = APIRouter()

@router.post("/parse", response_model=Receipt)
async def parse_receipt(file: UploadFile = File(...)):
    markdown = await extract_markdown_from_image(file)
    receipt = await parse_receipt_json(file, markdown)
    return receipt