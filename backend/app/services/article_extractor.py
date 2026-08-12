import os
import httpx
import trafilatura
from urllib.parse import urlparse
from app.utils.url_validator import is_safe_url

class ArticleExtractor:
    @staticmethod
    async def extract_from_url(url: str) -> dict:
        if not is_safe_url(url):
            raise ValueError("URL is unsafe or points to a restricted internal network (SSRF).")
            
        timeout_seconds = int(os.getenv("URL_TIMEOUT_SECONDS", 15))
        max_size_mb = int(os.getenv("MAX_URL_RESPONSE_MB", 5))
        max_bytes = max_size_mb * 1024 * 1024

        try:
            # We use a custom httpx client to respect redirects safely and enforce size limits
            async with httpx.AsyncClient(timeout=timeout_seconds, follow_redirects=True, max_redirects=3) as client:
                response = await client.get(url)
                response.raise_for_status()

                # Basic size check via headers before parsing
                content_length = response.headers.get("Content-Length")
                if content_length and int(content_length) > max_bytes:
                    raise ValueError(f"Response exceeds maximum allowed size of {max_size_mb}MB.")
                
                html_content = response.text
                if len(html_content.encode('utf-8')) > max_bytes:
                    raise ValueError(f"Response exceeds maximum allowed size of {max_size_mb}MB.")

                # Extract using trafilatura
                extracted = trafilatura.extract(
                    html_content,
                    include_links=False,
                    include_images=False,
                    include_tables=False,
                    output_format="json",
                    with_metadata=True
                )

                if not extracted:
                    raise ValueError("Unable to extract meaningful article content from this URL.")
                
                import json
                parsed = json.loads(extracted)
                title = parsed.get("title", "")
                text = parsed.get("text", "")
                
                if not text:
                    raise ValueError("Unable to extract meaningful article content from this URL.")

                domain = urlparse(url).netloc
                
                return {
                    "title": title,
                    "text": text,
                    "source_domain": domain
                }
                
        except httpx.HTTPStatusError as e:
            raise ValueError(f"HTTP error occurred: {e.response.status_code}")
        except httpx.RequestError:
            raise ValueError("Failed to connect or connection timed out.")
        except Exception as e:
            if isinstance(e, ValueError):
                raise e
            raise ValueError(f"Article extraction failed: {str(e)}")
