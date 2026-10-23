from pydantic import BaseModel, Field, model_validator
from typing import List, Optional, Any
from uuid import UUID
from datetime import datetime

class RecipeRequest(BaseModel):
     url: str 
     
class IngredientBase(BaseModel):
     qty: Optional[str] = None
     unit: Optional[str] = None
     name: str
     weight_grams: Optional[float] = None
     group_name: Optional[str] = None

class InstructionBase(BaseModel):
     step_number: int
     description: str
     timer_seconds: Optional[int] = None

class EquipmentBase(BaseModel):
     name: str

class RecipeCreate(BaseModel):
     title: str
     description: Optional[str] = None
     recipe_by: Optional[str] = None
     platform: Optional[str] = None
     source_url: Optional[str] = None
     prep_time: Optional[str] = None
     bake_time: Optional[str] = None
     temp: Optional[str] = None
     yield_amount: Optional[str] = None
     image_url: Optional[str] = None
     is_ai_generated: bool = False
     is_saved: bool = True
     notes: Optional[str] = None
     ingredients: List[IngredientBase] = []
     instructions: List[InstructionBase] = []
     equipment: List[EquipmentBase] = []
     tags: List[str] = []

class IngredientResponse(IngredientBase):
     id: UUID
     recipe_id: UUID

class InstructionResponse(InstructionBase):
     id: UUID
     recipe_id: UUID

class EquipmentResponse(EquipmentBase):
     id: UUID
     recipe_id: UUID

class TagResponse(BaseModel):
     id: UUID
     recipe_id: UUID
     tag_name: str

class RecipeResponse(RecipeCreate):
     id: UUID
     user_id: UUID
     created_at: datetime
     updated_at: datetime
          
     ingredients: List[IngredientResponse] = []
     instructions: List[InstructionResponse] = []
     equipment: List[EquipmentResponse] = []
     tags: List[str] = []
     
     @model_validator(mode="before")
     @classmethod
     def flatten_tags(cls, data: Any) -> Any:
          if isinstance(data, dict):
               raw_tags = data.get("tags", [])
               if raw_tags and isinstance(raw_tags, list):
                    flattened = []
                    for t in raw_tags:
                         if isinstance(t, dict):
                              # Safely look for 'tag_name' or 'name'
                              name = t.get("tag_name") or t.get("name")
                              if name:
                                   flattened.append(str(name))
                         elif isinstance(t, str):
                              flattened.append(t)
                    data["tags"] = flattened
          return data