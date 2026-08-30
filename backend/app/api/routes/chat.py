from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import chat_service
import logging

router = APIRouter(
    prefix="/api/chat",
    tags=["chat"]
)

logger = logging.getLogger(__name__)

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        response = await chat_service.generate_chat_response(request)
        return response
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate chat response")
