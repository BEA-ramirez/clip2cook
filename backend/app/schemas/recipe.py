import re
from fractions import Fraction
from pydantic import BaseModel, Field, model_validator, field_validator
from typing import List, Optional, Any
from uuid import UUID
from datetime import datetime


ALLOWED_QTY_PATTERN = re.compile( 
     r'^\d+(\.\d+)?$'                        # whole or decimal
     r'|^\d+/\d+$'                           # fraction
     r'|^\d+\s+\d+/\d+$'                     # mixed number
     r'|^\d+(\.\d+)?\s*[-–]\s*\d+(\.\d+)?$'  # range: "150-160"
)

class RecipeRequest(BaseModel):
     url: str 
     
class IngredientBase(BaseModel):
     qty: str | None = None
     unit: Optional[str] = None
     name: str
     weight_grams: Optional[float] = None
     group_name: Optional[str] = None
     
     @field_validator("qty", mode="before")
     @classmethod
     def validate_qty_format(cls, v):
          if v is None:
               return None
          s = str(v).strip()
          if not s:
               return None

          # reject Unicode fraction characters outright
          if any(ch in s for ch in '½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞'):
               raise ValueError(
                    f"Unicode fraction character found in qty '{s}'. "
                    "Use ASCII format like '1/3' or '1 1/2'."
               )

          # reject any other non-ASCII that snuck in
          if not s.isascii():
               raise ValueError(f"Non-ASCII character in qty '{s}'.")

          # enforce allowed shape
          if not ALLOWED_QTY_PATTERN.match(s):
               raise ValueError(
                    f"Invalid qty format '{s}'. "
                    "Allowed: '2', '0.5', '1/3', '1 1/2', '150-160'."
               )

          return s  # keep the original string form
     @model_validator(mode="after")
     def validate_qty_parseable(self):
          """Fail fast if qty is unparseable. Do not store the numeric result."""
          if self.qty is None:
               return self

          s = self.qty.strip()

          # Ranges are valid — they're just not numerically parseable
          if re.match(r'^\d+(\.\d+)?\s*[-–]\s*\d+(\.\d+)?$', s):
               return self

          try:
               if ' ' in s:
                    whole, frac = s.split(' ', 1)
                    Fraction(int(whole)) + Fraction(frac)
               else:
                    Fraction(s)
          except (ValueError, ZeroDivisionError, TypeError):
               raise ValueError(f"Could not parse qty '{s}' into a numeric value.")

          return self

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