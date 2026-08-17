from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime
from app.schemas.prediction import ImportantPhrase
from app.schemas.evidence import EvidenceResult

class HistoryCreate(BaseModel):
    order_id: Optional[str] = None
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
    
    # Multilingual Layer
    original_text: Optional[str] = None
    detected_language: Optional[str] = None
    translated_text: Optional[str] = None
    translation_status: Optional[str] = None
    user_output_language: Optional[str] = None
    
    # Credibility Assessment fields
    credibility_score: Optional[float] = None
    risk_level: Optional[str] = None
    final_assessment: Optional[str] = None
    signal_relationship: Optional[str] = None

class HistoryResponse(BaseModel):
    id: int
    order_id: Optional[str] = None
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
    
    # Multilingual Layer
    original_text: Optional[str] = None
    detected_language: Optional[str] = None
    translated_text: Optional[str] = None
    translation_status: Optional[str] = None
    user_output_language: Optional[str] = None

    # Credibility Assessment fields
    credibility_score: Optional[float] = None
    risk_level: Optional[str] = None
    final_assessment: Optional[str] = None
    signal_relationship: Optional[str] = None

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

class CombinedSaveRequest(BaseModel):
    order_id: str
    ml_data: HistoryCreate
    llm_data: EvidenceResult
