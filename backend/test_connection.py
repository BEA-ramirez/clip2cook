from app.api.supabase import supabase

def test_supabase():
    try:
        # Simple query to check connection
        response = supabase.table("recipes").select("id").limit(1).execute()
        print("Connected to Supabase successfully!")
        print("Response data:", response.data)
    except Exception as e:
        print("Connection failed:", e)

if __name__ == "__main__":
    test_supabase()