import os
import uuid
import tempfile
from contextlib import contextmanager
import yt_dlp

class ScraperError(Exception):
     """Custom exception raised when media extraction fails."""
     pass


def _get_ydl_options(output_path_template: str) -> dict:
     """
     Configures yt-dlp to download the smallest playable MP4/stream 
     to conserve server bandwidth and speed up AI upload times.
     """
     return {
          # Prefer low-res MP4 to minimize transfer time and file size
          'format': 'worst[ext=mp4]/worst',
          'outtmpl': output_path_template,
          'noplaylist': True,
          'quiet': False,
          'no_warnings': True,
     }


def download_media(url: str) -> tuple[str, str]:
     """
     Downloads a video from a supported platform (TikTok, Instagram, YouTube)
     and extracts the caption/description.

     Returns:
          tuple[str, str]: (absolute_file_path, caption_or_description)
     """
     job_id = str(uuid.uuid4())
     temp_dir = tempfile.gettempdir()
     template = os.path.join(temp_dir, f"clip2cook_{job_id}.%(ext)s")

     ydl_opts = _get_ydl_options(template)

     try:
          with yt_dlp.YoutubeDL(ydl_opts) as ydl:
               info = ydl.extract_info(url, download=True)
               if not info:
                    raise ScraperError("Could not retrieve video information.")

               # Resolves the exact final downloaded filename on disk
               file_path = ydl.prepare_filename(info)

               # Some platforms put the text in 'description', others in 'title'
               caption = info.get('description') or info.get('title') or ''

               print(f"Downloaded media to: {file_path}")
               return file_path, caption.strip()

     except Exception as e:
          raise ScraperError(f"yt-dlp extraction failed: {str(e)}") from e


def cleanup_temp_file(file_path: str) -> None:
     """Safely removes the downloaded local file if it exists."""
     try:
          if file_path and os.path.exists(file_path):
               os.remove(file_path)
               print(f"Removed temp file: {file_path}")
     except OSError as e:
          print(f"⚠️ Failed to remove temporary file {file_path}: {e}")


@contextmanager
def download_video_session(url: str):
     """
     Context manager that automatically downloads media and guarantees 
     local cleanup when exiting the block, even if an exception occurs.

     Usage:
          with download_video_session(url) as (file_path, caption):
               recipe = extract_recipe_from_video(file_path, caption)
     """
     file_path = None
     try:
          file_path, caption = download_media(url)
          yield file_path, caption
     finally:
          if file_path:
               cleanup_temp_file(file_path)