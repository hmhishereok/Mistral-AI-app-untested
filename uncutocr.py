import base64
import os
import mimetypes
from dotenv import load_dotenv
from mistralai import Mistral

# Load environment variables from your existing .env file
env_path = r"C:\Users\Hendrix\OneDrive\Documents\Code\Mistral-AI-app\backend\.env"
load_dotenv(env_path)

def encode_image(image_path):
    """Encode the image to base64."""
    try:
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    except FileNotFoundError:
        print(f"Error: The file {image_path} was not found.")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def get_image_mime_type(image_path):
    """Get the MIME type of the image."""
    mime_type, _ = mimetypes.guess_type(image_path)
    if mime_type is None:
        # Default to jpeg if can't determine
        mime_type = 'image/jpeg'
    return mime_type

def process_ocr(image_path, api_key):
    """Process OCR on the given image."""
    # Validate inputs
    if not image_path:
        print("Error: No image path provided.")
        return None
    
    if not os.path.exists(image_path):
        print(f"Error: Image file {image_path} does not exist.")
        return None
    
    if not api_key:
        print("Error: No API key provided.")
        return None
    
    # Encode image
    print(f"Encoding image: {image_path}")
    base64_image = encode_image(image_path)
    
    if not base64_image:
        print("Failed to encode image.")
        return None
    
    # Get correct MIME type
    mime_type = get_image_mime_type(image_path)
    print(f"Detected MIME type: {mime_type}")
    
    # Initialize client
    try:
        client = Mistral(api_key=api_key)
        print("Mistral client initialized successfully.")
    except Exception as e:
        print(f"Error initializing Mistral client: {e}")
        return None
    
    # Process OCR
    try:
        print("Processing OCR...")
        ocr_response = client.ocr.process(
            model="mistral-ocr-latest",
            document={
                "type": "image_url",
                "image_url": f"data:{mime_type};base64,{base64_image}" 
            },
            include_image_base64=True
        )
        print("OCR processing completed successfully!")
        return ocr_response
        
    except Exception as e:
        print(f"Error during OCR processing: {e}")
        return None

def extract_text_from_response(ocr_response):
    """Extract and format text from OCR response."""
    if not ocr_response or not hasattr(ocr_response, 'pages'):
        print("Invalid OCR response.")
        return None
    
    if not ocr_response.pages:
        print("No pages found in OCR response.")
        return None
    
    extracted_text = []
    for i, page in enumerate(ocr_response.pages):
        print(f"Processing page {i + 1}...")
        if hasattr(page, 'markdown') and page.markdown:
            extracted_text.append(f"=== Page {i + 1} ===\n{page.markdown}")
        else:
            print(f"No text found on page {i + 1}")
    
    return "\n\n".join(extracted_text)

def main():
    """Main function to run the OCR process."""
    # Configuration
    image_path = r"C:\Users\Hendrix\OneDrive\Documents\Code\Mistral-AI-app\backend\receipts\images\receipt_00000.png"  # Change this to your actual image path
    
    # Get API key from environment variable (loaded from .env file)
    api_key = os.environ.get("MISTRAL_API_KEY")
    
    if not api_key:
        print("Error: MISTRAL_API_KEY not found.")
        print("Make sure you have a .env file with MISTRAL_API_KEY=your_api_key")
        print("Or set the environment variable manually.")
        return
    
    # Process OCR
    ocr_response = process_ocr(image_path, api_key)
    
    if ocr_response:
        # Extract and display text
        extracted_text = extract_text_from_response(ocr_response)
        
        if extracted_text:
            print("\n" + "="*50)
            print("EXTRACTED TEXT:")
            print("="*50)
            print(extracted_text)
            
            # Optionally save to file
            output_file = "extracted_text.txt"
            try:
                with open(output_file, "w", encoding="utf-8") as f:
                    f.write(extracted_text)
                print(f"\nText saved to: {output_file}")
            except Exception as e:
                print(f"Error saving to file: {e}")
        else:
            print("No text could be extracted from the image.")
    else:
        print("OCR processing failed.")

if __name__ == "__main__":
    main()