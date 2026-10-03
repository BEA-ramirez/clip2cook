from app.schemas.recipe import RecipeCreate, IngredientBase, InstructionBase, EquipmentBase

def map_gemini_to_db_schema(ai_data: dict, source_url: str) -> RecipeCreate:
     """
     Converts the raw gemini ai output dict into the strict
     recipecreate pydantic model required by db
     """
     
     
     prep_mins = ai_data.get("prep_time_minutes")
     bake_mins = ai_data.get("bake_time_minutes")
     
     
     yield_desc = ai_data.get("yield_amount")
     servings = ai_data.get("servings")
     
     final_yield = yield_desc if yield_desc else (f"{servings} servings" if servings else None)
     
     # build the nested list
     mapped_ingredients = [
          IngredientBase(
               name=ing.get("name"),
               qty=ing.get("quantity"),
               unit=ing.get("unit"),
               weight_grams=ing.get("grams_amount")
          )
          for ing in ai_data.get("ingredients", [])
     ]
     
     mapped_instructions = [
          InstructionBase(
               step_number=idx + 1,
               instruction=step_text
          )
          for idx, step_text in enumerate(ai_data.get("instructions", []))
     ]
     
     mapped_equipment = [
          EquipmentBase(name=eq) 
          for eq in ai_data.get("equipment", [])
     ]
     
     return RecipeCreate(
          title=ai_data.get("title", "Untitled Recipe"),
          slug=ai_data.get("slug"), 
          description=ai_data.get("description"),
          recipe_by=ai_data.get("recipe_by"),
          source_url=source_url,
          prep_time=f"{prep_mins} mins" if prep_mins else None,
          bake_time=f"{bake_mins} mins" if bake_mins else None,
          servings=servings, 
          temp=ai_data.get("temp_or_heat"),
          yield_amount=final_yield,
          image_url=None, 
          is_ai_generated=True,
          is_saved=False, 
          ingredients=mapped_ingredients,
          instructions=mapped_instructions,
          equipment=mapped_equipment,
          tags=[]
     )