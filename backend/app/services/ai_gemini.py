# Code that talks to the Gemini API
import os
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from openai import OpenAI

client = OpenAI(
     api_key=os.getenv("GEMINI_API_KEY"),
     base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

# define the exact JSON structure we want Gemini to return
class Ingredients(BaseModel):
     name: str = Field(..., description="The name of the ingredient")
     quantity: str = Field(..., description="The quantity of the ingredient")
     unit: str = Field(..., description="The unit of measurement for the ingredient, cups, tbsp, grams, tsp, or to taste etc.")
     grams_amount: float|None = Field(None, description="The amount of the ingredient in grams. If not applicable or unable to calculate, return null.")

class RecipeSchema(BaseModel):
     title: str = Field(..., description="The title of the recipe")
     recipe_by: str = Field(..., description="The author or source of the recipe")
     description: str = Field(..., description="A brief description of the recipe")
     prep_time_minutes: int|None = Field(None, description="The preparation time in minutes, if mentioned")
     servings: int = Field(..., description="The number of individual people this recipe feeds. Always return a pure integer, e.g., 4.")
     yield_description: str | None = Field(None, description="The physical container or total batch size, e.g., 'One 9x9 inch baking pan', '2 dozen cookies', or '1 large loaf'. Return null if none.")
     equipment: list[str] = Field(..., description="Any specific pans, skillets, or baking dishes mentioned (e.g., '9x13 glass baking dish').")
     bake_time_minutes: int|None = Field(None, description="The baking time inside the oven in minutes, if applicable")
     temp_or_heat: str|None = Field(None, description="The temperature or heat level, e.g., '350°F', 'medium heat'. Return null if none.")
     ingredients: list[Ingredients] = Field(..., description="A list of ingredients for the recipe")
     instructions: list[str] = Field(
        description=(
            "A list of step-by-step instructions. Each step MUST start with a short, 2-to-5 word title, "
            "followed immediately by a period, a space, and then the detailed instruction. "
            "Example: 'Prepare the marinade. In a large bowl, whisk together the soy sauce, garlic, and ginger until combined.'"
        )
    )
     is_complete: bool = Field(..., description="Return True if the text provided a full recipe. Return False if steps or quantities are missing and you need to watch the video.")

# functions that talks to the Gemini API
def extract_recipe_from_text(transcript: str) -> dict:
     """
     Takes a raw yt transcript string, feeds it to Gemini, 
     and returns a structured recipe dictionary.
     """
     print("Connecting to gemini flash...")

     prompt = f"""
     You are an expert culinary assistant. Read the following video transcript and extract the recipe information.
     If the transcript does not contain a recipe, return an empty JSON object.
     Format your response EXACTLY as a raw JSON object that matches this schema:
     {RecipeSchema.model_json_schema()}
     
     If the transcript mentions no specific quantities, use your best culinary judgment or write 'to taste'.
     Do NOT include markdown blocks like ```json. Just return the raw JSON string.

     Transcript:
     {transcript}
     """

     # using gemini-2.0-flash
     response = client.chat.completions.create(
          model="gemini-3.5-flash", # You can use whichever Gemini model name worked for you previously
          messages=[
               {"role": "system", "content": "You are a culinary AI. Always return raw JSON."},
               {"role": "user", "content": prompt}
          ],
          response_format={"type": "json_object"}, # This forces JSON mode!
          temperature=0.2
     )
     json_string = response.choices[0].message.content
     recipe_data = RecipeSchema.model_validate_json(json_string)
     return recipe_data.model_dump()

     

clientVid = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# --- VIDEO EXTRACTION (For TikTok, IG, YT Shorts) ---
def extract_recipe_from_video(video_path: str, caption: str) -> dict:
     """Heavy Path: Uploads an mp4, extracts the recipe, and deletes the video."""
     print("Uploading video to Gemini File API...")
     
     # Upload the physical video file to Google's servers
     video_file = clientVid.files.upload(file=video_path)
     
     print("Extracting recipe from video and caption...")
     prompt = f"Watch this video and read the creator's caption. Combine the visual steps, spoken audio, and text caption to extract the complete recipe. If no quantities are mentioned, use best culinary judgment or write 'to taste'.\n\nCreator Caption: {caption}"
     
     try:
          # 2. Feed BOTH the video file and the text prompt to the model
          response = clientVid.models.generate_content(
               model='gemini-3.5-flash',
               contents=[video_file, prompt],
               config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=RecipeSchema,
                    temperature=0.2,
                    system_instruction="You are an expert culinary assistant. Analyze the video and text to extract structured recipe data."
               ),
          )
          
          recipe_data = RecipeSchema.model_validate_json(response.text)
          return recipe_data.model_dump()
     finally:
          # CRITICAL: Always delete the file from Google's servers immediately!
          print("Cleaning up Gemini File API...")
          clientVid.files.delete(name=video_file.name)