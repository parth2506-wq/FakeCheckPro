import io
from fastapi import UploadFile
from pypdf import PdfReader

class PDFService:
    @staticmethod
    async def extract_text(file: UploadFile) -> str:
        if file.content_type != 'application/pdf':
            raise ValueError(f"Unsupported format: {file.content_type}. Expected application/pdf")

        content = await file.read()
        if len(content) == 0:
            raise ValueError("Uploaded PDF is empty.")
            
        try:
            pdf_file = io.BytesIO(content)
            reader = PdfReader(pdf_file)
            extracted_text = []
            
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text.append(text)
                    
            full_text = "\n".join(extracted_text)
            
            if not full_text or not full_text.strip():
                raise ValueError("No extractable text found in the PDF.")
                
            return full_text.strip()
        except ValueError as e:
            raise e
        except Exception as e:
            raise ValueError(f"PDF processing failed: {str(e)}")
