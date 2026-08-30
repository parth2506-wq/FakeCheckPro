# AI Chatbot Implementation Prompt

**Copy and paste everything below the line into your other AI agent/chat:**

---

You are an expert full-stack React and FastAPI developer. I want you to build an AI Chatbot feature for my React/FastAPI application. 

### Architecture & Strategy (Context-Passing RAG)
The application already has a core "Analyzer" that takes an article, calls a heavy Gemini model with Google Search Grounding, and outputs a strict JSON object called `EvidenceResult`. 
To save on API costs and rate limits, this new Chatbot will **NOT** search the web or re-analyze the article. Instead, we will pass the previously generated `EvidenceResult` JSON directly into the context window of a lightweight model (specifically `gemma-4-31b`). The chatbot will act as an interactive assistant that simply answers the user's questions based on the provided JSON data.

### 1. Backend Implementation Requirements (FastAPI)
- Create a new API route file (e.g., `app/api/routes/chat.py`).
- Create a Pydantic schema for the request containing:
  - `history`: A list of previous messages (role and content).
  - `message`: The user's new message string.
  - `evidence_context`: A dictionary containing the `EvidenceResult` JSON.
  - `model_choice`: A string to select the model (e.g., `gemma-4-31b`).
- Create a new service (e.g., `app/services/chat_service.py`) that initializes the `google-genai` client.
- The service should construct a system prompt for the lightweight model. The system prompt MUST include the `evidence_context` JSON and instruct the model to:
  - Act as a helpful assistant for a Fact-Checking Dashboard.
  - Answer the user's questions strictly based on the provided JSON data.
  - Refuse to invent new facts or search the web.
- Return the AI's response text securely.

### 2. Frontend Implementation Requirements (React + Tailwind)
- Create a reusable `Chatbot.jsx` component that can float on the right side of the dashboard or sit below the `CredibilityAssessmentCard`.
- The component must have its own state for `messages` (array of user/AI bubbles), `isLoading`, and `input`.
- The UI must match a premium, sleek aesthetic: glassmorphism, rounded corners, brand colors (Navy, Orange, Emerald, Slate). Use Lucide-React icons (like `Send`, `Bot`, `User`).
- When the user sends a message, append it to the chat UI, set a loading state, and make an Axios POST request to the new `/api/chat` endpoint.
- You must pass the existing `evidenceData` state from the parent `Analyze.jsx` into the API request as the `evidence_context`.
- Handle error states gracefully (e.g., if the user hasn't analyzed an article yet, show a placeholder saying "Analyze an article first to chat about it!").

Please generate the necessary Python backend code (FastAPI route + service) and the React frontend code (JSX component + CSS classes) to implement this. Ensure you use standard modern React hooks (useState, useRef) and handle auto-scrolling to the bottom of the chat when new messages arrive.
