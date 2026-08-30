import os
import httpx
import asyncio
import logging
from typing import Dict, Any, List
from datetime import datetime

logger = logging.getLogger(__name__)

# State for the cache
_live_news_cache: Dict[str, Any] = None
_cache_initialized: bool = False
_initialization_lock: asyncio.Lock = asyncio.Lock()

CATEGORIES = {
    "politics": "Politics",
    "business": "Business & Finance",
    "technology": "Technology",
    "sports": "Sports",
    "health": "Health",
    "world": "World"
}

# Mapping our categories to GNews topic/query parameters
GNEWS_TOPICS = {
    "politics": "?q=politics",
    "business": "?topic=business",
    "technology": "?topic=technology",
    "sports": "?topic=sports",
    "health": "?topic=health",
    "world": "?topic=world"
}

class LiveNewsUnavailableException(Exception):
    pass

async def fetch_category_news(client: httpx.AsyncClient, api_key: str, category_key: str) -> List[Dict[str, Any]]:
    query_params = GNEWS_TOPICS.get(category_key, "?topic=breaking-news")
    url = f"https://gnews.io/api/v4/top-headlines{query_params}&lang=en&max=10&apikey={api_key}"
    
    try:
        response = await client.get(url, timeout=15.0)
        response.raise_for_status()
        data = response.json()
        return data.get("articles", [])
    except Exception as e:
        logger.error(f"Error fetching news for category {category_key}: {e}")
        return []

def normalize_and_deduplicate(articles: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    seen_urls = set()
    normalized = []
    
    for idx, article in enumerate(articles):
        url = article.get("url")
        if not url or url in seen_urls:
            continue
            
        seen_urls.add(url)
        
        normalized.append({
            "id": str(hash(url) if url else idx),
            "title": article.get("title", ""),
            "description": article.get("description", ""),
            "content": article.get("content", ""),
            "url": url,
            "image_url": article.get("image", ""),
            "published_at": article.get("publishedAt", ""),
            "source": {
                "name": article.get("source", {}).get("name", ""),
                "url": article.get("source", {}).get("url", "")
            }
        })
        
        if len(normalized) >= 7:
            break
            
    # Sort by publication date descending
    normalized.sort(key=lambda x: x.get("published_at", ""), reverse=True)
    return normalized

async def initialize_cache():
    global _live_news_cache, _cache_initialized
    
    api_key = os.getenv("GNEWS_API_KEY")
    if not api_key:
        logger.error("GNEWS_API_KEY is missing from environment variables.")
        raise LiveNewsUnavailableException("Live news is temporarily unavailable.")

    async with httpx.AsyncClient() as client:
        tasks = []
        category_keys = list(CATEGORIES.keys())
        
        results = []
        for idx, key in enumerate(category_keys):
            if idx > 0:
                await asyncio.sleep(1.1)  # Respect GNews free tier limit of 1 request per second
            result = await fetch_category_news(client, api_key, key)
            results.append(result)
        
        sections = {}
        for idx, key in enumerate(category_keys):
            articles = results[idx]
            if isinstance(articles, Exception):
                articles = []
                
            normalized_articles = normalize_and_deduplicate(articles)
            
            sections[key] = {
                "title": CATEGORIES[key],
                "articles": normalized_articles
            }
            
        # Check if we got at least some articles to consider initialization successful
        total_articles = sum(len(sec["articles"]) for sec in sections.values())
        if total_articles == 0:
            logger.error("No articles were fetched from GNews. Initialization failed.")
            raise LiveNewsUnavailableException("Live news is temporarily unavailable.")
            
        _live_news_cache = {
            "success": True,
            "cache_status": "SERVER_MEMORY",
            "server_dataset_initialized": True,
            "last_fetched_at": datetime.utcnow().isoformat() + "Z",
            "sections": sections
        }
        _cache_initialized = True
        logger.info("Live news cache successfully initialized.")

async def get_live_news() -> Dict[str, Any]:
    global _cache_initialized, _live_news_cache, _initialization_lock
    
    if _cache_initialized and _live_news_cache is not None:
        return _live_news_cache
        
    async with _initialization_lock:
        # Double-checked locking
        if _cache_initialized and _live_news_cache is not None:
            return _live_news_cache
            
        await initialize_cache()
        return _live_news_cache

def reset_cache_for_testing():
    """Only to be used in unit tests!"""
    global _live_news_cache, _cache_initialized
    _live_news_cache = None
    _cache_initialized = False
