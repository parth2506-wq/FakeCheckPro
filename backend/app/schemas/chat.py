from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class ChatMessage(BaseModel):
    role: str = Field(..., description="Role of the sender, typically 'user' or 'model'")
    content: str = Field(..., description="The message content")

class ChatRequest(BaseModel):
    history: List[ChatMessage] = Field(default_factory=list, description="Conversation history")
    message: str = Field(..., description="The user's new message")
    evidence_context: Dict[str, Any] = Field(..., description="The previously generated EvidenceResult JSON to use as context")
    model_choice: str = Field(default="gemma-4-31b-it", description="The lightweight model to use for chat")

class ChatResponse(BaseModel):
    response: str = Field(..., description="The AI's response text")
