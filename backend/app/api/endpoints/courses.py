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
from app.services.playlist_importer import import_youtube_playlist
from app.models.course import Language

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

@router.post("/import-playlist", response_model=Any)
async def import_playlist_endpoint(
    playlist_url: str,
    title: str,
    description: str,
    language: Language,
    video_urls: List[str], # Explicitly provided for this demo/simulation
    db: Annotated[AsyncSession, Depends(deps.get_db)],
    current_user: Annotated[User, Depends(deps.get_current_active_user)],
):
    """
    Admin endpoint to import a YouTube playlist as a course.
    """
    # Convert AsyncSession to sync Session for the service (or update service to be async)
    # For now, we simulate with the provided urls
    course = await import_youtube_playlist(
        db=db,
        playlist_url=playlist_url,
        title=title,
        description=description,
        language=language,
        teacher_id=current_user.id,
        video_urls=video_urls
    )
    return course

from app.services.youtube import get_transcript, generate_summary, generate_smart_chapters, generate_vocabulary, generate_quiz
import json

@router.get("/lessons/{lesson_id}/context")
async def get_lesson_context(
    lesson_id: int,
    db: Annotated[AsyncSession, Depends(deps.get_db)],
    current_user: Annotated[User, Depends(deps.get_current_active_user)],
) -> Any:
    """
    Get context for a lesson, including YouTube transcript, summary, vocabulary and quiz.
    """
    result = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
    lesson = result.scalar_one_or_none()
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    context = {
        "title": lesson.title,
        "content": lesson.content,
        "video_url": lesson.video_url,
        "transcript": lesson.transcript,
        "summary": lesson.key_takeaways,
        "chapters": json.loads(lesson.chapters) if lesson.chapters else [],
        "vocabulary": json.loads(lesson.vocabulary) if lesson.vocabulary else [],
        "quiz": json.loads(lesson.quiz_questions) if lesson.quiz_questions else []
    }

    if lesson.video_source_type == VideoSourceType.YOUTUBE and lesson.video_url and not lesson.transcript:
        # Fetch and store transcript + AI content in background or real-time for demo
        transcript = get_transcript(lesson.video_url)
        if transcript:
            lesson.transcript = transcript
            lesson.key_takeaways = generate_summary(transcript)
            lesson.chapters = json.dumps(generate_smart_chapters(transcript))
            lesson.vocabulary = json.dumps(generate_vocabulary(transcript))
            lesson.quiz_questions = json.dumps(generate_quiz(transcript))
            
            await db.commit()
            
            context["transcript"] = lesson.transcript
            context["summary"] = lesson.key_takeaways
            context["chapters"] = json.loads(lesson.chapters)
            context["vocabulary"] = json.loads(lesson.vocabulary)
            context["quiz"] = json.loads(lesson.quiz_questions)
    
    return context
