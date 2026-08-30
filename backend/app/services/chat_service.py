import os
import json
import logging
from google import genai
from google.genai import types
from app.schemas.chat import ChatRequest, ChatResponse

logger = logging.getLogger(__name__)

class ChatService:
    def __init__(self):
        if "GOOGLE_API_KEY" in os.environ:
            del os.environ["GOOGLE_API_KEY"]
            
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            logger.warning("GEMINI_API_KEY not found in environment variables.")
        else:
            self.client = genai.Client(api_key=self.api_key)

    async def generate_chat_response(self, request: ChatRequest) -> ChatResponse:
        if not self.api_key:
            return ChatResponse(response="Error: Gemini API key is not configured.")

        # Construct the system instruction
        system_instruction = f"""
        You are a helpful assistant for a Fact-Checking Dashboard.
        You are provided with a JSON context resulting from a recent credibility analysis of an article.
        
        Rules for answering:
        1. For questions specifically about the article, its claims, or the evidence, you MUST answer STRICTLY based on the provided JSON data. Do not invent facts or search the web.
        2. For general conversational questions (e.g., greetings) or general knowledge questions (e.g., about fact-checking, critical thinking, or your capabilities), you may answer naturally and helpfully.
        3. Do not confuse general knowledge with the specific facts of the analyzed article.
        
        Evidence Context (JSON):
        {json.dumps(request.evidence_context, indent=2)}
        """

        try:
            # Construct the conversation history
            contents = []
            for msg in request.history:
                role = "user" if msg.role == "user" else "model"
                contents.append(
                    types.Content(role=role, parts=[types.Part.from_text(text=msg.content)])
                )
            
            # Append the current user message
            contents.append(
                types.Content(role="user", parts=[types.Part.from_text(text=request.message)])
            )

            response = self.client.models.generate_content(
                model=request.model_choice,
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.3
                )
            )
            
            return ChatResponse(response=response.text.strip())

        except Exception as e:
            logger.error(f"Chat generation failed: {str(e)}")
            return ChatResponse(response=f"Sorry, I encountered an error: {str(e)}")

chat_service = ChatService()
