import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.live_news_service import reset_cache_for_testing
import httpx

client = TestClient(app)

@pytest.fixture(autouse=True)
def run_before_and_after_tests():
    reset_cache_for_testing()
    yield
    reset_cache_for_testing()

class MockResponse:
    def __init__(self, json_data, status_code):
        self.json_data = json_data
        self.status_code = status_code

    def json(self):
        return self.json_data

    def raise_for_status(self):
        if self.status_code != 200:
            raise httpx.HTTPStatusError("Error", request=None, response=self)

mock_articles = {
    "articles": [
        {
            "title": "Mock Politics News",
            "url": "http://mock.politics",
            "description": "description",
            "content": "content",
            "image": "image.jpg",
            "publishedAt": "2023-01-01T00:00:00Z",
            "source": {"name": "Mock Source", "url": "http://mock.source"}
        }
    ]
}

@pytest.mark.asyncio
async def test_live_news_cache_initialization(mocker):
    # Mock httpx.AsyncClient.get
    mock_get = mocker.patch("httpx.AsyncClient.get", return_value=MockResponse(mock_articles, 200))
    
    # First request
    response1 = client.get("/api/live-news")
    assert response1.status_code == 200
    data1 = response1.json()
    assert data1["success"] is True
    assert data1["server_dataset_initialized"] is True
    assert mock_get.call_count == 6 # Once for each of the 6 categories
    
    # Second request
    response2 = client.get("/api/live-news")
    assert response2.status_code == 200
    data2 = response2.json()
    assert data1 == data2 # Should return exact same cached structure
    assert mock_get.call_count == 6 # Should not have been called again

@pytest.mark.asyncio
async def test_live_news_failure_no_cache(mocker):
    # Mock to fail
    def mock_fail(*args, **kwargs):
        raise httpx.RequestError("Network error")
        
    mock_get = mocker.patch("httpx.AsyncClient.get", side_effect=mock_fail)
    
    # First request should fail
    response = client.get("/api/live-news")
    assert response.status_code == 503
    data = response.json()
    assert data["detail"]["success"] is False
    assert data["detail"]["error"]["code"] == "LIVE_NEWS_UNAVAILABLE"
    
    # Cache should not be initialized
    from app.services.live_news_service import _cache_initialized
    assert _cache_initialized is False
