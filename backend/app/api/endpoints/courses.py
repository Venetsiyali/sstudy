from typing import Annotated, Any
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
import shutil
import os
import json

from app.api import deps
from app.models.user import User
from app.models.course import Course, Lesson, Module
from app.services.video_processing import extract_audio, generate_video_insights
from app.services.chunking import chunk_text
from app.models.rag import DocumentChunk
from app.services.embeddings import get_embedding

router = APIRouter()

async def process_video_task(lesson_id: int, video_path: str, db_session_maker):
    """
    Background task to process video: Extract Audio -> Insights -> Update DB -> RAG Indexing.
    """
    try:
        # 1. Extract Audio
        audio_path = f"{video_path}.mp3"
        extract_audio(video_path, audio_path)
        
        # 2. Generate Insights with Gemini
        insights = await generate_video_insights(audio_path)
        
        # 3. Update Database (New Session required for background task)
        async with db_session_maker() as db:
            stmt = (
                update(Lesson)
                .where(Lesson.id == lesson_id)
                .values(
                    transcript=insights.get("transcript", ""),
                    key_takeaways=json.dumps(insights.get("key_takeaways", [])),
                    chapters=json.dumps(insights.get("chapters", []))
                )
            )
            await db.execute(stmt)
            
            # 4. Index Transcript for RAG
            transcript = insights.get("transcript", "")
            if transcript:
                chunks = chunk_text(transcript)
                for chunk in chunks:
                    embedding = get_embedding(chunk)
                    db_chunk = DocumentChunk(
                        lesson_id=lesson_id,
                        content=chunk,
                        embedding=embedding
                    )
                    db.add(db_chunk)
            
            await db.commit()
            
        # Cleanup
        if os.path.exists(audio_path):
            os.remove(audio_path)
            
    except Exception as e:
        print(f"Background Task Failed: {e}")

@router.post("/{course_id}/modules/{module_id}/lessons", response_model=Any)
async def create_lesson_with_video(
    course_id: int,
    module_id: int,
    title: str,
    background_tasks: BackgroundTasks,
    db: Annotated[AsyncSession, Depends(deps.get_db)],
    current_user: Annotated[User, Depends(deps.get_current_active_user)],
    file: UploadFile = File(...),
):
    """
    Upload video lesson and trigger background AI processing.
    """
    # 1. Save Video File
    upload_dir = "uploads/videos"
    os.makedirs(upload_dir, exist_ok=True)
    file_location = f"{upload_dir}/{file.filename}"
    
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    
    # 2. Create Lesson Record
    db_lesson = Lesson(
        module_id=module_id,
        title=title,
        content="Video Lesson",
        video_url=file_location,
        order=1 # Simplify for demo
    )
    db.add(db_lesson)
    await db.commit()
    await db.refresh(db_lesson)
    
    # 3. Trigger Background Task
    # We need to pass the session *maker* or manage session lifecycle, 
    # but for simplicity passing a fresh session factory via imports or dependency would be cleaner.
    # Here we import the sessionmaker directly to avoid pickling issues with running session.
    from app.db.session import AsyncSessionLocal
    background_tasks.add_task(process_video_task, db_lesson.id, file_location, AsyncSessionLocal)

    return {"message": "Lesson created. Video processing started in background.", "lesson_id": db_lesson.id}
