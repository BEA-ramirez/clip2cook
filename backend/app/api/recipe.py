# GET / -> get all recipes for the current user
# GET /{recipe_id} -> get details of a specific recipe
# GET /search?query=... -> search recipes by title, description, or tags
# POST / -> create a recipe
# PUT /{recipe_id} -> update a recipe (this can be tricky due to nested items, so we'll implement a basic update or just recreate the nested items)
# DELETE /{recipe_id} -> delete a recipe (handled by CASCADE!)

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from uuid import UUID

from app.api.auth import verify_supabase_token
from app.core.supabase import supabase
from app.schemas.recipe import RecipeCreate, RecipeResponse

router = APIRouter()

@router.get("/")
async def get_all_my_recipes(user_id: str = "363eb45c-4152-4c1b-8977-db9adbf465e4"):
     """Fetch all saved recipes for the logged-in user (Summary View)."""
     
     response = supabase.table("recipes").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
     return response.data

@router.get("/{recipe_id}")
async def get_recipe_details(recipe_id: UUID, user_id: str = "363eb45c-4152-4c1b-8977-db9adbf465e4"):
     """Fetch a single recipe AND all its nested data (ingredients, steps, etc.)."""
     
     response = (
          supabase.table("recipes")
          .select("*, ingredients(*), instructions(*), equipment(*), tags(*)")
          .eq("id", str(recipe_id))
          .eq("user_id", user_id)
          .execute()
     )
     
     if not response.data:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found.")
     return response.data[0]

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_recipe(recipe: RecipeCreate, user_id: str = "363eb45c-4152-4c1b-8977-db9adbf465e4"):
     """Create a new recipe along with all its nested components."""
     try:
          # strip out the nested list to only get the main recipe data
          recipe_data = recipe.model_dump(exclude={"ingredients", "instructions", "equipment", "tags"})
          recipe_data["user_id"] = user_id
          
          # 1. Insert Main Recipe
          print("Saving main recipe...")
          new_recipe = supabase.table("recipes").insert(recipe_data).execute()
          if not new_recipe.data:
               raise HTTPException(status_code=400, detail="Failed to create recipe.")
          
          recipe_id = new_recipe.data[0]["id"]
          
          # 2. Insert Ingredients
          if recipe.ingredients:
               print("Saving ingredients...")
               ing_data = [{**ing.model_dump(), "recipe_id": recipe_id} for ing in recipe.ingredients]
               supabase.table("ingredients").insert(ing_data).execute()
               
          # 3. Insert Instructions
          if recipe.instructions:
               print("Saving instructions...")
               inst_data = [{**inst.model_dump(), "recipe_id": recipe_id} for inst in recipe.instructions]
               supabase.table("instructions").insert(inst_data).execute()
               
          # 4. Insert Equipment
          if recipe.equipment:
               print("Saving equipment...")
               eq_data = [{**eq.model_dump(), "recipe_id": recipe_id} for eq in recipe.equipment]
               supabase.table("equipment").insert(eq_data).execute()
               
          # 5. Insert Tags
          if recipe.tags:
               print("Saving tags...")
               tag_data = [{"tag_name": tag, "recipe_id": recipe_id} for tag in recipe.tags]
               supabase.table("tags").insert(tag_data).execute()
               
          print("All data saved successfully!")
          return {"status": "success", "recipe_id": recipe_id}

     except Exception as e:
          # THIS WILL REVEAL THE DATABASE CRASH!
          error_msg = str(e)
          print(f"\nDATABASE CRASH 🚨")
          print(f"Details: {error_msg}\n")
          raise HTTPException(status_code=500, detail=f"Database Error: {error_msg}")


@router.delete("/{recipe_id}")
async def delete_recipe(recipe_id: UUID, user_id: str = Depends(verify_supabase_token)):
     """Delete a recipe. (ON DELETE CASCADE handles all the ingredients/steps!)."""
     
     response = supabase.table("recipes").delete().eq("id", str(recipe_id)).eq("user_id", user_id).execute()
     if not response.data:
          raise HTTPException(status_code=404, detail="Recipe not found.")
     
     return {"status": "success", "message": "Recipe deleted successfully."}