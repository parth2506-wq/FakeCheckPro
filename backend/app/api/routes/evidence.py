from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.evidence import EvidenceRequest, EvidenceResponse, EvidenceResult
from app.services.evidence_service import EvidenceService
from app.database.history_db import get_history_db

router = APIRouter(prefix="/api/evidence", tags=["evidence"])

@router.post("/analyze", response_model=EvidenceResponse)
async def analyze_evidence(request: EvidenceRequest, db: Session = Depends(get_history_db)):
    try:
        evidence_data = await EvidenceService.analyze_and_store(db, request.history_id)
        return EvidenceResponse(
            success=True,
            evidence=evidence_data,
            error=None
        )
    except HTTPException:
        raise
    except Exception as e:
        return EvidenceResponse(
            success=False,
            evidence=None,
            error=str(e)
        )
