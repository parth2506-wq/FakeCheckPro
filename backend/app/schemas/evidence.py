from pydantic import BaseModel, Field
from typing import List, Optional

class EvidenceRequest(BaseModel):
    text: str = Field(..., description="The original input text to analyze")
    translated_text: Optional[str] = Field(None, description="The English translation of the text if applicable")
    detected_language: Optional[str] = Field(None, description="The language code of the original text")
    ml_result: Optional[dict] = Field(None, description="The ML prediction result")
    user_output_language: Optional[str] = Field("en", description="The requested language for the AI explanation")

class Source(BaseModel):
    title: str
    publisher: Optional[str] = None
    url: Optional[str] = None
    published_date: Optional[str] = None
    source_tier: int
    source_reliability_score: float
    relevance: str
    stance: str
    reason: str

class Claim(BaseModel):
    claim_id: str
    claim_text: str
    importance: str
    status: str
    support_score: float
    contradiction_score: float
    evidence: List[Source]

class SourceSummary(BaseModel):
    high_reliability_sources: int = 0
    medium_reliability_sources: int = 0
    low_reliability_sources: int = 0

class EvidenceSummaryCounts(BaseModel):
    supporting: int = 0
    contradicting: int = 0
    neutral: int = 0

class EvidenceResult(BaseModel):
    verification_status: str
    probable_source: Optional[str] = Field(None, description="The probable news organization, publisher, or handle that originally created this content, if identifiable.")
    evidence_score: int
    evidence_direction: str = Field(description="SUPPORTING, CONTRADICTING, MIXED, or INSUFFICIENT")
    evidence_quality: str = Field(description="HIGH, MEDIUM, or LOW")
    source_reliability_score: float = Field(description="Overall reliability of sources (0-100)")
    summary: str
    claims: List[Claim] = []
    source_summary: SourceSummary
    evidence_summary: EvidenceSummaryCounts
    reasoning: List[str] = []
    limitations: List[str] = []
    verification_timestamp: str
    disclaimer: str = "This is an AI-assisted evidence assessment and does not constitute definitive proof of factual truth."

class EvidenceResponse(BaseModel):
    success: bool
    evidence: Optional[EvidenceResult] = None
    error: Optional[str] = None
