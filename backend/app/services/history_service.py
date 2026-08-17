from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from typing import Optional, List, Dict, Any
from app.database.history_models import PredictionHistory
from app.schemas.history import HistoryCreate

class HistoryService:
    @staticmethod
    def create_record(db: Session, record: HistoryCreate) -> PredictionHistory:
        db_record = PredictionHistory(
            order_id=record.order_id,
            source_type=record.source_type,
            title=record.title,
            input_text=record.input_text,
            source_url=record.source_url,
            image_filename=record.image_filename,
            extracted_text=record.extracted_text,
            prediction=record.prediction,
            category=record.category,
            confidence=record.confidence,
            reason=record.reason,
            important_phrases=[phrase.model_dump() for phrase in record.important_phrases],
            original_text=record.original_text,
            detected_language=record.detected_language,
            translated_text=record.translated_text,
            translation_status=record.translation_status,
            user_output_language=record.user_output_language
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)
        return db_record

    @staticmethod
    def create_combined_record(db: Session, order_id: str, ml_data: HistoryCreate, llm_data: dict) -> PredictionHistory:
        import logging
        logger = logging.getLogger(__name__)
        from app.database.history_models import EvidenceVerification, VerificationClaim, VerificationSource

        ml_data.order_id = order_id
        db_record = HistoryService.create_record(db, ml_data)

        # 3. Store Evidence in DB
        try:
            db_verification = EvidenceVerification(
                prediction_id=db_record.id,
                evidence_score=llm_data.get("evidence_score", 0),
                verification_status=llm_data.get("verification_status", ""),
                summary=llm_data.get("summary", "")
            )
            db.add(db_verification)
            db.commit()
            db.refresh(db_verification)

            for claim in llm_data.get("claims", []):
                db_claim = VerificationClaim(
                    verification_id=db_verification.id,
                    claim_id=claim.get("claim_id", ""),
                    claim_text=claim.get("claim_text", ""),
                    status=claim.get("status", ""),
                    importance=claim.get("importance", ""),
                    support_score=claim.get("support_score", 0.0),
                    contradiction_score=claim.get("contradiction_score", 0.0)
                )
                db.add(db_claim)
                db.commit()
                db.refresh(db_claim)

                for src in claim.get("evidence", []):
                    db_source = VerificationSource(
                        claim_id=claim.get("claim_id", ""),
                        verification_id=db_verification.id,
                        title=src.get("title", ""),
                        publisher=src.get("publisher", ""),
                        url=src.get("url", ""),
                        published_date=src.get("published_date", ""),
                        source_tier=src.get("source_tier", 0),
                        reliability_score=src.get("source_reliability_score", 0.0),
                        stance=src.get("stance", ""),
                        relevance=src.get("relevance", ""),
                        reason=src.get("reason", "")
                    )
                    db.add(db_source)
            db.commit()
        except Exception as e:
            logger.error(f"Error saving combined evidence to DB: {str(e)}")
            db.rollback()
        
        return db_record

    @staticmethod
    def get_paginated(
        db: Session, 
        page: int = 1, 
        page_size: int = 20, 
        search_query: Optional[str] = None,
        source_type: Optional[str] = None,
        category: Optional[str] = None,
        sort_by: str = "created_at",
        sort_desc: bool = True
    ) -> tuple[List[PredictionHistory], int]:
        
        query = db.query(PredictionHistory)

        # Filters
        if search_query:
            search_pattern = f"%{search_query}%"
            query = query.filter(
                or_(
                    PredictionHistory.title.ilike(search_pattern),
                    PredictionHistory.input_text.ilike(search_pattern),
                    PredictionHistory.source_url.ilike(search_pattern),
                    PredictionHistory.extracted_text.ilike(search_pattern)
                )
            )
        
        if source_type:
            query = query.filter(PredictionHistory.source_type == source_type)
            
        if category:
            query = query.filter(PredictionHistory.category == category)

        # Total count
        total = query.count()

        # Sorting whitelist
        valid_sort_columns = {
            "created_at": PredictionHistory.created_at,
            "confidence": PredictionHistory.confidence,
            "prediction": PredictionHistory.prediction
        }
        
        sort_col = valid_sort_columns.get(sort_by, PredictionHistory.created_at)
        
        if sort_desc:
            query = query.order_by(desc(sort_col))
        else:
            query = query.order_by(asc(sort_col))

        # Pagination
        offset = (page - 1) * page_size
        items = query.offset(offset).limit(page_size).all()

        return items, total

    @staticmethod
    def get_by_id(db: Session, history_id: int) -> Optional[PredictionHistory]:
        return db.query(PredictionHistory).filter(PredictionHistory.id == history_id).first()

    @staticmethod
    def delete_record(db: Session, history_id: int) -> bool:
        record = db.query(PredictionHistory).filter(PredictionHistory.id == history_id).first()
        if not record:
            return False
        
        db.delete(record)
        db.commit()
        return True

    @staticmethod
    def toggle_save_record(db: Session, history_id: int) -> Optional[PredictionHistory]:
        record = db.query(PredictionHistory).filter(PredictionHistory.id == history_id).first()
        if not record:
            return None
        
        record.saved = not record.saved
        db.commit()
        db.refresh(record)
        return record
