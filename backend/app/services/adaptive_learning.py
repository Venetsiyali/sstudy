from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.course import Lesson, DifficultyLevel, Module

async def generate_adaptive_path(db: AsyncSession, current_module_id: int, score: float):
    """
    Analyzes the student's score and returns a recommended list of lessons.
    
    Logic:
    - If Score < 60%: Retrieve 'BEGINNER' lessons from the current module and previous module.
    - If Score >= 60%: Retrieve 'INTERMEDIATE' or 'ADVANCED' lessons from the next module.
    """
    
    # Get current module
    result = await db.execute(select(Module).where(Module.id == current_module_id))
    current_module = result.scalars().first()
    
    if not current_module:
        return []

    recommended_lessons = []
    
    if score < 60.0:
        # Performance is low. Recommend remedial content.
        # 1. Beginner lessons in current module
        stmt = (
            select(Lesson)
            .where(Lesson.module_id == current_module_id)
            .where(Lesson.difficulty == DifficultyLevel.BEGINNER)
            .order_by(Lesson.order)
        )
        result = await db.execute(stmt)
        remedial_lessons = result.scalars().all()
        recommended_lessons.extend(remedial_lessons)
        
        # If no beginner lessons found, fallback to reviewing all current module lessons
        if not remedial_lessons:
            stmt = (
                select(Lesson)
                .where(Lesson.module_id == current_module_id)
                .order_by(Lesson.order)
            )
            result = await db.execute(stmt)
            recommended_lessons.extend(result.scalars().all())
            
        message = "We noticed you struggled with this topic. Here are some foundational lessons to review."
        
    else:
        # Performance is good. Proceed to next module or advanced topics.
        # Find next module in the same course
        stmt = (
            select(Module)
            .where(Module.course_id == current_module.course_id)
            .where(Module.order > current_module.order)
            .order_by(Module.order)
        )
        result = await db.execute(stmt)
        next_module = result.scalars().first()
        
        if next_module:
            # Recommend lessons from next module
            stmt = (
                select(Lesson)
                .where(Lesson.module_id == next_module.id)
                .order_by(Lesson.order)
            )
            result = await db.execute(stmt)
            recommended_lessons.extend(result.scalars().all())
            message = "Great job! You're ready for the next module."
        else:
            message = "Congratulations! You have completed the course content."

    return {
        "message": message,
        "recommended_lessons": recommended_lessons
    }
