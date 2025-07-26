from fastapi import APIRouter, File, UploadFile, HTTPException, status
from fastapi.responses import JSONResponse
import shutil
import os
import uuid
import logging
from typing import Dict, Any
from backend.app.services.ocr import run_mistral_ocr
from backend.app.services.parser import parse_receipt
from backend.app.core.settings import get_settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()
settings = get_settings()

def validate_file(file: UploadFile) -> None:
    """Validate uploaded file"""
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided"
        )
    
    if not file.content_type or file.content_type not in settings.allowed_file_types_list:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {file.content_type} not allowed. Allowed types: {settings.allowed_file_types}"
        )
    
    # Check file size (this is approximate as we haven't read the full file yet)
    if hasattr(file, 'size') and file.size and file.size > settings.max_file_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum size: {settings.max_file_size} bytes"
        )

def create_safe_filename(original_filename: str) -> str:
    """Create a safe filename with UUID"""
    file_extension = os.path.splitext(original_filename)[1].lower()
    safe_filename = f"{uuid.uuid4()}{file_extension}"
    return safe_filename

@router.post("/upload-receipt/")
async def upload_receipt(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Upload and process a receipt image using Mistral AI OCR
    
    Returns:
        - merchant: str
        - date: str  
        - total: float
        - subtotal: float (optional)
        - tax: float (optional)
        - items: List[dict] with name and price
    """
    try:
        # Validate the uploaded file
        validate_file(file)
        
        # Ensure upload directory exists
        os.makedirs(settings.upload_dir, exist_ok=True)
        
        # Create safe filename
        safe_filename = create_safe_filename(file.filename)
        file_path = os.path.join(settings.upload_dir, safe_filename)
        
        # Save uploaded file
        try:
            with open(file_path, "wb") as buffer:
                content = await file.read()
                
                # Check actual file size
                if len(content) > settings.max_file_size:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail=f"File too large. Maximum size: {settings.max_file_size} bytes"
                    )
                
                buffer.write(content)
                
            logger.info(f"File saved: {file_path}")
            
        except Exception as e:
            logger.error(f"Error saving file: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save uploaded file"
            )
        
        # Process OCR
        try:
            logger.info("Starting OCR processing")
            markdown_text = run_mistral_ocr(file_path)
            
            if not markdown_text or not markdown_text.strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Could not extract text from image. Please ensure the image is clear and contains a receipt."
                )
                
        except Exception as e:
            logger.error(f"OCR processing failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to process image with OCR"
            )
        
        # Parse receipt data
        try:
            logger.info("Starting receipt parsing")
            structured_json_str = parse_receipt(markdown_text)
            
            # Try to parse the JSON response
            import json
            try:
                structured_data = json.loads(structured_json_str)
            except json.JSONDecodeError:
                # If parsing fails, try to extract JSON from the response
                import re
                json_match = re.search(r'\{.*\}', structured_json_str, re.DOTALL)
                if json_match:
                    structured_data = json.loads(json_match.group())
                else:
                    raise ValueError("No valid JSON found in response")
                    
        except Exception as e:
            logger.error(f"Receipt parsing failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to parse receipt data"
            )
        
        # Clean up temporary file
        try:
            os.remove(file_path)
            logger.info(f"Cleaned up temporary file: {file_path}")
        except Exception as e:
            logger.warning(f"Failed to clean up temporary file: {str(e)}")
        
        # Validate required fields in response
        required_fields = ["merchant", "date", "total"]
        missing_fields = [field for field in required_fields if field not in structured_data]
        
        if missing_fields:
            logger.warning(f"Missing required fields: {missing_fields}")
            # Don't fail, but log the issue
        
        # Return structured response
        return {
            "success": True,
            "message": "Receipt processed successfully",
            "data": structured_data,
            "metadata": {
                "original_filename": file.filename,
                "processed_at": "2024-01-01T00:00:00Z"  # You might want to add actual timestamp
            }
        }
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Unexpected error in upload_receipt: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while processing the receipt"
        )

@router.get("/health")
async def receipt_health_check():
    """Health check for receipt processing service"""
    return {"status": "healthy", "service": "receipt_processing"}
