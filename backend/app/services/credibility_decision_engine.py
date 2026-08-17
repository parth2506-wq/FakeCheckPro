import logging

logger = logging.getLogger(__name__)

class CredibilityDecisionEngine:
    ML_WEIGHT = 0.40
    EVIDENCE_WEIGHT = 0.60
    STRONG_EVIDENCE_SCORE = 85
    HIGH_SOURCE_RELIABILITY = 80
    
    EVIDENCE_QUALITY_WEIGHTS = {
        "HIGH": 1.00,
        "MEDIUM": 0.75,
        "LOW": 0.50
    }
    
    RISK_BANDS = {
        "VERY_LOW_RISK": (0, 15),
        "LOW_RISK": (16, 30),
        "MODERATE_RISK": (31, 49),
        "HIGH_RISK": (50, 69),
        "VERY_HIGH_RISK": (70, 84),
        "EXTREME_RISK": (85, 100)
    }

    @staticmethod
    def clamp(value: float, min_val: float = 0.0, max_val: float = 100.0) -> float:
        return max(min_val, min(value, max_val))

    @staticmethod
    def get_risk_level(score: float) -> str:
        for level, (low, high) in CredibilityDecisionEngine.RISK_BANDS.items():
            if low <= round(score) <= high:
                return level
        if score > 100:
            return "EXTREME_RISK"
        return "VERY_LOW_RISK"

    @staticmethod
    def get_signal_relationship(ml_prediction: str, evidence_direction: str) -> str:
        if evidence_direction == "INSUFFICIENT" or evidence_direction == "UNAVAILABLE":
            return "INSUFFICIENT_EVIDENCE"
        if evidence_direction == "MIXED":
            return "CONFLICT"
        
        if ml_prediction == "FAKE":
            if evidence_direction == "CONTRADICTING":
                return "AGREE_FAKE"
            elif evidence_direction == "SUPPORTING":
                return "CONFLICT"
        elif ml_prediction == "REAL":
            if evidence_direction == "SUPPORTING":
                return "AGREE_REAL"
            elif evidence_direction == "CONTRADICTING":
                return "CONFLICT"
        
        return "INSUFFICIENT_EVIDENCE"

    @classmethod
    def evaluate(
        cls, 
        ml_prediction: str, 
        ml_confidence: float, 
        evidence_score: float = None, 
        evidence_direction: str = None, 
        evidence_quality: str = None, 
        source_reliability_score: float = None
    ) -> dict:
        
        # Clamp inputs
        ml_confidence = cls.clamp(ml_confidence)
        if evidence_score is not None:
            evidence_score = cls.clamp(evidence_score)
        if source_reliability_score is not None:
            source_reliability_score = cls.clamp(source_reliability_score)
            
        if evidence_direction not in ["SUPPORTING", "CONTRADICTING", "MIXED", "INSUFFICIENT"]:
            evidence_direction = "INSUFFICIENT"
            
        if evidence_quality not in ["HIGH", "MEDIUM", "LOW"]:
            evidence_quality = "LOW"

        # 1. Normalize ML into Fake Risk
        ml_fake_risk = ml_confidence if ml_prediction == "FAKE" else (100.0 - ml_confidence)
        
        # Base case handling when evidence is entirely missing or Gemini fails
        if evidence_score is None or evidence_direction == "INSUFFICIENT":
            # Instruction 15: VERY HIGH ML + VERY LOW EVIDENCE -> UNVERIFIED
            return {
                "ml_fake_risk": ml_fake_risk,
                "evidence_fake_risk": None,
                "final_credibility_risk_score": ml_fake_risk,
                "risk_level": cls.get_risk_level(ml_fake_risk),
                "signal_relationship": "INSUFFICIENT_EVIDENCE",
                "final_assessment": "UNVERIFIED",
                "decision_type": "INSUFFICIENT_EVIDENCE",
                "decision_reason": "High ML risk was detected, but external evidence is insufficient to independently establish falsity." if (ml_prediction == "FAKE" and ml_confidence > 90) else "ML model indicates a risk level, but available external evidence is insufficient to independently establish falsity.",
                "explanation": "No reliable evidence was found to corroborate or contradict the claims.",
                "calculation": {
                    "ml_weight": 1.0,
                    "evidence_weight": 0.0,
                    "weighted_base_score": ml_fake_risk
                }
            }

        # 2. Normalize Evidence into Risk
        quality_weight = cls.EVIDENCE_QUALITY_WEIGHTS.get(evidence_quality, 0.50)
        reliability_factor = source_reliability_score / 100.0
        effective_evidence_strength = evidence_score * quality_weight * reliability_factor

        evidence_fake_risk = None
        evidence_fake_risk_adjusted = None
        
        if evidence_direction == "CONTRADICTING":
            evidence_fake_risk = evidence_score
            evidence_fake_risk_adjusted = effective_evidence_strength
        elif evidence_direction == "SUPPORTING":
            evidence_fake_risk = 100.0 - evidence_score
            evidence_fake_risk_adjusted = 100.0 - effective_evidence_strength
        elif evidence_direction == "MIXED":
            evidence_fake_risk = 50.0 # Neutral placeholder
            evidence_fake_risk_adjusted = 50.0

        # Calculate relationship
        signal_relationship = cls.get_signal_relationship(ml_prediction, evidence_direction)

        # 3. Base Combination Formula
        weighted_base_score = (cls.ML_WEIGHT * ml_fake_risk) + (cls.EVIDENCE_WEIGHT * evidence_fake_risk_adjusted)
        final_risk = cls.clamp(weighted_base_score)

        assessment = "UNVERIFIED"
        decision_type = "NORMAL_WEIGHTED_COMBINATION"
        decision_reason = "Final assessment derived from weighted combination of ML and external evidence."

        # Overrides logic
        is_strong_evidence = (
            evidence_score >= cls.STRONG_EVIDENCE_SCORE and 
            evidence_quality == "HIGH" and 
            source_reliability_score >= cls.HIGH_SOURCE_RELIABILITY
        )

        if evidence_direction == "CONTRADICTING" and is_strong_evidence:
            decision_type = "STRONG_EVIDENCE_OVERRIDE"
            assessment = "CONTRADICTED"
            decision_reason = "Strong external evidence directly contradicts the claims, overriding other signals."
            if ml_prediction == "FAKE" and final_risk < 85:
                final_risk = 85.0
            elif ml_prediction == "REAL":
                decision_reason = "Strong external evidence overrides ML classification."
                if final_risk < 70:
                    final_risk = 70.0 
                
        elif evidence_direction == "SUPPORTING" and is_strong_evidence:
            decision_type = "STRONG_EVIDENCE_OVERRIDE"
            if ml_prediction == "FAKE":
                assessment = "LIKELY_CREDIBLE"
                decision_reason = "Strong external evidence supports the central claims despite high ML risk."
                if final_risk > 49:
                    final_risk = 49.0
            else:
                assessment = "SUPPORTED"
                decision_reason = "Strong external evidence corroborates the claims."
                if final_risk > 30:
                    final_risk = 30.0

        elif evidence_quality == "LOW" and not is_strong_evidence:
            decision_type = "WEAK_EVIDENCE_RULE"
            assessment = "UNVERIFIED"
            if ml_prediction == "FAKE" and ml_confidence > 90:
                decision_reason = "ML classification indicates high risk, while available external evidence is weak and insufficient for a definitive contradiction."
                final_risk = ml_fake_risk
                assessment = "LIKELY_MISLEADING" # As per 16. HIGH ML + WEAK CONTRADICTING EVIDENCE
            else:
                decision_reason = "External evidence is weak and insufficient for a definitive conclusion."

        elif evidence_direction == "MIXED":
            decision_type = "MIXED_EVIDENCE_RULE"
            if ml_prediction == "FAKE" and ml_confidence > 70:
                assessment = "LIKELY_MISLEADING"
                decision_reason = "External evidence is mixed, but the ML classifier identifies strong linguistic risk."
            else:
                assessment = "UNVERIFIED"
                decision_reason = "External evidence contains meaningful support and contradiction. Manual review recommended."

        else:
            # Normal evaluation
            if signal_relationship == "CONFLICT":
                decision_type = "CONFLICTING_SIGNALS"
                if ml_prediction == "FAKE" and evidence_direction == "SUPPORTING":
                    assessment = "LIKELY_MISLEADING" if final_risk >= 50 else "UNVERIFIED"
                    decision_reason = "External evidence provides meaningful support, but the ML classifier identifies strong linguistic risk."
                elif ml_prediction == "REAL" and evidence_direction == "CONTRADICTING":
                    assessment = "LIKELY_MISLEADING" if final_risk >= 50 else "UNVERIFIED"
                    decision_reason = "External evidence contradicts the claim, but the ML classifier suggests low risk."
            else:
                # Agreement
                if final_risk >= 70:
                    assessment = "CONTRADICTED" if evidence_direction == "CONTRADICTING" and evidence_score >= 70 else "LIKELY_MISLEADING"
                elif final_risk >= 50:
                    assessment = "LIKELY_MISLEADING"
                elif final_risk >= 31:
                    assessment = "UNVERIFIED"
                else:
                    assessment = "SUPPORTED" if evidence_direction == "SUPPORTING" else "LIKELY_CREDIBLE"
                decision_reason = "Signals are aligned and weighted calculation determines the final assessment."

        return {
            "ml_prediction": ml_prediction,
            "ml_confidence": ml_confidence,
            "ml_fake_risk": round(ml_fake_risk, 2),
            "evidence_score": round(evidence_score, 2),
            "evidence_direction": evidence_direction,
            "evidence_quality": evidence_quality,
            "source_reliability_score": round(source_reliability_score, 2),
            "evidence_fake_risk": round(evidence_fake_risk, 2) if evidence_fake_risk is not None else None,
            "final_credibility_risk_score": round(final_risk, 2),
            "risk_level": cls.get_risk_level(final_risk),
            "signal_relationship": signal_relationship,
            "final_assessment": assessment,
            "decision_type": decision_type,
            "decision_reason": decision_reason,
            "explanation": "The Final Credibility Risk Score is an AI-assisted composite risk indicator derived from content-based ML classification and external evidence assessment. It is not a statistical probability of factual falsity or truth.",
            "calculation": {
                "ml_weight": cls.ML_WEIGHT,
                "evidence_weight": cls.EVIDENCE_WEIGHT,
                "weighted_base_score": round(weighted_base_score, 2)
            }
        }
