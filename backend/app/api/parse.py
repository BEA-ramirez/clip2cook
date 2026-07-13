from fastapi import APIRouter
from app.schemas.recipe import RecipeRequest
from app.services.youtube import process_youtube_url

router = APIRouter()

@router.post("/parse-recipe")
def parse_youtube_link(request: RecipeRequest):
     # pass the validated url to the service layer
     result = process_youtube_url(request.url)

     # return the response to the phone
     return {
          "status": "success",
          "data": result
     }