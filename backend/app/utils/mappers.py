from app.schemas.recipe import RecipeCreate

def map_gemini_to_db_schema(ai_data: dict, source_url: str) -> RecipeCreate:
    """
    Converts the raw AI extraction dict into the strict RecipeCreate 
    Pydantic model required by Supabase / Database.
    """
    # Remove AI-only gatekeeper fields that don't belong in the database
    clean_data = {k: v for k, v in ai_data.items() if k != "is_complete"}

    return RecipeCreate(
        **clean_data,         
        source_url=source_url,
        is_ai_generated=True,
        is_saved=False,       # Remains a draft until the user clicks "Save" in the app
        tags=[]
    )