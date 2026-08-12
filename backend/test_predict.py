import requests
import json
import time

BASE_URL = "http://localhost:8000/api"

def run_tests():
    print("Running API tests...")
    
    # 1. Health check
    res = requests.get(f"{BASE_URL}/health")
    print("\n--- Health Check ---")
    print(res.status_code, res.json())
    assert res.status_code == 200

    # 2. Model info
    res = requests.get(f"{BASE_URL}/model/info")
    print("\n--- Model Info ---")
    print(res.status_code, res.json())
    assert res.status_code == 200

    # 3. Predict text (Title + Article)
    payload1 = {
        "title": "Breaking: Aliens land on Mars!",
        "text": "Scientists were shocked today as a UFO was spotted landing near the rover. This shocking breaking news changes everything."
    }
    res = requests.post(f"{BASE_URL}/predict/text", json=payload1)
    print("\n--- Prediction (Fake/Real) ---")
    print(res.status_code, json.dumps(res.json(), indent=2))
    assert res.status_code == 200
    
    # 4. Predict empty input
    payload2 = {
        "title": "",
        "text": "   "
    }
    res = requests.post(f"{BASE_URL}/predict/text", json=payload2)
    print("\n--- Prediction (Empty Input) ---")
    print(res.status_code, res.json())
    assert res.status_code == 422 # Pydantic validation error

    print("\nAll tests finished successfully.")

if __name__ == "__main__":
    run_tests()
