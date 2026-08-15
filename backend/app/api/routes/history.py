from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.schemas.history import HistoryPaginatedResponse, HistoryResponse, CombinedSaveRequest
from app.services.history_service import HistoryService
from app.database.history_db import get_history_db

router = APIRouter(prefix="/api/history", tags=["history"])

@router.get("", response_model=HistoryPaginatedResponse)
def get_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    q: Optional[str] = None,
    source_type: Optional[str] = None,
    category: Optional[str] = None,
    sort_by: str = Query("created_at", regex="^(created_at|confidence|prediction)$"),
    sort_desc: bool = True,
    db: Session = Depends(get_history_db)
):
    try:
        items, total = HistoryService.get_paginated(
            db, page, page_size, search_query=q, 
            source_type=source_type, category=category, 
            sort_by=sort_by, sort_desc=sort_desc
        )
        
        return HistoryPaginatedResponse(
            success=True,
            items=items,
            page=page,
            page_size=page_size,
            total=total
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")

@router.post("/save", response_model=HistoryResponse)
def save_combined_history(request: CombinedSaveRequest, db: Session = Depends(get_history_db)):
    try:
        record = HistoryService.create_combined_record(
            db=db,
            order_id=request.order_id,
            ml_data=request.ml_data,
            llm_data=request.llm_data.model_dump()
        )
        return record
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save combined history: {str(e)}")

@router.get("/{history_id}", response_model=HistoryResponse)
def get_history_item(history_id: int, db: Session = Depends(get_history_db)):
    item = HistoryService.get_by_id(db, history_id)
    if not item:
        raise HTTPException(status_code=404, detail="History record not found")
    return item

@router.delete("/{history_id}")
def delete_history_item(history_id: int, db: Session = Depends(get_history_db)):
    success = HistoryService.delete_record(db, history_id)
    if not success:
        raise HTTPException(status_code=404, detail="History record not found")
    
    return {"success": True, "message": "Prediction history deleted successfully."}

@router.put("/{history_id}/save", response_model=HistoryResponse)
def toggle_save_history_item(history_id: int, db: Session = Depends(get_history_db)):
    item = HistoryService.toggle_save_record(db, history_id)
    if not item:
        raise HTTPException(status_code=404, detail="History record not found")
    return item
