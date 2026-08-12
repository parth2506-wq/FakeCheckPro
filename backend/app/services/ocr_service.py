import os
from PIL import Image, ImageEnhance
import pytesseract
from fastapi import UploadFile

class OCRService:
    @staticmethod
    def _setup_tesseract():
        tesseract_cmd = os.getenv("TESSERACT_CMD")
        if tesseract_cmd:
            pytesseract.pytesseract.tesseract_cmd = tesseract_cmd

    @staticmethod
    async def extract_text(file: UploadFile) -> str:
        # Validate file type
        valid_extensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if file.content_type not in valid_extensions:
            raise ValueError(f"Unsupported image format: {file.content_type}")

        # Validate size (handled dynamically or via max size env variable)
        max_size_mb = int(os.getenv("MAX_IMAGE_SIZE_MB", 10))
        max_bytes = max_size_mb * 1024 * 1024
        
        # Read file contents
        content = await file.read()
        if len(content) > max_bytes:
            raise ValueError(f"File size exceeds maximum allowed size of {max_size_mb}MB.")
        if len(content) == 0:
            raise ValueError("Uploaded image is empty.")
            
        import io
        try:
            image = Image.open(io.BytesIO(content))
        except Exception:
            raise ValueError("Invalid or corrupted image file.")
        
        # Preprocessing to improve OCR
        try:
            # 1. Convert to grayscale
            image = image.convert('L')
            
            # 2. Enhance contrast
            enhancer = ImageEnhance.Contrast(image)
            image = enhancer.enhance(1.5)
            
            # Extract text
            OCRService._setup_tesseract()
            text = pytesseract.image_to_string(image)
            
            if not text or not text.strip():
                raise ValueError("No meaningful text could be extracted from the image.")
                
            return text.strip()
        except ValueError as e:
            raise e
        except Exception as e:
            raise ValueError(f"OCR processing failed: {str(e)}")
