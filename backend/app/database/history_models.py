from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.history_db import HistoryBase

class PredictionHistory(HistoryBase):
    __tablename__ = "prediction_history"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String, index=True, nullable=True) # UUID to match ML and LLM records
    source_type = Column(String, index=True) # "text", "url", "image"
    title = Column(Text, nullable=True)
    input_text = Column(Text, nullable=True) # Full text input or extracted text
    source_url = Column(Text, nullable=True)
    image_filename = Column(String, nullable=True)
    extracted_text = Column(Text, nullable=True)
    prediction = Column(Integer) # 0 for Fake, 1 for Real
    category = Column(String, index=True) # "Fake" or "Real"
    confidence = Column(Float)
    reason = Column(Text)
    important_phrases = Column(JSON) # List of dictionaries
    
    # Multilingual Layer
    original_text = Column(Text, nullable=True)
    detected_language = Column(String, nullable=True)
    translated_text = Column(Text, nullable=True)
    translation_status = Column(String, nullable=True)
    user_output_language = Column(String, nullable=True)

    saved = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

class EvidenceVerification(HistoryBase):
    __tablename__ = "evidence_verifications"

    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, ForeignKey("prediction_history.id"), index=True)
    evidence_score = Column(Float)
    verification_status = Column(String)
    summary = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    prediction = relationship("PredictionHistory")

class VerificationClaim(HistoryBase):
    __tablename__ = "verification_claims"

    id = Column(Integer, primary_key=True, index=True)
    verification_id = Column(Integer, ForeignKey("evidence_verifications.id"), index=True)
    claim_id = Column(String, index=True)
    claim_text = Column(Text)
    status = Column(String)
    importance = Column(String)
    support_score = Column(Float)
    contradiction_score = Column(Float)

class VerificationSource(HistoryBase):
    __tablename__ = "verification_sources"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(String, index=True)
    verification_id = Column(Integer, ForeignKey("evidence_verifications.id"), index=True)
    title = Column(Text)
    publisher = Column(String)
    url = Column(Text)
    published_date = Column(String)
    source_tier = Column(Integer)
    reliability_score = Column(Float)
    stance = Column(String)
    relevance = Column(String)
    reason = Column(Text)
