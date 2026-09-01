uv run uvicorn app.main:app --reload --host 0.0.0.0

Primary path: youtube-transcript-api -> gemini flash -> mobile app
Fallback path: yt-dlp (audio) -> groq api(text) -> gemini flash -> mobile app

1. How FastAPI Routing Works (Scaling main.py)
   What You Should Do
   You should never write every single GET, POST, PATCH, or DELETE route directly inside main.py. If you did, that file would eventually grow to thousands of lines.

Instead, you keep main.py purely as the "switchboard." You create different router files inside your api folder (like recipes.py, users.py, history.py) and drop them into main.py using app.include_router().

Handling Nested URLs (e.g., /recipes/parse, /recipes/123)
To group related URLs together under a clean prefix, you use the prefix and tags attributes inside your APIRouter.

Here is how you structure a dedicated recipe router file to handle all CRUD (Create, Read, Update, Delete) actions.

Example: app/api/recipes.py
Python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

# 1. We group all routes in this file under the "/recipes" prefix

router = APIRouter(
prefix="/recipes",
tags=["Recipes Management"]
)

# Mock database dictionary for demonstration

MOCK_DB = {}

# Dummy schemas

class RecipeCreate(BaseModel):
url: str

class RecipeUpdate(BaseModel):
title: str
ingredients: list[str]

# --- POST: Create a recipe (URL will be: /recipes/parse) ---

@router.post("/parse")
def parse_recipe(payload: RecipeCreate):
recipe_id = "rec_999"
MOCK_DB[recipe_id] = {"id": recipe_id, "url": payload.url, "title": "Pending Extract"}
return {"status": "created", "data": MOCK_DB[recipe_id]}

# --- GET: Fetch a single recipe (URL will be: /recipes/rec_999) ---

@router.get("/{recipe_id}")
def get_recipe(recipe_id: str):
if recipe_id not in MOCK_DB:
raise HTTPException(status_code=404, detail="Recipe not found")
return {"status": "success", "data": MOCK_DB[recipe_id]}

# --- PATCH: Partially update a recipe (URL will be: /recipes/rec_999) ---

@router.patch("/{recipe_id}")
def update_recipe(recipe_id: str, payload: RecipeUpdate):
if recipe_id not in MOCK_DB:
raise HTTPException(status_code=404, detail="Recipe not found")
MOCK_DB[recipe_id].update(payload.model_dump())
return {"status": "updated", "data": MOCK_DB[recipe_id]}

# --- DELETE: Remove a recipe (URL will be: /recipes/rec_999) ---

@router.delete("/{recipe_id}")
def delete_recipe(recipe_id: str):
if recipe_id not in MOCK_DB:
raise HTTPException(status_code=404, detail="Recipe not found")
del MOCK_DB[recipe_id]
return {"status": "deleted", "message": f"Recipe {recipe_id} was removed"}
How to register it in main.py
You just import this new router and plug it in right next to your old parse router:

Python
from app.api import parse, recipes # Import your new file

app.include_router(parse.router)
app.include_router(recipes.router) # Register it 2. Customizing the Returned Data (The Shape of the Response)
You have 100% complete control over what the frontend receives. In fact, standardizing the response payload is one of the most important things you can do to keep your mobile code from breaking.

You customize it inside your Python code by returning a specific dictionary layout (or a custom Pydantic Schema using FastAPI's response_model).

The Golden Rule of API Responses
Never return a raw, unpredictable block of text or an naked array if you can avoid it. Wrap your responses inside a consistent envelope layout:

Python

# Standardized Success Template

return {
"status": "success", # Always a string: 'success', 'error', 'loading'
"data": { ... }, # The actual object the frontend wants to loop or print
"meta": { "count": 1 } # Extra details like pagination or timestamps
} 3. The Mobile Frontend: How to Call It and What to Expect
When your mobile app runs a network call via JavaScript's native fetch(), it needs to explicitly state the HTTP Method and handle the payload accordingly.

Here is a cheat-sheet showing exactly how you interact with your backend endpoints from React Native:

Frontend CRUD Implementation Example
TypeScript
const BASE_URL = "http://192.168.254.110:8000/recipes";

// ==========================================
// 1. POST (Sending data to create something)
// ==========================================
const createRecipe = async (youtubeUrl: string) => {
const response = await fetch(`${BASE_URL}/parse`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ url: youtubeUrl }) // Must match the Pydantic schema key exactly
});
const result = await response.json();
console.log(result.data.id); // "rec_999"
};

// ==========================================
// 2. GET (Fetching a single specific item using its ID)
// ==========================================
const fetchSingleRecipe = async (id: string) => {
const response = await fetch(`${BASE_URL}/${id}`, {
method: "GET" // GET requests do not take a body property!
});
const result = await response.json();
if (result.status === "success") {
// You handle the customized data shape here!
return result.data;
}
};

// ==========================================
// 3. PATCH (Updating specific details of an existing item)
// ==========================================
const modifyRecipeTitle = async (id: string, newTitle: string) => {
const response = await fetch(`${BASE_URL}/${id}`, {
method: "PATCH",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ title: newTitle, ingredients: ["Sugar", "Spice"] })
});
const result = await response.json();
console.log(result.status); // "updated"
};

// ==========================================
// 4. DELETE (Destroying a record on the backend)
// ==========================================
const permanentDelete = async (id: string) => {
const response = await fetch(`${BASE_URL}/${id}`, {
method: "DELETE" // DELETE requests also don't take a body property
});
const result = await response.json();
console.log(result.message); // "Recipe rec_999 was removed"
};

Let's plan out your backend architecture, address your authentication question, and fill in the missing architectural pieces for your AI pipelines.

1. Authentication Strategy
   Do not build your own JWT system. Since you are using Supabase for your database, you should absolutely use Supabase Auth.

Supabase Auth handles the heavy lifting (Google/Apple login, password resets, token refreshing) and issues standard JWTs. In your FastAPI backend, you simply write a dependency that reads the Authorization header, verifies the Supabase JWT signature, and identifies the user. Furthermore, using Supabase Auth allows you to use PostgreSQL Row Level Security (RLS) to instantly secure your database tables.

2. Database Architecture (Supabase)
   Because recipes have multiple ingredients and steps, a relational SQL structure is perfect. Here is a high-level schema tailored to the UI we built:

users: Extends Supabase's built-in auth. (Columns: id, username, avatar_url).

recipes: The core table. (Columns: id, user_id, title, description, source_url, prep_time, bake_time, temp, yield, image_url, is_ai_generated).

ingredients: Linked to recipes. (Columns: id, recipe_id, qty, unit, name, weight_grams).

instructions: Linked to recipes. (Columns: id, recipe_id, step_number, description).

tags: Linked to recipes for easy filtering. (Columns: id, recipe_id, tag_name).

pantry: For your new generation feature. (Columns: id, user_id, ingredient_name).

3. The AI Pipelines & Missing Tools
   Scraping TikTok, Instagram, and blogs is wildly different from YouTube. Furthermore, AI generation takes time (sometimes 10–30 seconds). You cannot force a mobile app to wait on a standard HTTP request for 30 seconds without risking network timeouts.

The missing tools you need:

An Async Task Queue (Celery or ARQ): When a user clicks "Extract" or "Generate", FastAPI should instantly return a "Job ID" and pass the heavy AI processing to a background worker. The mobile app will use TanStack Query to poll that Job ID until the recipe is ready.

Universal Scraper (yt-dlp): Believe it or not, yt-dlp works wonderfully for downloading metadata and audio from TikTok, Instagram Reels, and Facebook Video, not just YouTube.

Text Scraper (newspaper3k or BeautifulSoup): For traditional food blogs and articles to strip away the ads and extract pure text.

Structured Output Enforcer (Pydantic): When you ask the LLM to generate or extract a recipe, you must force it to return strict JSON that matches your database schema. FastAPI's Pydantic works perfectly with modern LLM structured outputs.

4. FastAPI & TanStack Query Synergy
   To make TanStack Query work beautifully, design your FastAPI endpoints as clean REST resources. TanStack Query thrives on predictable URLs.

GET /api/recipes (TanStack caches as ['recipes'])

GET /api/recipes/{id} (TanStack caches as ['recipe', id])

POST /api/generate (Returns a Job ID, triggering a polling query)

By keeping your routes clean, TanStack Query will automatically handle background refetching, caching, and updating your UI instantly when a user edits a recipe.
