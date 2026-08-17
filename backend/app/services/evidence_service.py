from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.database.history_models import PredictionHistory, EvidenceVerification, VerificationClaim, VerificationSource
from app.services.gemini_evidence_service import gemini_evidence_service
from app.schemas.evidence import EvidenceResult
import logging

logger = logging.getLogger(__name__)

class EvidenceService:
    @staticmethod
    async def analyze(
        text_to_analyze: str, 
        translated_text: str = None, 
        detected_language: str = None, 
        ml_result: dict = None, 
        user_output_language: str = "en"
    ) -> dict:
        if not text_to_analyze or not text_to_analyze.strip():
            raise HTTPException(status_code=400, detail="No text available for evidence verification")

        # 1. Call Gemini
        evidence_result = await gemini_evidence_service.verify_evidence(
            text_to_analyze,
            translated_text=translated_text,
            detected_language=detected_language,
            ml_result=ml_result,
            user_output_language=user_output_language
        )
        
        return evidence_result.model_dump()
