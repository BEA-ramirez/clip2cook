import os
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

load_dotenv()
JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

security = HTTPBearer() # fastapi looks for the Authorization header and extracts the token

def verify_supabase_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str :
     """
     Verifies the Supabase JWT and returns the user's ID (the 'sub' claim).
     """
     token = credentials.credentials
     try:
          # decode and verify token
          # supabase uses hs256 algorithm for JWT
          payload = jwt.decode(
               token,
               JWT_SECRET,
               algorithms=["HS256"],
               audience="authenticated"
          )
          
          # the user's uuid is stored inside the subject's claim
          user_id = payload.get("sub")
          if not user_id:
               raise HTTPException(
                    status_code=401,
                    detail="Invalid token: missing user ID",
               )
          return user_id
     except jwt.ExpiredSignatureError:
          raise HTTPException(
               status_code=status.HTTP_401_UNAUTHORIZED,
               detail="Token has expired",
          )
     except jwt.InvalidTokenError:
          raise HTTPException(
               status_code=status.HTTP_401_UNAUTHORIZED,
               detail="Invalid authentication token",
          )