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
     instructions: list[str] = Field(..., description="A list of step-by-step instructions for the recipe")

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

     

