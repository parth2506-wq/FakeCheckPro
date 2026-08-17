from pydantic import BaseModel
from typing import Optional, List
from app.schemas.prediction import ImportantPhrase

class ImageOcrResponse(BaseModel):
    success: bool
    filename: str
    extracted_text: str

class ImagePredictionResponse(BaseModel):
    success: bool
    source_type: str = "image"
    filename: str
    extracted_text: str
    prediction: int
    category: str
    confidence: float
    confidence_percentage: float
    reason: str
    important_phrases: List[ImportantPhrase]
    history_id: Optional[int] = None

    # Multilingual Layer
    original_text: Optional[str] = None
    translated_text: Optional[str] = None
    detected_language: Optional[str] = None
    translation_status: Optional[str] = None
