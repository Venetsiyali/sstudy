from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, ForeignKey, Text, Enum as SQLAEnum
import enum
from app.db.base_class import Base

class AssignmentType(str, enum.Enum):
    QUIZ = "quiz"
    CODING = "coding"
    ESSAY = "essay"

class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, index=True)
    description: Mapped[str] = mapped_column(Text)
    teacher_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    teacher = relationship("User", back_populates="courses_teaching")
    modules = relationship("Module", back_populates="course", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="course")

class Module(Base):
    __tablename__ = "modules"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"))
    title: Mapped[str] = mapped_column(String)
    order: Mapped[int] = mapped_column(Integer)

    course = relationship("Course", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module", cascade="all, delete-orphan")

class DifficultyLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class Lesson(Base):
    __tablename__ = "lessons"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    module_id: Mapped[int] = mapped_column(ForeignKey("modules.id"))
    title: Mapped[str] = mapped_column(String)
    content: Mapped[str] = mapped_column(Text) # Markdown or HTML
    video_url: Mapped[str] = mapped_column(String, nullable=True)
    order: Mapped[int] = mapped_column(Integer)
    
    # AI Generated Content
    transcript: Mapped[str] = mapped_column(Text, nullable=True)
    # Storing JSON as Text for simplicity in this stack, or use JSONB if using specific PG types
    key_takeaways: Mapped[str] = mapped_column(Text, nullable=True) 
    chapters: Mapped[str] = mapped_column(Text, nullable=True)
    
    difficulty: Mapped[DifficultyLevel] = mapped_column(SQLAEnum(DifficultyLevel), default=DifficultyLevel.INTERMEDIATE)

    module = relationship("Module", back_populates="lessons")
    assignments = relationship("Assignment", back_populates="lesson", cascade="all, delete-orphan")
    document_chunks = relationship("DocumentChunk", back_populates="lesson")

class Assignment(Base):
    __tablename__ = "assignments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    lesson_id: Mapped[int] = mapped_column(ForeignKey("lessons.id"))
    title: Mapped[str] = mapped_column(String)
    questions: Mapped[str] = mapped_column(Text) # JSON string or specific question format
    type: Mapped[AssignmentType] = mapped_column(SQLAEnum(AssignmentType))

    lesson = relationship("Lesson", back_populates="assignments")

class Enrollment(Base):
    __tablename__ = "enrollments"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"))
    progress: Mapped[float] = mapped_column(default=0.0)
    
    student = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
