import json
import re
import requests
from bs4 import BeautifulSoup

class WebScraperError(Exception):
    """Custom exception raised when article extraction fails."""
    pass

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

def _extract_json_ld_recipe(soup: BeautifulSoup) -> str | None:
    """
    Looks for Schema.org Recipe metadata. 
    Most food blogs use plugins (like WP Recipe Maker) that embed this for SEO.
    """
    scripts = soup.find_all("script", type="application/ld+json")
    for script in scripts:
        if not script.string:
            continue
        try:
            data = json.loads(script.string)
            
            # JSON-LD can be a single dict or a list of dicts, or wrapped in '@graph'
            items = []
            if isinstance(data, list):
                items = data
            elif isinstance(data, dict):
                items = data.get("@graph", [data])

            for item in items:
                item_type = item.get("@type", "")
                # Handle single type or list of types (e.g., ["ItemPage", "Recipe"])
                if item_type == "Recipe" or (isinstance(item_type, list) and "Recipe" in item_type):
                    print("Found Schema.org Recipe JSON-LD metadata!")
                    return json.dumps(item, ensure_ascii=False)
        except Exception:
            continue
            
    return None


def _extract_clean_body_text(soup: BeautifulSoup) -> str:
    """
    Strips non-content tags (scripts, ads, navigation) and extracts readable text.
    """
    # Remove clutter tags
    for tag in soup(["script", "style", "nav", "footer", "header", "aside", "noscript", "svg", "form"]):
        tag.decompose()

    # Prioritize common article/recipe wrappers if present
    container = (
        soup.find("article") 
        or soup.find("main") 
        or soup.find(class_=re.compile(r"recipe|post-content|entry-content", re.I)) 
        or soup.body
    )

    if not container:
        return ""

    text = container.get_text(separator="\n", strip=True)
    
    # Collapse multiple blank lines
    clean_text = re.sub(r"\n\s*\n+", "\n\n", text)
    return clean_text[:15000]  # Cap at ~15k chars to keep Gemini token usage light and fast


def scrape_article_text(url: str) -> dict:
    """
    Fetches a web page and extracts structured recipe metadata or clean text.

    Returns:
        dict: {
            "title": str,
            "content": str,
            "is_schema_json": bool
        }
    """
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        raise WebScraperError(f"Failed to fetch article from {url}: {str(e)}") from e

    soup = BeautifulSoup(response.text, "html.parser")

    # Grab page title
    title = ""
    if soup.title and soup.title.string:
        title = soup.title.string.strip()
    elif soup.find("h1"):
        title = soup.find("h1").get_text(strip=True)

    # Check for golden Schema.org JSON-LD first
    schema_recipe = _extract_json_ld_recipe(soup)
    if schema_recipe:
        return {
            "title": title,
            "content": schema_recipe,
            "is_schema_json": True
        }

    # Fallback to clean article text
    body_text = _extract_clean_body_text(soup)
    if not body_text:
        raise WebScraperError("Could not extract any readable content from this page.")

    return {
        "title": title,
        "content": body_text,
        "is_schema_json": False
    }