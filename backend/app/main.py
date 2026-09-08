
# the entry point. initializes fastapi and cors
from dotenv import load_dotenv
load_dotenv()


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import parse, recipe


# this creates the main app instance that the uvicorn will run
app = FastAPI(
    title="Clip2Cook API",
    description="Backend for the AI Recipe Extractor App",
    version="1.0.0"
)

# this allows the expo frontend to communicate with this backend without security
app.add_middleware(
    CORSMiddleware,
    # in development, "*" allows requests from any origin (e.g., localhost:8081)
    # when you publish the app, you should change this to your specific frontend URL
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],    # allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],    # allows all headers
)
app.include_router(
    recipe.router, 
    prefix="/api/v1/recipes", 
    tags=["Recipes - CRUD"]
)
app.include_router(
    parse.router, 
    prefix="/api/v1/parse", 
    tags=["AI Extraction"]
)

@app.get("/")
async def root():
    """
    A simple health check endpoint to verify the server is running.
    """
    return {
        "status": "success",
        "message": "Clip2Cook API is running!"
    }