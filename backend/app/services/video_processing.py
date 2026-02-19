import os
import moviepy.editor as mp
import google.generativeai as genai
import json
from app.core.config import settings

genai.configure(api_key=settings.GOOGLE_API_KEY)

def extract_audio(video_path: str, output_audio_path: str):
    """
    Extracts audio from a video file and saves it as MP3.
    """
    try:
        video = mp.VideoFileClip(video_path)
        video.audio.write_audiofile(output_audio_path, logger=None)
        video.close()
    except Exception as e:
        print(f"Error extracting audio: {e}")
        raise e

async def generate_video_insights(audio_path: str):
    """
    Uploads audio to Gemini, transcribes it, and generates Key Takeaways & Chapters.
    """
    try:
        # 1. Upload file to Gemini
        # Note: In a real production environment with high scale, we'd handle file cleanup and caching.
        # For this implementation, we upload fresh.
        audio_file = genai.upload_file(path=audio_path)
        
        # 2. Prepare Prompt
        prompt = """
        Listen to this audio lecture carefully.
        1. Generate a verbatim TRANSCRIPT of the audio.
        2. Extract KEY TAKEAWAYS (list of 3-5 main points).
        3. Create AUTO-CHAPTERS (list of objects with 'timestamp' and 'title').
        
        Return the result in the following JSON format ONLY:
        {
            "transcript": "Full text here...",
            "key_takeaways": ["Point 1", "Point 2", ...],
            "chapters": [
                {"timestamp": "00:00", "title": "Introduction"},
                {"timestamp": "05:30", "title": "Topic A"}
            ]
        }
        """
        
        # 3. Generate Content
        model = genai.GenerativeModel('models/gemini-1.5-flash')
        response = model.generate_content([prompt, audio_file])
        
        # 4. Parse JSON
        # Clean up potential markdown formatting ```json ... ```
        text_response = response.text
        if text_response.startswith("```json"):
            text_response = text_response[7:]
        if text_response.endswith("```"):
            text_response = text_response[:-3]
            
        return json.loads(text_response)
        
    except Exception as e:
        print(f"Error generating insights: {e}")
        # Return empty structure on failure to avoid breaking the flow
        return {
            "transcript": "Error processing audio.",
            "key_takeaways": [],
            "chapters": []
        }
