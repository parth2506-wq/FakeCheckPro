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
    def translate(text: str, source_lang: str) -> dict:
        if source_lang not in ['hi', 'mr']:
            return {
                "translated_text": None,
                "status": "not_required"
            }
            
        try:
            # We use deep-translator to translate to English
            translator = GoogleTranslator(source=source_lang, target='en')
            
            # deep-translator uses GET requests which fail on very long URLs when text is URL-encoded.
            # Hindi/Marathi texts take up many bytes per char, causing failures > 1500 chars.
            # To avoid API blocks and keep Chain 1 performant, we safely chunk to 1000 chars,
            # and only translate the first 3 chunks (first 3000 chars is sufficient for ML).
            chunk_size = 1000
            max_chunks = 3
            
            text_to_translate = text[:(chunk_size * max_chunks)]
            chunks = [text_to_translate[i:i+chunk_size] for i in range(0, len(text_to_translate), chunk_size)]
            
            translated_chunks = []
            for chunk in chunks:
                if chunk.strip():
                    translated_chunks.append(translator.translate(chunk))
            
            translated_text = " ".join(translated_chunks)
                
            return {
                "translated_text": translated_text,
                "status": "completed"
            }
        except Exception as e:
            logger.error(f"Translation failed: {str(e)}")
            return {
                "translated_text": None,
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
            # We translate title and text separately if they exist
            if title.strip():
                t_title = TranslationService.translate(title, detected_language)
                if t_title["status"] == "completed":
                    english_title = t_title["translated_text"]
                    translation_status = "completed"
                else:
                    translation_status = "failed"
            
            if text.strip():
                t_text = TranslationService.translate(text, detected_language)
                if t_text["status"] == "completed":
                    english_text = t_text["translated_text"]
                    translation_status = "completed"
                else:
                    translation_status = "failed"
            
            if translation_status == "completed":
                translated_text_combined = f"{english_title} {english_text}".strip()
            
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
