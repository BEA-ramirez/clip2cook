from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import NoTranscriptFound, TranscriptsDisabled
import re
from app.services.ai_gemini import extract_recipe_from_text


def extract_video_id(url: str) -> str|None:
     """
     Extracts the video ID from a yt url.
     """
     pattern = r'(?:v=|\/)([0-9A-Za-z_-]{11}).*'
     match = re.search(pattern, url)
     return match.group(1) if match else None




def get_native_transcript(video_id: str) -> str | None:
    """
    Primary Path: Attempts to fetch native YouTube captions.
    If English is not available, it will attempt to translate the first available transcript to English.
    Returns the combined text string if successful, or None if unavailable.
    """
    try:
        ytt_api = YouTubeTranscriptApi()
        transcript_list = ytt_api.list(video_id)

        try:
          transcript = transcript_list.find_transcript(['en', 'en-US', 'en-GB'])
          print("Success: Found existing English transcript.")
        except NoTranscriptFound:
          # since transcript_list is iterable, cast it to a list
          available_transcripts = list(transcript_list)

          if not available_transcripts:
              raise NoTranscriptFound("No transcripts available in any language.")
          
          first_transcript = available_transcripts[0] # grab the first available transcript
          print(f"No English found. Found '{first_transcript.language}' transcript instead.")

          if first_transcript.is_translatable:
               print(f"Translating {first_transcript.language} to English...")
               transcript = first_transcript.translate('en')
          else:
               print(f"Transcript in {first_transcript.language} is not translatable.")
               return None
        transcript_data = transcript.fetch()
        combined_text = " ".join([entry.text for entry in transcript_data])
        return combined_text  
    except (NoTranscriptFound, TranscriptsDisabled) as e:
        # TRUE failure - the video genuinely has no captions
        print(f"No captions found for {video_id}: {str(e)}")
        return None
    except Exception as e:
        # catches actual bugs 
        print(f"An unexpected error occurred for {video_id}: {str(e)}")
        return None




def process_youtube_url(url: str):
     # the orchestrator
     video_id = extract_video_id(url)
     if not video_id:
          return {"error": "Invalid YouTube URL or unable to extract video ID."}
     
     # path 1: try to get native transcript
     transcript = get_native_transcript(video_id)
     if transcript:
          print("Successfully fetched native transcript. Routing to Gemini Flash")
          print(transcript[:200] + "...")  # just show a snippet for now
          
          recipe_data = extract_recipe_from_text(transcript)
          print("Success! Gemini extracted the recipe.")
          print(recipe_data)

          return {
               "source": "native_transcript",
               "video_id": video_id,
               "recipe": recipe_data
          }
     else: # path 2: fallback - no captions available
          print("Fallback triggered: Video has no captions. Initiating Audio Scraper -> Groq Whisper...")
          # TODO: Route to scraper.py -> ai_whisper.py -> ai_gemini.py
          return {
               "source": "fallback_whisper",
               "video_id": video_id,
               "message": "Routing to yt-dlp and Groq Whisper pipeline next!"
          }