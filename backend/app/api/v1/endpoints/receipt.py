from fastapi import APIRouter, File, UploadFile
import shutil
import os
from backend.app.services.ocr import run_mistral_ocr
from backend.app.services.parser import parse_receipt


router = APIRouter()

@router.post("/upload-receipt/")
async def upload_receipt(file: UploadFile = File(...)):
    temp_dir = "receipts/temp"
    os.makedirs(temp_dir, exist_ok=True)

    file_path = os.path.join(temp_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    markdown_text = run_mistral_ocr(file_path)
    structured_json = parse_receipt(markdown_text)

    return {
        "file_name": file.filename,
        "result": structured_json
    }
