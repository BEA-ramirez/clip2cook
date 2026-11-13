import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise SystemExit("GROQ_API_KEY not found in .env")

r = requests.get(
    "https://api.groq.com/openai/v1/models",
    headers={"Authorization": f"Bearer {api_key}"},
)
r.raise_for_status()

models = r.json().get("data", [])
print(f"Available Groq models ({len(models)}):\n")
for m in models:
    print(f"  {m['id']}")