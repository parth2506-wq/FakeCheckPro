from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.url import UrlPredictionRequest, UrlPredictionResponse
from app.services.article_extractor import ArticleExtractor
from app.services.prediction_service import PredictionService
from app.services.history_service import HistoryService
from app.schemas.history import HistoryCreate
from app.database.history_db import get_history_db

router = APIRouter(prefix="/api", tags=["ml", "url"])

@router.post("/predict/url", response_model=UrlPredictionResponse)
async def predict_url(request: UrlPredictionRequest):
    try:
        # 1. Fetch and extract article
        extracted_data = await ArticleExtractor.extract_from_url(str(request.url))
        
        # 2. Predict using common service
        prediction_result = PredictionService.predict(
            title=extracted_data["title"], 
            text=extracted_data["text"], 
            source_type="url"
        )
        
        # 3. Return response
        return UrlPredictionResponse(
            success=True,
            url=str(request.url),
            title=extracted_data["title"],
            extracted_text=extracted_data["text"][:1000] + "..." if len(extracted_data["text"]) > 1000 else extracted_data["text"],
            prediction=prediction_result["prediction"],
            category=prediction_result["category"],
            confidence=prediction_result["confidence"],
            confidence_percentage=prediction_result["confidence_percentage"],
            reason=prediction_result["reason"],
            important_phrases=prediction_result["important_phrases"],
            history_id=None,
            source_domain=extracted_data.get("source_domain")
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"URL Prediction failed: {str(e)}")
