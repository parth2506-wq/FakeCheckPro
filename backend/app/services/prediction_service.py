from typing import Dict, Any
from app.services.preprocessing import preprocess_text
from app.services.predictor import predictor
from app.services.explainability import explain_prediction

class PredictionService:
    @staticmethod
    def predict(title: str, text: str, source_type: str = "text") -> Dict[str, Any]:
        """
        Core ML Inference Pipeline.
        Shared across text, url, and image prediction endpoints.
        """
        # 1. Combine title + text
        combined_text = f"{title or ''} {text or ''}".strip()
        
        if not combined_text:
            raise ValueError("Input text is empty after combination.")
        
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
        
        # 7. Add disclaimer explicitly
        disclaimer = " This prediction reflects patterns learned from the WELFake training dataset and should not be treated as definitive factual verification."
        final_reason = reason + disclaimer

        return {
            "prediction": prediction,
            "category": category,
            "confidence": confidence,
            "confidence_percentage": round(confidence * 100, 2),
            "reason": final_reason,
            "important_phrases": important_phrases,
            "combined_text_used": combined_text
        }
