from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime
from app.schemas.prediction import ImportantPhrase

class HistoryCreate(BaseModel):
    source_type: str
    title: Optional[str] = None
    input_text: Optional[str] = None
    source_url: Optional[str] = None
    image_filename: Optional[str] = None
    extracted_text: Optional[str] = None
    prediction: int
    category: str
    confidence: float
    reason: str
    important_phrases: List[ImportantPhrase]

class HistoryResponse(BaseModel):
    id: int
    source_type: str
    title: Optional[str] = None
    input_text: Optional[str] = None
    source_url: Optional[str] = None
    image_filename: Optional[str] = None
    extracted_text: Optional[str] = None
    prediction: int
    category: str
    confidence: float
    reason: str
    important_phrases: List[ImportantPhrase]
    saved: bool = False
    created_at: datetime

    class Config:
        from_attributes = True

class HistoryPaginatedResponse(BaseModel):
    success: bool
    items: List[HistoryResponse]
    page: int
    page_size: int
    total: int
