from fastapi import APIRouter, Depends
from app.api.auth import verify_supabase_token
from app.core.supabase import supabase

router = APIRouter()

@router.get("/my-saved-recipes")
async def get_my_saved_recipes(user_id: str = Depends(verify_supabase_token)):
     # user id is guaranteed to be safe and accurate because the jwt was verified
     
     response = supabase.table("saved_recipes").select("*").eq("user_id", user_id).execute()
     
     return {"saved_recipes": response.data}