from fastapi import APIRouter, HTTPException, status
from app.services.live_news_service import get_live_news, LiveNewsUnavailableException

router = APIRouter(
    prefix="/api",
    tags=["live-news"],
)

@router.get("/live-news", summary="Get live news", description="Fetches Live News from memory cache. Initializes cache from GNews API on first call.")
async def fetch_live_news():
    try:
        data = await get_live_news()
        return data
    except LiveNewsUnavailableException as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "success": False,
                "error": {
                    "code": "LIVE_NEWS_UNAVAILABLE",
                    "message": str(e)
                }
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error": {
                    "code": "INTERNAL_ERROR",
                    "message": "An unexpected error occurred while fetching live news."
                }
            }
        )
