from typing import Annotated, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.core import security
from app.models.user import User
from app.schemas.user import UserCreate, User as UserSchema

router = APIRouter()

@router.post("/register", response_model=UserSchema)
async def register_user(
    user_in: UserCreate,
    db: Annotated[AsyncSession, Depends(deps.get_db)]
) -> Any:
    """
    Create new user without the need to be logged in.
    """
    statement = select(User).where(User.email == user_in.email)
    result = await db.execute(statement)
    user = result.scalars().first()
    
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    
    user_obj = User(
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role,
        is_active=user_in.is_active,
    )
    db.add(user_obj)
    await db.commit()
    await db.refresh(user_obj)
    return user_obj

@router.get("/me", response_model=UserSchema)
async def read_user_me(
    current_user: Annotated[User, Depends(deps.get_current_active_user)]
) -> Any:
    """
    Get current user.
    """
    return current_user
