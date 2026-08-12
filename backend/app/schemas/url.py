from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from app.schemas.prediction import ImportantPhrase

class UrlPredictionRequest(BaseModel):
    url: HttpUrl

class UrlPredictionResponse(BaseModel):
    success: bool
    source_type: str = "url"
    url: str
    title: Optional[str] = None
    extracted_text: Optional[str] = None
    prediction: int
    category: str
    confidence: float
    confidence_percentage: float
    reason: str
    important_phrases: List[ImportantPhrase]
    history_id: Optional[int] = None
    source_domain: Optional[str] = None
