import os
import uuid
import tempfile
import requests
from contextlib import contextmanager

class TikTokAPIError(Exception):
    """Custom exception raised when the TikWM API fails."""
    pass

def download_tiktok_media(url: str) -> tuple[str, str]:
    """
    Uses the free TikWM API to bypass TikTok bot-protection and download the video.
    Returns: tuple[str, str]: (absolute_file_path, caption)
    """
    api_url = "https://www.tikwm.com/api/"
    params = {
        "url": url,
        "hd": 1  # Request HD video
    }
    
    # Pass a standard browser User-Agent so the API doesn't block Python
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
    }

    print(f"🔄 Requesting TikTok bypass from TikWM API...")
    response = requests.get(api_url, params=params, headers=headers)
    
    if response.status_code != 200:
        raise TikTokAPIError("Failed to reach TikWM API.")
        
    data = response.json()
    if data.get("code") != 0:
        raise TikTokAPIError(f"TikWM Error: {data.get('msg')}")
        
    video_data = data.get("data", {})
    caption = video_data.get("title", "")
    
    # Grab the direct video link (prefer HD)
    download_url = video_data.get("hdplay") or video_data.get("play")
    if not download_url:
        raise TikTokAPIError("No video download link found in the API response.")
        
    print(f"Extracted direct CDN link. Downloading mp4...")
    
    # Download the actual mp4 file in chunks to save memory
    vid_response = requests.get(download_url, stream=True, headers=headers)
    if vid_response.status_code != 200:
        raise TikTokAPIError("Failed to download the video file from the CDN.")
        
    job_id = str(uuid.uuid4())
    temp_dir = tempfile.gettempdir()
    file_path = os.path.join(temp_dir, f"tiktok_{job_id}.mp4")
    
    with open(file_path, "wb") as f:
        for chunk in vid_response.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)
                
    print(f"Saved TikTok video to: {file_path}")
    return file_path, caption.strip()


def cleanup_temp_file(file_path: str) -> None:
    """Safely removes the downloaded local file if it exists."""
    try:
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
            print(f"🗑️ Removed temp file: {file_path}")
    except OSError as e:
        print(f"⚠️ Failed to remove temporary file {file_path}: {e}")

@contextmanager
def download_tiktok_session(url: str):
    """Context manager for safe downloading and guaranteed cleanup."""
    file_path = None
    try:
        file_path, caption = download_tiktok_media(url)
        yield file_path, caption
    finally:
        if file_path:
            cleanup_temp_file(file_path)