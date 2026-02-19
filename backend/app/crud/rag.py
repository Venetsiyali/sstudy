from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.rag import DocumentChunk
from app.models.course import Lesson
from app.services.embeddings import get_embedding, get_query_embedding
from app.services.chunking import chunk_text

async def add_lesson_documents(db: AsyncSession, lesson_id: int, content: str):
    """
    Chunk lesson content, generate embeddings, and save to DB.
    """
    chunks = chunk_text(content)
    for chunk in chunks:
        embedding = get_embedding(chunk)
        db_chunk = DocumentChunk(
            lesson_id=lesson_id,
            content=chunk,
            embedding=embedding
        )
        db.add(db_chunk)
    await db.commit()

async def search_similar_documents(db: AsyncSession, query: str, limit: int = 5):
    """
    Search for documents similar to the query using cosine similarity.
    """
    query_embedding = get_query_embedding(query)
    
    # pgvector's cosine distance operator is <=>
    # We want similarity, so we order by distance ascending (closest first)
    stmt = select(DocumentChunk).order_by(
        DocumentChunk.embedding.cosine_distance(query_embedding)
    ).limit(limit)
    
    result = await db.execute(stmt)
    return result.scalars().all()
