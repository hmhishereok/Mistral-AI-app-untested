import requests
from backend.app.core.settings import get_settings


def parse_receipt(markdown_text: str) -> str:
    settings = get_settings()  # Only call here, not at top level
    url = "https://api.mistral.ai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.mistral_api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "mistral-medium-2505",
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a receipt parser. Extract merchant, date, items with names and prices, "
                    "subtotal, tax, and total. Return only JSON matching:\n"
                    "{\n"
                    '  "merchant": "string",\n'
                    '  "date": "YYYY-MM-DD",\n'
                    '  "items": [{"name":"string","price":float}],\n'
                    '  "subtotal": float,\n'
                    '  "tax": float,\n'
                    '  "total": float\n'
                    "}"
                )
            },
            {
                "role": "user",
                "content": markdown_text
            }
        ],
        "temperature": 0.0,
        "max_tokens": 512
    }

    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]
