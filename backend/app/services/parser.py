import requests
import json
import logging
from typing import Dict, Any, Optional
from backend.app.core.settings import get_settings

# Configure logging
logger = logging.getLogger(__name__)
settings = get_settings()

def parse_receipt(markdown_text: str) -> str:
    """
    Parse receipt markdown text using Mistral AI
    
    Args:
        markdown_text: OCR extracted text in markdown format
        
    Returns:
        JSON string with structured receipt data
        
    Raises:
        ValueError: If API request fails or response is invalid
        requests.RequestException: If network request fails
    """
    try:
        # Validate inputs
        if not markdown_text or not markdown_text.strip():
            raise ValueError("Markdown text cannot be empty")
            
        if not settings.mistral_api_key:
            raise ValueError("Mistral API key not configured")
        
        # Prepare API request
        url = "https://api.mistral.ai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {settings.mistral_api_key}",
            "Content-Type": "application/json",
            "User-Agent": "ReceiptScanner/1.0"
        }
        
        # Improved system prompt for better parsing
        system_prompt = """You are a receipt parser that extracts structured data from receipt text.

IMPORTANT: Return ONLY valid JSON in the exact format specified below. Do not include any explanatory text, markdown formatting, or code blocks.

Extract the following information and return as JSON:
{
  "merchant": "string - store/restaurant name",
  "date": "YYYY-MM-DD - transaction date", 
  "items": [
    {
      "name": "string - item name",
      "price": "number - item price as float"
    }
  ],
  "subtotal": "number - subtotal as float (optional)",
  "tax": "number - tax amount as float (optional)", 
  "total": "number - total amount as float"
}

Rules:
- Use null for missing values
- Convert all prices to numbers (remove currency symbols)
- Use best judgment for unclear text
- If no items found, use empty array []
- Always include merchant, date, and total (use reasonable defaults if unclear)"""

        payload = {
            "model": "mistral-medium-2505",
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user", 
                    "content": f"Parse this receipt text:\n\n{markdown_text}"
                }
            ],
            "temperature": 0.1,  # Lower temperature for more consistent results
            "max_tokens": 1024,
            "response_format": {"type": "json_object"}  # Request JSON format
        }
        
        logger.info("Sending receipt parsing request to Mistral AI")
        
        # Make API request with timeout
        response = requests.post(
            url, 
            headers=headers, 
            json=payload, 
            timeout=30
        )
        
        # Check response status
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
            response_data = response.json()
        except ValueError as e:
            logger.error(f"Invalid JSON response from Mistral API: {str(e)}")
            raise ValueError("Invalid response from parsing service")
        
        # Extract content
        if "choices" not in response_data or not response_data["choices"]:
            logger.error(f"Unexpected API response format: {response_data}")
            raise ValueError("Unexpected response format from parsing service")
        
        content = response_data["choices"][0]["message"]["content"]
        
        if not content:
            logger.error("Empty content in API response")
            raise ValueError("Empty response from parsing service")
        
        # Validate the JSON response
        try:
            parsed_data = json.loads(content)
            
            # Basic validation
            if not isinstance(parsed_data, dict):
                raise ValueError("Response is not a JSON object")
            
            # Ensure required fields exist
            required_fields = ["merchant", "date", "total"]
            for field in required_fields:
                if field not in parsed_data:
                    logger.warning(f"Missing required field: {field}")
                    # Add default values for missing fields
                    if field == "merchant":
                        parsed_data["merchant"] = "Unknown Merchant"
                    elif field == "date": 
                        parsed_data["date"] = "Unknown Date"
                    elif field == "total":
                        parsed_data["total"] = 0.0
            
            # Ensure items is a list
            if "items" not in parsed_data:
                parsed_data["items"] = []
            elif not isinstance(parsed_data["items"], list):
                parsed_data["items"] = []
            
            # Validate and clean item data
            cleaned_items = []
            for item in parsed_data["items"]:
                if isinstance(item, dict) and "name" in item:
                    cleaned_item = {
                        "name": str(item.get("name", "Unknown Item")),
                        "price": float(item.get("price", 0.0)) if item.get("price") is not None else 0.0
                    }
                    cleaned_items.append(cleaned_item)
            
            parsed_data["items"] = cleaned_items
            
            # Ensure numeric fields are floats
            for field in ["total", "subtotal", "tax"]:
                if field in parsed_data and parsed_data[field] is not None:
                    try:
                        parsed_data[field] = float(parsed_data[field])
                    except (ValueError, TypeError):
                        logger.warning(f"Invalid numeric value for {field}: {parsed_data[field]}")
                        parsed_data[field] = 0.0
            
            logger.info("Successfully parsed receipt data")
            return json.dumps(parsed_data, ensure_ascii=False, indent=2)
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {str(e)}")
            logger.error(f"Raw content: {content}")
            
            # Try to extract JSON from the content if it's wrapped in markdown or other text
            import re
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                try:
                    extracted_json = json_match.group()
                    parsed_data = json.loads(extracted_json)
                    logger.info("Successfully extracted JSON from wrapped content")
                    return json.dumps(parsed_data, ensure_ascii=False, indent=2)
                except json.JSONDecodeError:
                    pass
            
            # Return a default structure if parsing completely fails
            logger.warning("Returning default receipt structure due to parsing failure")
            default_response = {
                "merchant": "Unable to parse",
                "date": "Unknown",
                "total": 0.0,
                "items": [],
                "error": "Failed to parse receipt data"
            }
            return json.dumps(default_response, ensure_ascii=False, indent=2)
            
    except requests.exceptions.Timeout:
        logger.error("Receipt parsing request timed out")
        raise ValueError("Parsing request timed out. Please try again.")
    except requests.exceptions.ConnectionError:
        logger.error("Failed to connect to Mistral API for parsing")
        raise ValueError("Failed to connect to parsing service")
    except requests.exceptions.RequestException as e:
        logger.error(f"Parsing request failed: {str(e)}")
        raise ValueError(f"Parsing request failed: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error in receipt parsing: {str(e)}")
        raise
