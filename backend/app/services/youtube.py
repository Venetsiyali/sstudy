from youtube_transcript_api import YouTubeTranscriptApi
from typing import Optional, List
import re

def extract_video_id(url: str) -> Optional[str]:
    """
    Extracts the video ID from a YouTube URL.
    """
    # Regex for various YouTube URL formats
    regex = r"(?:v=|\/)([0-9A-Za-z_-]{11}).*"
    match = re.search(regex, url)
    if match:
        return match.group(1)
    return None

def generate_summary(transcript: str) -> str:
    """
    Simulates AI summarization of a transcript.
    """
    words = transcript.split()
    if len(words) > 100:
        summary = " ".join(words[:100]) + "..."
    else:
        summary = transcript
    
    return f"Ushbu darsning batafsil tahlili: {summary} Dars davomida asosiy grammatik qoidalar va kundalik hayotda ishlatiladigan iboralar ko'rib chiqildi."

def generate_vocabulary(transcript: str) -> List[dict]:
    """
    Simulates AI extraction of vocabulary from transcript.
    """
    return [
        {"word": "Learning", "translation": "O'rganish", "context": "Learning a new language is fun."},
        {"word": "Practice", "translation": "Amaliyot", "context": "Practice makes perfect."},
        {"word": "Progress", "translation": "Rivojlanish", "context": "You are making great progress."}
    ]

def generate_quiz(transcript: str) -> List[dict]:
    """
    Simulates AI quiz generation from transcript.
    """
    return [
        {
            "question": "Darsda nima haqida gapirildi?",
            "options": ["Til o'rganish", "Matematika", "Fizika", "Tarix"],
            "answer": "Til o'rganish"
        },
        {
            "question": "Muntazam amaliyot nima uchun kerak?",
            "options": ["Yaxshiroq natija uchun", "Vaqt o'tkazish uchun", "Hech nima uchun", "Bilmayman"],
            "answer": "Yaxshiroq natija uchun"
        }
    ]

def generate_smart_chapters(transcript: str) -> List[dict]:
    """
    Simulates AI generation of smart chapters from transcript.
    """
    # This is a placeholder. In a real application, this would involve more complex logic.
    return [
        {"title": "Introduction", "start_time": "0:00"},
        {"title": "Key Concepts", "start_time": "1:30"},
        {"title": "Examples", "start_time": "3:45"},
        {"title": "Conclusion", "start_time": "5:00"}
    ]

def get_transcript(video_url: str) -> Optional[str]:
    """
    Fetches the transcript of a YouTube video.
    Returns the transcript as a single string or None if failed.
    """
    video_id = extract_video_id(video_url)
    if not video_id:
        return None

    try:
        # Fetch transcript
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        
        # Combine text parts
        full_text = " ".join([item['text'] for item in transcript_list])
        return full_text
    except Exception as e:
        print(f"Error fetching transcript for {video_id}: {e}")
        return None

def get_video_metadata(video_url: str) -> dict:
    """
    Mock function to get video metadata since we don't have YouTube Data API key.
    In a real app, use google-api-python-client.
    Here we just attempt to get transcript to verify it works.
    """
    video_id = extract_video_id(video_url)
    return {
        "title": f"YouTube Video ({video_id})", # Placeholder
        "duration": 0, # Placeholder
        "video_id": video_id
    }
