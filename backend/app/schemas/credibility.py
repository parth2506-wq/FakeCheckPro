from pydantic import BaseModel, Field
from typing import Optional
from app.schemas.prediction import PredictionRequest
from app.schemas.evidence import EvidenceResult

class CredibilityAnalyzeRequest(PredictionRequest):
    user_output_language: Optional[str] = Field("en", description="The requested language for the AI explanation")

class CredibilityCalculation(BaseModel):
    ml_weight: float
    evidence_weight: float
    weighted_base_score: float

class CredibilityAnalyzeResponse(BaseModel):
    ml_prediction: str
    ml_confidence: float
    ml_fake_risk: float
    evidence_score: Optional[float] = None
    evidence_direction: Optional[str] = None
    evidence_quality: Optional[str] = None
    source_reliability_score: Optional[float] = None
    evidence_fake_risk: Optional[float] = None
    final_credibility_risk_score: float
    risk_level: str
    signal_relationship: str
    final_assessment: str
    decision_type: str
    decision_reason: str
    explanation: str
    calculation: CredibilityCalculation
    
    # Raw Chain 1 / Chain 2 Results
    raw_ml_result: dict
    raw_evidence_result: Optional[EvidenceResult] = None
