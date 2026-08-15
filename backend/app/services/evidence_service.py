from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.database.history_models import PredictionHistory, EvidenceVerification, VerificationClaim, VerificationSource
from app.services.gemini_evidence_service import gemini_evidence_service
from app.schemas.evidence import EvidenceResult
import logging

logger = logging.getLogger(__name__)

class EvidenceService:
    @staticmethod
    async def analyze_and_store(db: Session, history_id: int) -> dict:
        # 1. Retrieve the original text from prediction history
        history_record = db.query(PredictionHistory).filter(PredictionHistory.id == history_id).first()
        if not history_record:
            raise HTTPException(status_code=404, detail="Prediction history not found")

        text_to_analyze = history_record.extracted_text or history_record.input_text
        if not text_to_analyze:
            raise HTTPException(status_code=400, detail="No text available for evidence verification")

        # 2. Call Gemini
        evidence_result = await gemini_evidence_service.verify_evidence(text_to_analyze)

        # 3. Store in DB
        try:
            db_verification = EvidenceVerification(
                prediction_id=history_id,
                evidence_score=evidence_result.evidence_score,
                verification_status=evidence_result.verification_status,
                summary=evidence_result.summary
            )
            db.add(db_verification)
            db.commit()
            db.refresh(db_verification)

            for claim in evidence_result.claims:
                db_claim = VerificationClaim(
                    verification_id=db_verification.id,
                    claim_id=claim.claim_id,
                    claim_text=claim.claim_text,
                    status=claim.status,
                    importance=claim.importance,
                    support_score=claim.support_score,
                    contradiction_score=claim.contradiction_score
                )
                db.add(db_claim)
                db.commit()
                db.refresh(db_claim)

                for src in claim.evidence:
                    db_source = VerificationSource(
                        claim_id=claim.claim_id,
                        verification_id=db_verification.id,
                        title=src.title,
                        publisher=src.publisher,
                        url=src.url,
                        published_date=src.published_date,
                        source_tier=src.source_tier,
                        reliability_score=src.source_reliability_score,
                        stance=src.stance,
                        relevance=src.relevance,
                        reason=src.reason
                    )
                    db.add(db_source)
            db.commit()
        except Exception as e:
            logger.error(f"Error saving evidence to DB: {str(e)}")
            db.rollback()
            # We can still return the evidence_result even if DB save fails
            
        return evidence_result.model_dump()
