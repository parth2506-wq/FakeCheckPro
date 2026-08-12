from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from typing import Optional, List, Dict, Any
from app.database.history_models import PredictionHistory
from app.schemas.history import HistoryCreate

class HistoryService:
    @staticmethod
    def create_record(db: Session, record: HistoryCreate) -> PredictionHistory:
        db_record = PredictionHistory(
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
            important_phrases=[phrase.model_dump() for phrase in record.important_phrases]
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)
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
