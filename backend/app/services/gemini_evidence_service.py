import os
import json
import logging
from datetime import datetime
from google import genai
from google.genai import types
from app.schemas.evidence import EvidenceResult

logger = logging.getLogger(__name__)

class GeminiEvidenceService:
    def __init__(self):
        # Workaround for google-genai issue where it prioritizes GOOGLE_API_KEY over the explicitly passed key or GEMINI_API_KEY
        if "GOOGLE_API_KEY" in os.environ:
            del os.environ["GOOGLE_API_KEY"]
            
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            logger.warning("GEMINI_API_KEY not found in environment variables.")
        else:
            self.client = genai.Client(api_key=self.api_key)

    async def verify_evidence(self, article_text: str) -> EvidenceResult:
        if not self.api_key:
            return self._build_error_fallback("Gemini API key is not configured.")

        # Prepare the system instruction
        system_instruction = """
        You are an evidence-aware news verification analyst. Your job is not to blindly classify an article as true or false.
        Your job is to extract verifiable factual claims, search the current web for reliable evidence using the Google Search tool, 
        evaluate whether that evidence supports or contradicts each claim, assess source reliability, aggregate the evidence, 
        and produce a transparent Evidence Score.

        CRITICAL RULES:
        1. ABSENCE OF EVIDENCE IS NOT EVIDENCE OF FALSITY. If a news article is new, exclusive, investigative, or insufficiently 
           covered by other sources, do NOT mark it Contradicted or Fake simply because Google Search did not find corroboration. 
           Use "UNVERIFIED" / INSUFFICIENT EVIDENCE when appropriate.
        2. NEVER use "FAKE" as the evidence engine's final assessment.
        3. Do not invent a website's reputation or fabricate URLs/citations.

        TRUSTED SOURCE PRIORITY:
        Tier 1: Government websites, official ministries, PIB, Election Commission, RBI, Supreme Court, official research institutions.
        Tier 2: Established national/international news organizations and broadcasters.
        Tier 3: Reputable independent fact-checking organizations.
        Tier 4: Blogs, aggregators, unknown websites, social media posts, user-generated content.

        FINAL VERIFICATION ASSESSMENT MUST BE ONE OF:
        - SUPPORTED: Reliable evidence substantially supports the important claims.
        - LIKELY_CREDIBLE: Evidence is generally supportive and no significant contradiction is found.
        - UNVERIFIED: Insufficient reliable evidence exists to establish truth or falsity.
        - LIKELY_MISLEADING: Important claims have substantial credibility problems or meaningful contradictory evidence.
        - CONTRADICTED: One or more central claims are directly contradicted by strong, authoritative evidence.

        EVIDENCE SCORE (0-100):
        90–100: Very Strong Evidence
        75–89: Strong Evidence
        60–74: Moderate Evidence
        40–59: Weak / Mixed Evidence
        20–39: Very Weak Evidence
        0–19: Little or No Reliable Evidence
        """

        prompt = f"""
        Analyze the following article for verifiable claims and find evidence using Google Search to determine the credibility of the claims.
        Article Text:
        ---
        {article_text}
        ---
        """

        try:
            # We use the official GenAI SDK (google-genai).
            # The gemini-3.6-flash model is requested.
            # We will ask for JSON structured output matching the EvidenceResult schema.
            response = self.client.models.generate_content(
                model='gemini-3.6-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    # tools=[{"google_search": {}}], # Temporarily disabled to test quota
                    response_mime_type="application/json",
                    response_schema=EvidenceResult,
                    temperature=0.2
                )
            )

            result_json = response.text
            result_data = json.loads(result_json)
            result_data["verification_timestamp"] = datetime.utcnow().isoformat() + "Z"
            
            return EvidenceResult(**result_data)

        except Exception as e:
            logger.error(f"Gemini API call failed: {str(e)}")
            return self._build_error_fallback(f"Gemini API analysis failed: {str(e)}")

    def _build_error_fallback(self, reason: str) -> EvidenceResult:
        return EvidenceResult(
            verification_status="UNVERIFIED",
            evidence_score=0,
            summary="Verification could not be completed due to a system error.",
            claims=[],
            source_summary={"high_reliability_sources": 0, "medium_reliability_sources": 0, "low_reliability_sources": 0},
            evidence_summary={"supporting": 0, "contradicting": 0, "neutral": 0},
            reasoning=["System encountered an error.", reason],
            limitations=["Technical failure prevented evidence search."],
            verification_timestamp=datetime.utcnow().isoformat() + "Z",
            disclaimer="This is an AI-assisted evidence assessment and does not constitute definitive proof of factual truth."
        )

gemini_evidence_service = GeminiEvidenceService()
