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
