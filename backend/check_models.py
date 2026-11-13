import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

print("Available Gemini models:")
for m in client.models.list():
    # The SDK's Model object exposes the full name via `.name` in most versions,
    # but to be safe, print everything we can see.
    print(m)