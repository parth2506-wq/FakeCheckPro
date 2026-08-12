from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.schemas.image import ImageOcrResponse, ImagePredictionResponse
from app.services.ocr_service import OCRService
from app.services.prediction_service import PredictionService
from app.services.history_service import HistoryService
from app.schemas.history import HistoryCreate
from app.database.history_db import get_history_db

router = APIRouter(prefix="/api", tags=["ml", "image"])

@router.post("/ocr/image", response_model=ImageOcrResponse)
async def ocr_image(file: UploadFile = File(...)):
    try:
        extracted_text = await OCRService.extract_text(file)
        
        return ImageOcrResponse(
            success=True,
            filename=file.filename,
            extracted_text=extracted_text
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR failed: {str(e)}")

@router.post("/predict/image", response_model=ImagePredictionResponse)
async def predict_image(file: UploadFile = File(...), db: Session = Depends(get_history_db)):
    try:
        # 1. OCR Extract
        extracted_text = await OCRService.extract_text(file)
        
        # 2. Predict using common service
        prediction_result = PredictionService.predict(
            title="", 
            text=extracted_text, 
            source_type="image"
        )
        
        # 3. Save to history
        history_record = HistoryCreate(
            source_type="image",
            input_text=extracted_text,
            image_filename=file.filename,
            extracted_text=extracted_text,
            prediction=prediction_result["prediction"],
            category=prediction_result["category"],
            confidence=prediction_result["confidence"],
            reason=prediction_result["reason"],
            important_phrases=prediction_result["important_phrases"]
        )
        saved_record = HistoryService.create_record(db, history_record)
        
        # 4. Return response
        return ImagePredictionResponse(
            success=True,
            filename=file.filename,
            extracted_text=extracted_text,
            prediction=prediction_result["prediction"],
            category=prediction_result["category"],
            confidence=prediction_result["confidence"],
            confidence_percentage=prediction_result["confidence_percentage"],
            reason=prediction_result["reason"],
            important_phrases=prediction_result["important_phrases"],
            history_id=saved_record.id
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image Prediction failed: {str(e)}")
