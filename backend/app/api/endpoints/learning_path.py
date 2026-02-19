from typing import Annotated, Any
from fastapi import APIRouter, Depends, Body
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.models.user import User
from app.services.adaptive_learning import generate_adaptive_path

router = APIRouter()

@router.post("/generate", response_model=Any)
async def get_learning_path(
    db: Annotated[AsyncSession, Depends(deps.get_db)],
    current_user: Annotated[User, Depends(deps.get_current_active_user)],
    current_module_id: int = Body(..., embed=True),
    score: float = Body(..., embed=True),
):
    """
    Generate an adaptive learning path based on quiz performance.
    """
    result = await generate_adaptive_path(db, current_module_id, score)
    return result
