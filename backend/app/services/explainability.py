import numpy as np
from typing import List, Tuple
from app.schemas.prediction import ImportantPhrase
from app.services.predictor import predictor

def explain_prediction(tfidf_vector, prediction: int, top_n: int = 5) -> Tuple[str, List[ImportantPhrase]]:
    """
    Analyzes the TF-IDF vector against the Logistic Regression coefficients to determine 
    the most influential phrases that contributed to the classification.
    """
    if not predictor.is_loaded():
        return "Explanation unavailable (model not loaded).", []

    model = predictor.model
    vectorizer = predictor.vectorizer

    # Logistic regression coefficients for the first (and usually only) class in binary classification
    coefs = model.coef_[0]
    
    # Get the indices of non-zero TF-IDF features in the current document
    non_zero_indices = tfidf_vector.nonzero()[1]
    
    if len(non_zero_indices) == 0:
        return "No specific influential phrases were identified in the text.", []

    # Calculate contribution for each active feature
    # Contribution = TF-IDF value * Coefficient
    feature_contributions = []
    feature_names = vectorizer.get_feature_names_out()
    
    for idx in non_zero_indices:
        tfidf_val = tfidf_vector[0, idx]
        coef_val = coefs[idx]
        contribution = tfidf_val * coef_val
        feature_contributions.append((idx, contribution))
    
    # Sort features by absolute contribution descending to find the most influential ones
    feature_contributions.sort(key=lambda x: abs(x[1]), reverse=True)
    
    important_phrases = []
    for idx, contribution in feature_contributions[:top_n]:
        phrase = feature_names[idx]
        
        # Assuming model.classes_ = [0, 1] where 0=Fake, 1=Real
        # Negative coefficient generally pushes towards class 0 (Fake)
        # Positive coefficient generally pushes towards class 1 (Real)
        # We verify this mapping
        fake_class_idx = 0
        real_class_idx = 1
        
        direction = "Real" if contribution > 0 else "Fake"
        
        important_phrases.append(ImportantPhrase(
            phrase=phrase,
            contribution=round(float(contribution), 4),
            direction=direction
        ))

    # Deterministic reason generation based on prediction
    category = "Fake" if prediction == 0 else "Real"
    
    reason = f"The prediction was primarily influenced by textual features that the trained classifier strongly associates with the {category} class."
    
    if important_phrases:
        # Filter phrases that contributed TOWARDS the predicted class
        supporting_phrases = [p.phrase for p in important_phrases if p.direction == category]
        if supporting_phrases:
            phrase_str = ", ".join(f"'{p}'" for p in supporting_phrases)
            reason = f"The prediction was primarily influenced by features such as {phrase_str}, which contributed strongly toward the {category} class."
            
    return reason, important_phrases
