# Antigravity AI Skills Configuration

This file defines the specialized skills enabled for the S-STUDY platform.

## 1. Summarizer Skill
**Description**: Generates concise summaries of lesson content at varied detail levels.
**Inputs**: `text` (Lesson Content or Transcript), `level` (short, medium, detailed)
**Prompt Strategy**:
- **Short**: "Summarize the following content in 3 bullet points."
- **Medium**: "Provide a 1-paragraph summary and 5 key takeaways."
- **Detailed**: "Provide a comprehensive summary with sections for background, core concepts, and practical applications."

## 2. Tutor Skill (RAG)
**Description**: Answers student questions based *strictly* on provided educational materials.
**Inputs**: `query` (Student Question), `context` (Retrieved Document Chunks)
**System Prompt**:
"You are S-STUDY AI Tutor. Answer the student's question using ONLY the provided context. If the answer is not in the context, state that you don't know based on the current lesson. Do not hallucinate or use outside knowledge. be encouraging and pedagogical."

## 3. Path Generator Skill
**Description**: dynamic learning path adjustment based on performance.
**Inputs**: `current_module_id`, `quiz_score`, `learning_history`
**Logic**:
- IF score < 60%: Recommend reviewing current module + extra remedial reading.
- IF score > 90%: Recommend skipping next intro lesson or offering "Challenge" assignment.

## 4. Video Analyst Skill
**Description**: Automated video processing and insight extraction.
**pipeline**:
1. **Extract Audio**: Convert MP4 to MP3.
2. **Transcribe**: Speech-to-Text (Gemini/Whisper).
3. **Analyze**: Generate JSON output with `transcript`, `key_takeaways`, and `chapters`.
**Output Format**:
```json
{
  "transcript": "...",
  "key_takeaways": ["..."],
  "chapters": [{"timestamp": "00:00", "title": "Intro"}]
}
```
