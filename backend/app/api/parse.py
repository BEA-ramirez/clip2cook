from fastapi import APIRouter, HTTPException, Depends
from urllib.parse import urlparse

from app.schemas.recipe import RecipeRequest
from app.services.youtube import extract_video_id, get_native_transcript
from app.services.web_scraper import scrape_article_text, WebScraperError
from app.services.scraper import download_video_session, ScraperError
from app.services.tiktok_api import download_tiktok_session, TikTokAPIError
from app.services.ai_gemini import extract_recipe_from_text, extract_recipe_from_video

# Uncomment once you are ready to enforce user tokens again
# from app.api.auth import verify_supabase_token

router = APIRouter()

VIDEO_DOMAINS = {
    "youtube.com",
    "youtu.be",
    "tiktok.com",
    "instagram.com",
    "facebook.com",
    "fb.watch",
}

def is_video_url(url: str) -> bool:
    """Checks whether the domain belongs to a supported video platform."""
    try:
        parsed = urlparse(url)
        hostname = parsed.netloc.lower()
        clean_host = hostname.removeprefix("www.").removeprefix("m.")
        return any(clean_host.endswith(domain) for domain in VIDEO_DOMAINS)
    except Exception:
        return False

def is_youtube_url(url: str) -> bool:
    """Detects whether a URL is a YouTube standard video or Short."""
    return "youtube.com" in url or "youtu.be" in url

def is_tiktok_url(url: str) -> bool:
    """Detects whether a URL is a TikTok video."""
    return "tiktok.com" in url

@router.post("/extract")
def extract_recipe(
    request: RecipeRequest,
    # user_id: str = Depends(verify_supabase_token) # Reactivate when frontend auth is wired
):
    """
    Main extraction endpoint implementing the Two-Tier Flowchart:
    1. TIER 1: Try text-only (Blogs or YouTube Transcripts). If complete, return instantly.
    2. TIER 2: If text is missing or incomplete, fall back to Multimodal Video Download.
    """
    url = str(request.url).strip()
    
    # ==========================================
    # TIER 1: TEXT-FIRST FAST PATH
    # ==========================================
    tier_1_text = ""
    source_type = "unknown"

    # PATH A: Blogs & Articles (Not a video URL)
    if not is_video_url(url):
        print(f"[Tier 1] Scraping article text from: {url}")
        try:
            article = scrape_article_text(url)
            tier_1_text = f"Title: {article['title']}\n\nContent: {article['content']}"
            source_type = "blog_fast_path"
        except WebScraperError as e:
            raise HTTPException(status_code=422, detail=str(e))
            
    # PATH B: YouTube Transcripts
    elif is_youtube_url(url):
        video_id = extract_video_id(url)
        if video_id:
            print(f"[Tier 1] Fetching YouTube transcript for {video_id}...")
            transcript = get_native_transcript(video_id)
            if transcript:
                tier_1_text = transcript
                source_type = "youtube_transcript"

    # Evaluate Tier 1 Text with Gemini Gatekeeper
    if tier_1_text:
        print(f"[Tier 1] Asking Gemini to evaluate {source_type} completeness...")
        try:
            recipe = extract_recipe_from_text(tier_1_text)
            
            # Safely extract 'is_complete' whether it's a dict or an object
            is_complete = recipe.get("is_complete") if isinstance(recipe, dict) else getattr(recipe, "is_complete", False)
            
            if is_complete:
                print(f"[Tier 1 Success] Recipe fully extracted from {source_type}!")
                return {
                    "status": "success",
                    "source": source_type,
                    "data": recipe
                }
            else:
                print(f"[Tier 1 Incomplete] Missing details in {source_type}.")
                
                # If it's a blog and it's incomplete, stop here (no video to fallback to)
                if not is_video_url(url):
                    raise HTTPException(status_code=422, detail="No complete recipe found on this webpage.")
                
                # If it's YouTube, do NOT raise an exception, just let the code continue down to Tier 2
                print("🎬 Falling back to Tier 2 Multimodal Video Processing...")
                
        except HTTPException:
            raise # Re-raise known HTTP errors
        except Exception as e:
            print(f"Tier 1 AI parsing failed: {e}. Falling back to video scraping if possible...")
            if not is_video_url(url):
                raise HTTPException(status_code=500, detail=f"Failed to extract recipe from article: {str(e)}")

    # ==========================================
    # TIER 2: MULTIMODAL VIDEO FALLBACK
    # ==========================================
    
    # PATH C: TikTok Free API Path
    if is_tiktok_url(url):
        print(f"[Tier 2] Bypassing with TikWM for: {url}")
        try:
            with download_tiktok_session(url) as (file_path, caption):
                recipe = extract_recipe_from_video(file_path, caption)
                return {
                    "status": "success",
                    "source": "tiktok_api",
                    "data": recipe
                }
        except TikTokAPIError as te:
            raise HTTPException(status_code=422, detail=str(te))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to process TikTok video: {str(e)}")

    # PATH D: yt-dlp Video Path (Facebook, IG Reels, and YouTube Fallback)
    elif is_video_url(url):
        print(f"[Tier 2] Downloading and analyzing video with yt-dlp for: {url}")
        try:
            with download_video_session(url) as (file_path, caption):
                recipe = extract_recipe_from_video(file_path, caption)
                return {
                    "status": "success",
                    "source": "video_multimodal",
                    "data": recipe
                }
        except ScraperError as se:
            raise HTTPException(status_code=422, detail=f"Scraper error: {str(se)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to process video: {str(e)}")
            
    else:
        # Fallback safety net
        raise HTTPException(status_code=400, detail="Invalid or unsupported URL.")