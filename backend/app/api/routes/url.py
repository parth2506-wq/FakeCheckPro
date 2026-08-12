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
async def predict_url(request: UrlPredictionRequest, db: Session = Depends(get_history_db)):
    try:
        # 1. Fetch and extract article
        extracted_data = await ArticleExtractor.extract_from_url(str(request.url))
        
        # 2. Predict using common service
        prediction_result = PredictionService.predict(
            title=extracted_data["title"], 
            text=extracted_data["text"], 
            source_type="url"
        )
        
        # 3. Save to history
        history_record = HistoryCreate(
            source_type="url",
            title=extracted_data["title"],
            input_text=prediction_result["combined_text_used"],
            source_url=str(request.url),
            extracted_text=extracted_data["text"],
            prediction=prediction_result["prediction"],
            category=prediction_result["category"],
            confidence=prediction_result["confidence"],
            reason=prediction_result["reason"],
            important_phrases=prediction_result["important_phrases"]
        )
        saved_record = HistoryService.create_record(db, history_record)
        
        # 4. Return response
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
            history_id=saved_record.id,
            source_domain=extracted_data.get("source_domain")
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"URL Prediction failed: {str(e)}")
