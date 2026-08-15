from pydantic import BaseModel, Field
from typing import List, Optional

class EvidenceRequest(BaseModel):
    history_id: int = Field(..., description="The PredictionHistory ID containing the original input text")

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
    evidence_score: int
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
