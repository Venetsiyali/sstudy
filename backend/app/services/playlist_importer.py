import re
import json
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.course import Course, Module, Lesson, VideoSourceType, Language, CourseCategory
from app.services.youtube import get_transcript, generate_summary, generate_smart_chapters

# Note: In a real production environment, we would use the google-api-python-client
# to fetch playlist items. For this implementation, we simulate the fetching
# since an API key is not provided.

async def import_youtube_playlist(
    db: Session,
    playlist_url: str,
    title: str,
    description: str,
    language: Language,
    teacher_id: int,
    video_urls: List[str] # Provided for simulation or fetched via API
) -> Course:
    """
    Imports a YouTube playlist as a Course in the system.
    """
    # 1. Create the Course
    course = Course(
        title=title,
        description=description,
        language=language,
        category=CourseCategory.LANGUAGE_LEARNING,
        teacher_id=teacher_id
    )
    db.add(course)
    db.flush() # Get course ID

    # 2. Create a default module for the playlist
    module = Module(
        course_id=course.id,
        title="Darslar",
        order=1
    )
    db.add(module)
    db.flush()

    # 3. Process videos
    for index, url in enumerate(video_urls):
        lesson_title = f"Dars {index + 1}"
        
        lesson = Lesson(
            module_id=module.id,
            title=lesson_title,
            content=f"Video dars: {lesson_title}",
            video_source_type=VideoSourceType.YOUTUBE,
            video_url=url,
            order=index + 1
        )
        db.add(lesson)
    
    db.commit()
    db.refresh(course)
    return course

def extract_playlist_id(url: str) -> Optional[str]:
    """
    Extracts the playlist ID from a YouTube URL.
    """
    match = re.search(r"list=([a-zA-Z0-9_-]+)", url)
    return match.group(1) if match else None
