from typing import Annotated, Any
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.crud import rag
from app.services.chunking import extract_text_from_pdf
from app.models.user import User

router = APIRouter()

@router.post("/upload/{lesson_id}")
async def upload_lesson_material(
    lesson_id: int,
    db: Annotated[AsyncSession, Depends(deps.get_db)],
    current_user: Annotated[User, Depends(deps.get_current_active_user)],
    file: UploadFile = File(...),
):
    """
    Upload a PDF or text file for a lesson, chunk it, and store embeddings.
    """
    if file.content_type == "application/pdf":
        content = await file.read()
        text = extract_text_from_pdf(content)
    elif file.content_type == "text/plain":
        content = await file.read()
        text = content.decode("utf-8")
    else:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    await rag.add_lesson_documents(db, lesson_id, text)
    return {"message": "Lesson material processed and indexed successfully."}

@router.post("/ask")
async def ask_question(
    db: Annotated[AsyncSession, Depends(deps.get_db)],
    current_user: Annotated[User, Depends(deps.get_current_active_user)],
    query: str = Form(...),
):
    """
    Ask a question and retrieve relevant document chunks.
    """
    results = await rag.search_similar_documents(db, query)
    return [
        {"content": chunk.content, "lesson_id": chunk.lesson_id} 
        for chunk in results
    ]
