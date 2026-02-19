import google.generativeai as genai
from app.core.config import settings

genai.configure(api_key=settings.GOOGLE_API_KEY)

def get_embedding(text: str) -> list[float]:
    """
    Generate embedding for the given text using Gemini Embedding 001.
    """
    result = genai.embed_content(
        model="models/embedding-001",
        content=text,
        task_type="retrieval_document",
        title="S-STUDY Content"
    )
    return result['embedding']

def get_query_embedding(text: str) -> list[float]:
    """
    Generate embedding for a search query.
    """
    result = genai.embed_content(
        model="models/embedding-001",
        content=text,
        task_type="retrieval_query"
    )
    return result['embedding']
