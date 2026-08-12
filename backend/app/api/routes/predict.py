from fastapi import APIRouter, HTTPException, status
from app.schemas.prediction import PredictionRequest, PredictionResponse, HealthResponse, ModelInfoResponse
from app.services.preprocessing import preprocess_text
from app.services.predictor import predictor
from app.services.explainability import explain_prediction

router = APIRouter(prefix="/api", tags=["ml"])

@router.post("/predict/text", response_model=PredictionResponse)
def predict_text(request: PredictionRequest):
    try:
        # 1. Combine title + text
        combined_text = f"{request.title} {request.text}".strip()
        
        # 2. Preprocess
        cleaned_text = preprocess_text(combined_text)
        
        # 3. Vectorize
        tfidf_vector = predictor.transform_text(cleaned_text)
        
        # 4. Predict
        prediction, confidence = predictor.predict(tfidf_vector)
        
        # 5. Category mapping (0 -> Fake, 1 -> Real)
        category = "Fake" if prediction == 0 else "Real"
        
        # 6. XAI / Explainability
        reason, important_phrases = explain_prediction(tfidf_vector, prediction)
        
        return PredictionResponse(
            success=True,
            prediction=prediction,
            category=category,
            confidence=confidence,
            confidence_percentage=round(confidence * 100, 2),
            reason=reason,
            important_phrases=important_phrases
        )
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
