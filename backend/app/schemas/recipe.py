# Defines the exact JSON shape of a Recipe
from pydantic import BaseModel

class RecipeRequest(BaseModel):
     url: str 