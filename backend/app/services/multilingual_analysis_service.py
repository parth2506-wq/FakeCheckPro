import logging
from langdetect import detect, detect_langs, LangDetectException
from deep_translator import GoogleTranslator
from app.services.prediction_service import PredictionService

logger = logging.getLogger(__name__)

class LanguageDetectionService:
    @staticmethod
    def detect(text: str) -> dict:
        if not text or not text.strip():
            return {"detected_language": "unknown", "confidence": 0.0}
        
        try:
            langs = detect_langs(text)
            if not langs:
                return {"detected_language": "unknown", "confidence": 0.0}
                
            best_match = langs[0]
            # Mapping langdetect codes if necessary. 
            # langdetect returns 'hi', 'mr', 'en' etc.
            lang_code = best_match.lang
            confidence = best_match.prob
            
            # Treat everything that is not hi, mr, en as unknown or just return it. 
            # We will handle hi and mr for translation, others will be passed as is.
            
            return {
                "detected_language": lang_code,
                "confidence": confidence
            }
        except LangDetectException:
            return {"detected_language": "unknown", "confidence": 0.0}
        except Exception as e:
            logger.error(f"Language detection failed: {str(e)}")
            return {"detected_language": "unknown", "confidence": 0.0}

class TranslationService:
    @staticmethod
    def translate(title: str, text: str, source_lang: str) -> dict:
        if source_lang not in ['hi', 'mr']:
            return {
                "translated_title": None,
                "translated_text": None,
                "status": "not_required"
            }
            
        # Limit the text to save tokens/bandwidth and keep ML inference performant
        text_to_translate = text[:3000]
        title_to_translate = title[:500]
        
        try:
            # FAST PATH: Try GoogleTranslator first
            from deep_translator import GoogleTranslator
            translator = GoogleTranslator(source='auto', target='en')
            
            translated_title = translator.translate(title_to_translate) if title_to_translate.strip() else ""
            translated_text = translator.translate(text_to_translate) if text_to_translate.strip() else ""
            
            if (title_to_translate.strip() and not translated_title) or (text_to_translate.strip() and not translated_text):
                raise Exception("deep-translator returned empty output (likely blocked).")
                
            return {
                "translated_title": translated_title,
                "translated_text": translated_text,
                "status": "completed"
            }
        except Exception as fast_error:
            logger.warning(f"GoogleTranslator fast path failed ({str(fast_error)}). Falling back to Gemini API.")
            
            # FALLBACK PATH: Gemini API
            try:
                import os
                from google import genai
                
                api_key = os.getenv("GEMINI_API_KEY")
                if not api_key:
                    raise Exception("GEMINI_API_KEY not found in environment variables.")
                    
                client = genai.Client(api_key=api_key)
                
                language_name = "Hindi" if source_lang == 'hi' else "Marathi"
                prompt = f"Translate the following {language_name} text to English. Preserve the exact markers '---TITLE---' and '---TEXT---'.\n\n---TITLE---\n{title_to_translate}\n---TEXT---\n{text_to_translate}"
                
                response = client.models.generate_content(
                    model='gemini-3.1-flash-lite',
                    contents=prompt
                )
                
                result = response.text.strip()
                
                # Parse the result
                translated_title = ""
                translated_text = result
                
                if "---TITLE---" in result and "---TEXT---" in result:
                    parts = result.split("---TEXT---")
                    translated_title = parts[0].replace("---TITLE---", "").strip()
                    translated_text = parts[1].strip()
                elif "---TITLE---" in result:
                    translated_title = result.replace("---TITLE---", "").strip()
                    translated_text = ""
                    
                return {
                    "translated_title": translated_title,
                    "translated_text": translated_text,
                    "status": "completed"
                }
            except Exception as e:
                logger.error(f"Gemini Fallback translation failed: {str(e)}")
                return {
                    "translated_text": None,
                    "translated_title": None,
                    "status": "failed",
                    "error": str(e)
                }

class MultilingualAnalysisService:
    @staticmethod
    def process_and_predict(title: str, text: str, source_type: str) -> dict:
        """
        Adapter that sits before PredictionService.
        It detects language, translates to English if necessary, 
        calls Chain 1 (PredictionService), and returns the combined result.
        """
        title = title or ""
        text = text or ""
        combined_original = f"{title} {text}".strip()
        
        # 1. Detect language
        lang_info = LanguageDetectionService.detect(combined_original)
        detected_language = lang_info["detected_language"]
        
        # 2. Translate if Hindi or Marathi
        english_title = title
        english_text = text
        translated_text_combined = None
        translation_status = "not_required"
        
        if detected_language in ['hi', 'mr']:
            t_res = TranslationService.translate(title, text, detected_language)
            if t_res["status"] == "completed":
                english_title = t_res["translated_title"]
                english_text = t_res["translated_text"]
                translation_status = "completed"
                translated_text_combined = f"{english_title} {english_text}".strip()
            else:
                translation_status = "failed"
            
        # 3. Call existing ML Prediction Service
        # Note: If translation failed, we do NOT send original Hindi/Marathi to ML.
        # But we still want to return a graceful failure for ML part, and let Chain 2 continue.
        # The prompt says: "If translation fails for Hindi/Marathi... return translation_status = failed... 
        # Chain 1: unavailable, Chain 2: may continue"
        
        prediction_result = {}
        if translation_status == "failed":
            prediction_result = {
                "prediction": -1,  # Indicate unavailable
                "category": "Unknown",
                "confidence": 0.0,
                "confidence_percentage": 0.0,
                "reason": "Chain 1 prediction unavailable due to translation failure.",
                "important_phrases": []
            }
        else:
            prediction_result = PredictionService.predict(english_title, english_text, source_type)
            
        # 4. Assemble final result
        prediction_result["original_text"] = combined_original
        prediction_result["detected_language"] = detected_language
        prediction_result["translated_text"] = translated_text_combined
        prediction_result["translation_status"] = translation_status
        
        return prediction_result
