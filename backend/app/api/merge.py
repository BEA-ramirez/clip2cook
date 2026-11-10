from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.api.auth import verify_supabase_token
from app.core.supabase import supabase

router = APIRouter()

class MergeRequest(BaseModel):
     anonymous_user_id: str

@router.post("/merge-anonymous")
async def merge_anonymous_recipes(body: MergeRequest, current_user_id: str = Depends(verify_supabase_token),):
     
     # 1. Sanity check: current user must NOT be the anonymous one
     if current_user_id == body.anonymous_user_id:
          raise HTTPException(status_code=400, detail="Cannot merge into the same user.")

     # 2. Reassign recipes
     update_resp = (
          supabase.table("recipes")
          .update({"user_id": current_user_id})
          .eq("user_id", body.anonymous_user_id)
          .execute()
     )

     # 3. (Optional) delete the orphaned anonymous auth user
     #    Requires service-role; `supabase.auth.admin.delete_user` works with the service key.
     try:
          supabase.auth.admin.delete_user(body.anonymous_user_id)
     except Exception as e:
          # Log but don't fail the merge if cleanup fails
          print(f"Failed to delete anonymous user: {e}")

     return {
          "status": "success",
          "moved_recipes": len(update_resp.data or []),
          "from": body.anonymous_user_id,
          "to": current_user_id,
     }