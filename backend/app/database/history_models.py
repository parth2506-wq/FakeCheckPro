from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON, Boolean
from sqlalchemy.sql import func
from app.database.history_db import HistoryBase

class PredictionHistory(HistoryBase):
    __tablename__ = "prediction_history"

    id = Column(Integer, primary_key=True, index=True)
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
    saved = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
