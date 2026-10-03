import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.supabase import supabase  

security = HTTPBearer()

def verify_supabase_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
     """
     Verifies the Supabase JWT by asking the Supabase server directly, 
     bypassing the need for manual PyJWT cryptography!
     """
     token = credentials.credentials
     try:
          # Let the official Supabase client decode and verify the token
          user_response = supabase.auth.get_user(token)
          
          if not user_response or not user_response.user:
               raise HTTPException(
                    status_code=401, 
                    detail="Invalid token: User not found"
               )
               
          # Return the user's ID
          return user_response.user.id
          
     except Exception as e:
          print(f"🚨 Supabase Auth Error: {str(e)}")
          raise HTTPException(
               status_code=status.HTTP_401_UNAUTHORIZED,
               detail="Invalid or expired authentication token",
          )