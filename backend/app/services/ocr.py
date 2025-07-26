import base64
import mimetypes
import requests
import os
import logging
from typing import Optional
from core.settings import get_settings

# Configure logging
logger = logging.getLogger(__name__)

def encode_image(image_path: str) -> str:
    """Encode image to base64"""
    try:
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image file not found: {image_path}")
            
        with open(image_path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode("utf-8")
            logger.info(f"Successfully encoded image: {image_path}")
            return encoded
            
    except Exception as e:
        logger.error(f"Failed to encode image {image_path}: {str(e)}")
        raise

def get_mime_type(image_path: str) -> str:
    """Get MIME type of image file"""
    mime, _ = mimetypes.guess_type(image_path)
    detected_type = mime or "image/jpeg"
    logger.debug(f"Detected MIME type for {image_path}: {detected_type}")
    return detected_type

def run_mistral_ocr(image_path: str) -> str:
    """
    Run Mistral OCR on the given image
    
    Args:
        image_path: Path to the image file
        
    Returns:
        Extracted text in markdown format
        
    Raises:
        FileNotFoundError: If image file doesn't exist
        requests.RequestException: If API request fails
        ValueError: If API response is invalid
    """
    settings = get_settings()  # Only call here, not at top level
    try:
        # Validate inputs
        if not image_path:
            raise ValueError("Image path cannot be empty")
            
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image file not found: {image_path}")
            
        if not settings.mistral_api_key:
            raise ValueError("Mistral API key not configured")
        
        # Get file info
        mime_type = get_mime_type(image_path)
        image_b64 = encode_image(image_path)
        
        # Prepare API request
        ocr_url = "https://api.mistral.ai/v1/ocr"
        
        payload = {
            "model": "mistral-ocr-2505",
            "document": {
                "type": "image_url",
                "image_url": f"data:{mime_type};base64,{image_b64}"
            },
            "include_image_base64": False
        }
        
        headers = {
            "Authorization": f"Bearer {settings.mistral_api_key}",
            "Content-Type": "application/json",
            "User-Agent": "ReceiptScanner/1.0"
        }
        
        logger.info(f"Sending OCR request for image: {image_path}")
        
        # Make API request with timeout
        response = requests.post(
            ocr_url, 
            headers=headers, 
            json=payload, 
            timeout=30  # 30 second timeout
        )
        
        # Check response
        if response.status_code == 401:
            logger.error("Mistral API authentication failed")
            raise ValueError("Invalid Mistral API key")
        elif response.status_code == 429:
            logger.error("Mistral API rate limit exceeded")
            raise ValueError("Rate limit exceeded. Please try again later.")
        elif not response.ok:
            logger.error(f"Mistral API error: {response.status_code} - {response.text}")
            response.raise_for_status()
        
        # Parse response
        try:
            data = response.json()
        except ValueError as e:
            logger.error(f"Invalid JSON response from Mistral API: {str(e)}")
            raise ValueError("Invalid response from OCR service")
        
        # Extract text from pages
        if "pages" not in data:
            logger.error(f"Unexpected API response format: {data}")
            raise ValueError("Unexpected response format from OCR service")
        
        pages = data.get("pages", [])
        if not pages:
            logger.warning("No pages found in OCR response")
            return ""
        
        # Combine markdown from all pages
        markdown_texts = []
        for page in pages:
            if isinstance(page, dict) and "markdown" in page:
                markdown_text = page.get("markdown", "")
                if markdown_text:
                    markdown_texts.append(markdown_text)
        
        combined_text = "\n\n".join(markdown_texts)
        
        if not combined_text.strip():
            logger.warning("No text extracted from image")
            return ""
        
        logger.info(f"Successfully extracted {len(combined_text)} characters from image")
        return combined_text
        
    except requests.exceptions.Timeout:
        logger.error("OCR request timed out")
        raise ValueError("OCR request timed out. Please try again.")
    except requests.exceptions.ConnectionError:
        logger.error("Failed to connect to Mistral API")
        raise ValueError("Failed to connect to OCR service")
    except requests.exceptions.RequestException as e:
        logger.error(f"OCR request failed: {str(e)}")
        raise ValueError(f"OCR request failed: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error in OCR processing: {str(e)}")
        raise
