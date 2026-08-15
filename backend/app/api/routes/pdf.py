from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.pdf_service import PDFService
from pydantic import BaseModel

router = APIRouter(prefix="/api/pdf", tags=["pdf"])

class PDFExtractResponse(BaseModel):
    success: bool
    text: str

@router.post("/extract", response_model=PDFExtractResponse)
async def extract_pdf(file: UploadFile = File(...)):
    try:
        extracted_text = await PDFService.extract_text(file)
        return PDFExtractResponse(success=True, text=extracted_text)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error during PDF extraction")
