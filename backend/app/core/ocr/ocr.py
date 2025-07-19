import base64
import mimetypes
import requests
import os
from ..settings import get_settings

settings = get_settings()

def encode_image(image_path: str) -> str:
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

def get_mime_type(image_path: str) -> str:
    mime, _ = mimetypes.guess_type(image_path)
    return mime or "image/jpeg"

def run_mistral_ocr(image_path: str) -> str:
    mime_type = get_mime_type(image_path)
    image_b64 = encode_image(image_path)
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
        "Authorization": f"Bearer {settings.api_key}",
        "Content-Type": "application/json"
    }

    response = requests.post(ocr_url, headers=headers, json=payload)
    response.raise_for_status()

    data = response.json()
    return "\n\n".join(p.get("markdown", "") for p in data.get("pages", []))
