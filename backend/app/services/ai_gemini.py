# Code that talks to the Gemini API
import os
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from openai import OpenAI
from typing import List, Optional
from litellm import completion

client = OpenAI(
     api_key=os.getenv("GEMINI_API_KEY"),
     base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

# define the exact JSON structure we want Gemini to return
class AI_Ingredient(BaseModel):
     name: str = Field(..., description="The name of the ingredient")
     qty: Optional[str] = Field(None, description="Quantity (e.g., '1', '1/2'). Null if 'to taste'.")
     unit: Optional[str] = Field(None, description="Unit of measurement (cups, tbsp, pinch).")
     weight_grams: Optional[float] = Field(None, description="Grams if specified, else null.")

class AI_Instruction(BaseModel):
     step_number: int
     description: str = Field(..., description="The detailed step instruction.")
     timer_seconds: Optional[int] = Field(None, description="If the step mentions a specific duration (e.g., 'boil for 5 minutes'), convert it to total seconds (300). Null if no time is mentioned.")

class AI_Equipment(BaseModel):
     name: str

class AI_RecipeExtraction(BaseModel):
     title: str
     description: str
     recipe_by: Optional[str] = Field(
          None, 
          description="The person, author, or chef that created the recipe."
     )
     platform: Optional[str] = Field(
          None, 
          description="The source platform of the recipe. Choose from: Blog, Website, YouTube, TikTok, Instagram, Facebook."
     )
     notes: Optional[str] = Field(
          None, 
          description="Any additional notes, important reminders, tips, or storage instructions."
     )
     yield_amount: Optional[str] = Field(None, description="Container or batch size (e.g., '1 loaf', '4 servings').")
     prep_time: Optional[str] = Field(None, description="E.g., '15 mins'")
     bake_time: Optional[str] = Field(None, description="E.g., '45 mins'")
     temp: Optional[str] = Field(None, description="E.g., '350°F'")
     ingredients: List[AI_Ingredient]
     instructions: List[AI_Instruction]
     equipment: List[AI_Equipment]
     is_complete: bool = Field(..., description="True if recipe is full. False if missing quantities.")
    
# functions that talks to the Gemini API
def extract_recipe_from_text(transcript: str) -> dict:
     """
     Takes a raw yt transcript string, feeds it to Gemini, 
     and returns a structured recipe dictionary.
     """
     print("Extracting from text using LiteLLM (Gemini -> Groq)...")
     
     primary_model = "gemini/gemini-3.5-flash" 
     fallback_models = ["groq/openai/gpt-oss-20b"]

     response = completion(
          model=primary_model,
          fallbacks=fallback_models,
          messages=[
            {"role": "system", "content": "You are an expert culinary AI. Extract the recipe strictly adhering to the schema."},
            {"role": "user", "content": f"Transcript:\n{transcript}"}
        ],
          response_format=AI_RecipeExtraction, 
          temperature=0.2
     )
     json_string = response.choices[0].message.content
     recipe_data = AI_RecipeExtraction.model_validate_json(json_string)
     return recipe_data.model_dump()

     

clientVid = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# --- VIDEO EXTRACTION (For TikTok, IG, YT Shorts) ---
def extract_recipe_from_video(video_path: str, caption: str) -> dict:
     """Heavy Path: Uploads an mp4, extracts the recipe, and deletes the video."""
     print("Uploading video to Gemini File API...")
     
     # upload the physical video file to Google's servers
     video_file = clientVid.files.upload(file=video_path)
     
     print("Extracting recipe from video and caption...")
     prompt = f"Watch this video and read the caption. Extract the complete recipe.\n\nCaption: {caption}"
     
     try:
          # feed BOTH the video file and the text prompt to the model
          response = clientVid.models.generate_content(
               model='gemini-3.5-flash',
               contents=[video_file, prompt],
               config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=AI_RecipeExtraction,
                    temperature=0.2,
               ),
          )
          
          recipe_data = AI_RecipeExtraction.model_validate_json(response.text)
          return recipe_data.model_dump()
     finally:
          # delete the file from Google's servers immediately!
          print("Cleaning up Gemini File API...")
          clientVid.files.delete(name=video_file.name)