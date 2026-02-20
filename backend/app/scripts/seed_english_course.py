"""
Seed script: "Ingliz tilini 0 dan o'rganish" kursi uchun real darslarni bazaga qo'shish.
Run from backend directory: python -m app.scripts.seed_english_course
"""
import asyncio
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from app.db.session import AsyncSessionLocal
from app.models.course import Course, Module, Lesson, Language, CourseCategory, VideoSourceType, DifficultyLevel
from sqlalchemy import select

LESSONS = [
    {
        "order": 1,
        "title": "1-dars – Ingliz tili alifbosi (Hayvonlar bilan)",
        "video_url": "https://www.youtube.com/watch?v=vXF_nHbjE0w",
        "content": "Ingliz tilining 26 ta harfini hayvonlar yordamida o'rganamiz. A – Apple, B – Bear, C – Cat...",
    },
    {
        "order": 7,
        "title": "7-dars – Present Simple Questions",
        "video_url": "https://www.youtube.com/watch?v=6icIxa75PcY",
        "content": "Present Simple zamonida savol tuzish qoidalarini o'rganamiz. Do/Does yordamida savollar.",
    },
    {
        "order": 8,
        "title": "8-dars – Present Simple va Present Continuous",
        "video_url": "https://www.youtube.com/watch?v=3_-U78SzHVI",
        "content": "Present Simple va Present Continuous zamonlarining farqini o'rganamiz.",
    },
    {
        "order": 17,
        "title": "17-dars – Present Perfect",
        "video_url": "https://www.youtube.com/watch?v=xk6Nf-L1OYM",
        "content": "Present Perfect zamoni: have/has + V3 qoidasi va qo'llanilishi.",
    },
    {
        "order": 27,
        "title": "27-dars – I'm going to ...",
        "video_url": "https://www.youtube.com/watch?v=H1gZ_EWC2zA",
        "content": "Kelajak rejalarini 'be going to' bilan ifodalashni o'rganamiz.",
    },
    {
        "order": 43,
        "title": "43-dars – Have you … ? / Do they … ?",
        "video_url": "https://www.youtube.com/watch?v=rsijLLBLRsU",
        "content": "Have you ever...? va Do they...? konstruksiyalarini o'rganamiz.",
    },
    {
        "order": 51,
        "title": "51-dars – I want to do vs I enjoy doing",
        "video_url": "https://www.youtube.com/watch?v=KaZDD-rG-h8",
        "content": "Infinitive va Gerund ishlatilishini taqqoslaymiz: to+V vs V+ing.",
    },
    {
        "order": 65,
        "title": "65-dars – Countable and Uncountable Nouns",
        "video_url": "https://www.youtube.com/watch?v=1AikVRwxtr4",
        "content": "Sanaladigan va sanalmaydigan otlarni o'rganamiz. Singular va Plural shakllari.",
    },
    {
        "order": 110,
        "title": "110-dars – When?",
        "video_url": "https://www.youtube.com/watch?v=q9ZNXPvEeWQ",
        "content": "'When' so'zi bilan gaplar tuzishni o'rganamiz.",
    },
]

async def seed():
    async with AsyncSessionLocal() as db:
        # Check if course already exists
        result = await db.execute(
            select(Course).where(Course.title == "Ingliz tilini 0 dan o'rganish")
        )
        existing = result.scalar_one_or_none()
        if existing:
            print(f"✅ Kurs allaqachon mavjud. ID={existing.id}")
            return

        # Create course (teacher_id=1, assuming admin user)
        course = Course(
            title="Ingliz tilini 0 dan o'rganish",
            description="Ibrat Farzandlari bilan ingliz tilini mutlaqo noldan boshlang. Har bir dars o'zbek tilida tushuntiriladi.",
            language=Language.EN,
            category=CourseCategory.LANGUAGE_LEARNING,
            teacher_id=1,
        )
        db.add(course)
        await db.flush()
        print(f"✅ Kurs yaratildi. ID={course.id}")

        # Create one module
        module = Module(
            course_id=course.id,
            title="Asosiy Darslar",
            order=1,
        )
        db.add(module)
        await db.flush()

        # Create lessons
        for lesson_data in LESSONS:
            lesson = Lesson(
                module_id=module.id,
                title=lesson_data["title"],
                content=lesson_data["content"],
                video_source_type=VideoSourceType.YOUTUBE,
                video_url=lesson_data["video_url"],
                order=lesson_data["order"],
                difficulty=DifficultyLevel.BEGINNER,
            )
            db.add(lesson)
            print(f"  📌 Dars qo'shildi: {lesson_data['title']}")

        await db.commit()
        print("\n🎉 Barcha darslar muvaffaqiyatli bazaga yozildi!")

if __name__ == "__main__":
    asyncio.run(seed())
