from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.schemas.prediction import PredictionRequest, PredictionResponse, HealthResponse, ModelInfoResponse
from app.services.predictor import predictor
from app.services.prediction_service import PredictionService
from app.services.history_service import HistoryService
from app.schemas.history import HistoryCreate
from app.database.history_db import get_history_db

router = APIRouter(prefix="/api", tags=["ml"])

@router.post("/predict/text", response_model=PredictionResponse)
def predict_text(request: PredictionRequest):
    try:
        # 1. Predict using Multilingual Service (which wraps common PredictionService)
        from app.services.multilingual_analysis_service import MultilingualAnalysisService
        prediction_result = MultilingualAnalysisService.process_and_predict(
            title=request.title, 
            text=request.text, 
            source_type="text"
        )
        
        return PredictionResponse(
            success=True,
            prediction=prediction_result["prediction"],
            category=prediction_result["category"],
            confidence=prediction_result["confidence"],
            confidence_percentage=prediction_result["confidence_percentage"],
            reason=prediction_result["reason"],
            important_phrases=prediction_result["important_phrases"],
            history_id=None,
            original_text=prediction_result.get("original_text"),
            translated_text=prediction_result.get("translated_text"),
            detected_language=prediction_result.get("detected_language"),
            translation_status=prediction_result.get("translation_status")
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@router.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="ok",
        model="Logistic Regression",
        vectorizer_loaded=predictor.vectorizer is not None,
        model_loaded=predictor.model is not None
    )

@router.get("/model/info", response_model=ModelInfoResponse)
def model_info():
    if not predictor.is_loaded():
        raise HTTPException(status_code=503, detail="Model not loaded yet.")
    
    vec = predictor.vectorizer
    return ModelInfoResponse(
        model="Logistic Regression",
        feature_type="TF-IDF",
        max_features=vec.max_features if hasattr(vec, 'max_features') else 60000,
        ngram_range=list(vec.ngram_range) if hasattr(vec, 'ngram_range') else [1, 2],
        classes={"0": "Fake", "1": "Real"}
    )
