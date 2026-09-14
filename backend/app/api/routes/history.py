from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from typing import Optional
from app.schemas.history import HistoryPaginatedResponse, HistoryResponse, CombinedSaveRequest
from app.services.history_service import HistoryService
from app.database.history_db import get_history_db

import asyncio
import os
import json
import logging
from google import genai
from google.genai import types

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/history", tags=["history"])

trending_cache = None
trending_lock = asyncio.Lock()

@router.get("/trending")
async def get_trending_data():
    global trending_cache
    if trending_cache:
        return trending_cache

    async with trending_lock:
        if trending_cache:
            return trending_cache
            
        logger.info("Using hardcoded fallback for trending topics (Gemini API disabled temporarily)...")
        
        # --- GEMINI API CALL DISABLED ---
        # try:
        #     api_key = os.getenv("GEMINI_API_KEY")
        #     if "GOOGLE_API_KEY" in os.environ:
        #         api_key = os.getenv("GOOGLE_API_KEY", api_key)
        #         
        #     if api_key:
        #         client = genai.Client(api_key=api_key)
        #         ...
        # --- END DISABLED ---
        
        trending_cache = {
            "trending_topics": [
                {"title": "Unverified Claim", "count": 9, "subtitle": "cis Just Backed Trump, Released SPREAD THIS BREAKING: Pope Franc Incredible Statement..."},
                {"title": "Miracle Cure", "count": 8, "subtitle": "BREAKING!!! SHOCKING new discovery - drinking hot lemon water at 4 AM cures ALL..."},
                {"title": "Health Misinformation", "count": 6, "subtitle": "BREAKING!!! SHOCKING new discovery - drinking hot lemon water at 4 AM cures ALL..."},
                {"title": "Big Pharma Conspiracy", "count": 6, "subtitle": "BREAKING!!! SHOCKING miracle cure discovered!"},
                {"title": "Hoax", "count": 5, "subtitle": "Breaking: scientists claim the moon is made of..."},
                {"title": "Nasa", "count": 4, "subtitle": "NASA has confirmed that aliens have landed in..."}
            ],
            "trending_keywords": [
                {"keyword": "commonwealth games 2026", "count": "2"},
                {"keyword": "fake news", "count": "2"},
                {"keyword": "unverified claim", "count": "2"},
                {"keyword": "the hindu", "count": "1"},
                {"keyword": "india news", "count": "1"},
                {"keyword": "kerala floods", "count": "1"}
            ]
        }
        return trending_cache

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

@router.get("/dashboard_stats")
def get_dashboard_stats(db: Session = Depends(get_history_db)):
    try:
        from app.database.history_models import PredictionHistory
        
        total_checks = db.query(PredictionHistory).count()
        saved_reports = db.query(PredictionHistory).filter(PredictionHistory.saved == True).count()
        
        real_count = db.query(PredictionHistory).filter(PredictionHistory.confidence >= 0.6).count()
        fake_count = db.query(PredictionHistory).filter(PredictionHistory.confidence <= 0.4).count()
        partial_count = db.query(PredictionHistory).filter(PredictionHistory.confidence > 0.4, PredictionHistory.confidence < 0.6).count()
        
        # Last 14 days activity
        fourteen_days_ago = datetime.utcnow() - timedelta(days=14)
        
        # For SQLite we can just extract date as string if it is stored as iso format
        # Or using func.date() which works in SQLite
        activity = db.query(
            func.date(PredictionHistory.created_at).label('d'),
            func.count(PredictionHistory.id)
        ).filter(
            PredictionHistory.created_at >= fourteen_days_ago
        ).group_by(func.date(PredictionHistory.created_at)).all()
        
        activity_map = {row[0]: row[1] for row in activity if row[0]}
        
        # Generate last 14 days dates to ensure all days are represented
        activity_data = []
        for i in range(13, -1, -1):
            date_str = (datetime.utcnow() - timedelta(days=i)).strftime('%Y-%m-%d')
            activity_data.append({
                "date": date_str,
                "count": activity_map.get(date_str, 0)
            })
            
        avg_credibility_val = db.query(func.avg(PredictionHistory.confidence)).scalar() or 0
        avg_credibility = int(avg_credibility_val * 100)
        
        # Distribution
        dist_0_20 = db.query(PredictionHistory).filter(PredictionHistory.confidence <= 0.2).count()
        dist_21_40 = db.query(PredictionHistory).filter(PredictionHistory.confidence > 0.2, PredictionHistory.confidence <= 0.4).count()
        dist_41_60 = db.query(PredictionHistory).filter(PredictionHistory.confidence > 0.4, PredictionHistory.confidence <= 0.6).count()
        dist_61_80 = db.query(PredictionHistory).filter(PredictionHistory.confidence > 0.6, PredictionHistory.confidence <= 0.8).count()
        dist_81_100 = db.query(PredictionHistory).filter(PredictionHistory.confidence > 0.8).count()
        
        distribution = [
            {"name": "0-20", "count": dist_0_20},
            {"name": "21-40", "count": dist_21_40},
            {"name": "41-60", "count": dist_41_60},
            {"name": "61-80", "count": dist_61_80},
            {"name": "81-100", "count": dist_81_100},
        ]
        
        langs = db.query(
            PredictionHistory.detected_language, 
            func.count(PredictionHistory.id)
        ).group_by(PredictionHistory.detected_language).all()
        
        languages = [{"name": (l[0] or "Unknown").upper(), "count": l[1]} for l in langs]
        
        return {
            "total_checks": total_checks,
            "real": real_count,
            "partial": partial_count,
            "fake": fake_count,
            "saved_reports": saved_reports,
            "activity": activity_data,
            "avg_credibility": avg_credibility,
            "distribution": distribution,
            "languages": languages
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
