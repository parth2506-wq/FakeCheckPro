from pydantic import BaseModel, Field, model_validator
from typing import List, Optional, Dict, Any

class PredictionRequest(BaseModel):
    title: Optional[str] = Field(default="", max_length=1000, description="The headline or title of the news article")
    text: Optional[str] = Field(default="", max_length=50000, description="The main text body of the news article")

    @model_validator(mode='before')
    @classmethod
    def check_empty_input(cls, values):
        title = values.get('title', '') if isinstance(values, dict) else getattr(values, 'title', '')
        text = values.get('text', '') if isinstance(values, dict) else getattr(values, 'text', '')
        if not title.strip() and not text.strip():
            raise ValueError("Either title or text must be provided.")
        return values

class ImportantPhrase(BaseModel):
    phrase: str
    contribution: float
    direction: str

class PredictionResponse(BaseModel):
    success: bool
    source_type: str = "text"
    prediction: int
    category: str
    confidence: float
    confidence_percentage: float
    reason: str
    important_phrases: List[ImportantPhrase]
    history_id: Optional[int] = None

class HealthResponse(BaseModel):
    status: str
    model: str
    vectorizer_loaded: bool
    model_loaded: bool

class ModelInfoResponse(BaseModel):
    model: str
    feature_type: str
    max_features: int
    ngram_range: List[int]
    classes: Dict[str, str]
