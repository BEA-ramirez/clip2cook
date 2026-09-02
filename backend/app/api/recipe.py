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
from app.schemas.recipe import RecipeCreate, RecipeResponse, RecipeUpdate

router = APIRouter()

@router.get("/")
async def get_all_my_recipes(user_id: str = Depends(verify_supabase_token)):
     """Fetch all saved recipes for the logged-in user (Summary View)."""
     
     response = supabase.table("recipes").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
     return response.data

@router.get("/{recipe_id}")
async def get_recipe_details(recipe_id: UUID, user_id: str = Depends(verify_supabase_token)):
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
async def create_recipe(recipe: RecipeCreate, user_id: str = Depends(verify_supabase_token)):
     """Create a new recipe along with all its nested components."""
     
     # strip out the nested list to only get the main recipe data
     recipe_data = recipe.model_dump(exclude={"ingredients", "instructions", "equipment", "tags"})
     recipe_data["user_id"] = user_id
     
     # insert the main recipe data and get id
     new_recipe = supabase.table("recipes").insert(recipe_data).execute()
     if not new_recipe.data:
          raise HTTPException(status_code=400, detail="Failed to create recipe.")
     
     recipe_id = new_recipe.data[0]["id"]
     
     if recipe.ingredients:
          ing_data = [{**ing.model_dump(), "recipe_id": recipe_id} for ing in recipe.ingredients]
          supabase.table("ingredients").insert(ing_data).execute()
        
    if recipe.instructions:
          inst_data = [{**inst.model_dump(), "recipe_id": recipe_id} for inst in recipe.instructions]
          supabase.table("instructions").insert(inst_data).execute()
        
    if recipe.equipment:
          eq_data = [{**eq.model_dump(), "recipe_id": recipe_id} for eq in recipe.equipment]
          supabase.table("equipment").insert(eq_data).execute()
        
    if recipe.tags:
          tag_data = [{"tag_name": tag, "recipe_id": recipe_id} for tag in recipe.tags]
          supabase.table("tags").insert(tag_data).execute()
        
    return {"status": "success", "recipe_id": recipe_id}


@router.delete("/{recipe_id}")
async def delete_recipe(recipe_id: UUID, user_id: str = Depends(verify_supabase_token)):
     """Delete a recipe. (ON DELETE CASCADE handles all the ingredients/steps!)."""
     
     response = supabase.table("recipes").delete().eq("id", str(recipe_id)).eq("user_id", user_id).execute()
     if not response.data:
          raise HTTPException(status_code=404, detail="Recipe not found.")
     
     return {"status": "success", "message": "Recipe deleted successfully."}