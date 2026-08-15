import os
from google import genai
import logging

logging.basicConfig(level=logging.INFO)

# Test behavior
os.environ["GOOGLE_API_KEY"] = "fake_google_key"
os.environ["GEMINI_API_KEY"] = "fake_gemini_key"

try:
    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
    print("Client initialized successfully")
except Exception as e:
    print(f"Failed to initialize client: {e}")
