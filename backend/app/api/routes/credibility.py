from fastapi import APIRouter, HTTPException
from app.schemas.credibility import CredibilityAnalyzeRequest, CredibilityAnalyzeResponse
from app.services.multilingual_analysis_service import MultilingualAnalysisService
from app.services.gemini_evidence_service import gemini_evidence_service
from app.services.credibility_decision_engine import CredibilityDecisionEngine

router = APIRouter(prefix="/api/credibility", tags=["credibility"])

@router.post("/analyze", response_model=CredibilityAnalyzeResponse)
async def analyze_credibility(request: CredibilityAnalyzeRequest):
    try:
        # CHAIN 1: Multilingual Analysis + ML Classification
        try:
            ml_result = MultilingualAnalysisService.process_and_predict(
                title=request.title, 
                text=request.text, 
                source_type="text"
            )
        except Exception as e:
            # If Chain 1 fails, we cannot proceed with credibility risk formula since it depends on ml_fake_risk.
            # Depending on architecture we could return UNVERIFIED, but standard approach is to bubble error.
            raise HTTPException(status_code=500, detail=f"Chain 1 Prediction failed: {str(e)}")

        ml_prediction = "REAL" if ml_result["prediction"] == 1 else "FAKE"
        ml_confidence = ml_result["confidence_percentage"]

        # Prepare text for Chain 2
        # Use translated_text if available, otherwise original text
        text_for_evidence = request.text
        if request.title:
            text_for_evidence = f"{request.title}\n{request.text}"
            
        # Truncate to max 3000 chars (~500 words) to speed up Gemini and keep it focused on core claims
        text_for_evidence = text_for_evidence[:4000]

        translated_text = ml_result.get("translated_text")
        detected_language = ml_result.get("detected_language")

        # CHAIN 2: Gemini Evidence Verification
        try:
            evidence_result = await gemini_evidence_service.verify_evidence(
                article_text=text_for_evidence,
                translated_text=translated_text,
                detected_language=detected_language,
                ml_result={
                    "prediction": ml_prediction,
                    "confidence": ml_confidence,
                    "category": ml_result["category"]
                },
                user_output_language=request.user_output_language
            )
            
            # Extract fields for Decision Engine
            evidence_score = float(evidence_result.evidence_score)
            evidence_direction = evidence_result.evidence_direction
            evidence_quality = evidence_result.evidence_quality
            source_reliability_score = evidence_result.source_reliability_score
        except Exception as e:
            # Chain 2 Failure Fallback
            evidence_result = None
            evidence_score = None
            evidence_direction = "INSUFFICIENT"
            evidence_quality = "LOW"
            source_reliability_score = 0.0

        # DECISION ENGINE: Compute Final Credibility
        engine_result = CredibilityDecisionEngine.evaluate(
            ml_prediction=ml_prediction,
            ml_confidence=ml_confidence,
            evidence_score=evidence_score,
            evidence_direction=evidence_direction,
            evidence_quality=evidence_quality,
            source_reliability_score=source_reliability_score
        )

        return CredibilityAnalyzeResponse(
            **engine_result,
            raw_ml_result=ml_result,
            raw_evidence_result=evidence_result
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Credibility Analysis failed: {str(e)}")
