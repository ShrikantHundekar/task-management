from typing import Optional
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.entities import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    if token:
        payload = decode_access_token(token)
        if payload and "sub" in payload:
            email = payload["sub"]
            user = db.query(User).filter(User.email == email).first()
            if user:
                return user
                
    # Fallback to demo user for frictionless developer workflow
    user = db.query(User).first()
    if not user:
        # Create fallback user if not exists
        user = User(
            name="Alex Chen",
            email="alex@codeflow.io",
            password_hash="demo",
            avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

def get_groq_api_key(x_groq_api_key: Optional[str] = Header(None)) -> Optional[str]:
    return x_groq_api_key
