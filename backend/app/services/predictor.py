import os
import pickle
import logging
from typing import Optional, Tuple, Any
from fastapi import HTTPException

logger = logging.getLogger(__name__)

class MLPredictor:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        
        # Path to models directory, assuming it's at project root (2 levels up from app)
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
        self.model_dir = os.path.join(base_dir, 'models')
        self.model_path = os.path.join(self.model_dir, 'logistic_regression.pkl')
        self.vectorizer_path = os.path.join(self.model_dir, 'vectorizer.pkl')

    def load_artifacts(self) -> None:
        """
        Loads the saved TF-IDF vectorizer and Logistic Regression model into memory.
        """
        logger.info(f"Loading ML artifacts from {self.model_dir}")
        try:
            if not os.path.exists(self.model_path):
                raise FileNotFoundError(f"Model file not found at {self.model_path}")
            if not os.path.exists(self.vectorizer_path):
                raise FileNotFoundError(f"Vectorizer file not found at {self.vectorizer_path}")

            with open(self.model_path, 'rb') as f:
                self.model = pickle.load(f)
            
            with open(self.vectorizer_path, 'rb') as f:
                self.vectorizer = pickle.load(f)
            
            logger.info("ML artifacts loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load ML artifacts: {str(e)}")
            raise RuntimeError(f"Failed to load ML artifacts: {str(e)}")

    def is_loaded(self) -> bool:
        return self.model is not None and self.vectorizer is not None

    def transform_text(self, preprocessed_text: str) -> Any:
        if not self.is_loaded():
            raise HTTPException(status_code=503, detail="ML Model not loaded.")
        try:
            return self.vectorizer.transform([preprocessed_text])
        except Exception as e:
            logger.error(f"Vectorization failed: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to vectorize input text.")

    def predict(self, tfidf_vector: Any) -> Tuple[int, float]:
        if not self.is_loaded():
            raise HTTPException(status_code=503, detail="ML Model not loaded.")
        try:
            prediction = self.model.predict(tfidf_vector)[0]
            probabilities = self.model.predict_proba(tfidf_vector)[0]
            
            # Assuming classes are [0, 1] where 0=Fake, 1=Real. 
            # We will use the model's classes_ attribute to find the correct probability index.
            class_idx = list(self.model.classes_).index(prediction)
            confidence = float(probabilities[class_idx])
            
            return int(prediction), confidence
        except Exception as e:
            logger.error(f"Prediction failed: {str(e)}")
            raise HTTPException(status_code=500, detail="Model prediction failed.")

predictor = MLPredictor()
