import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { AITutorSidebar } from "@/components/AITutorSidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Zap, BookOpen } from "lucide-react"
import { ENGLISH_COURSE, ALL_COURSES, type Lesson } from "@/data/courses"

export function CoursePlayer() {
    const { id } = useParams()
    const [lesson, setLesson] = useState<Lesson | null>(null);

    useEffect(() => {
        // Find lesson by ID from all courses
        let found: Lesson | null = null;
        for (const course of ALL_COURSES) {
            found = course.lessons.find(l => l.id === Number(id)) || null;
            if (found) break;
        }
        // Fallback to first lesson if not found
        if (!found) found = ENGLISH_COURSE.lessons[0];
        setLesson(found);
    }, [id]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }

    // Find adjacent lessons for navigation
    const allLessons = ALL_COURSES.flatMap(c => c.lessons);
    const currentIdx = allLessons.findIndex(l => l.id === lesson?.id);
    const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
    const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

    const context = lesson ? {
        title: lesson.title,
        content: lesson.content,
        video_url: lesson.videoUrl,
        summary: `Bu darsda "${lesson.title}" mavzusi ko'rib chiqiladi. ${lesson.content}`,
        vocabulary: lesson.vocabulary,
        quiz: lesson.quiz,
        chapters: lesson.chapters,
    } : null;

    return (
        <div className="flex h-screen bg-background">
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="h-14 border-b flex items-center px-4 bg-card shrink-0 gap-3">
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/course/1" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Darslarga qaytish
                        </Link>
                    </Button>
                    <div className="w-px h-5 bg-slate-200" />
                    <span className="flex items-center gap-1.5 text-sm text-indigo-600 font-medium">
                        <BookOpen className="w-4 h-4" />
                        Ingliz tili
                    </span>
                    <div className="w-px h-5 bg-slate-200" />
                    <h1 className="font-semibold text-slate-800 text-sm truncate">{lesson?.title || "Yuklanmoqda..."}</h1>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto scroll-smooth">
                    {/* Video Player — full width on top */}
                    <div className="bg-slate-950 w-full">
                        <div className="aspect-video max-w-5xl mx-auto">
                            {lesson?.videoId ? (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${lesson.videoId}?rel=0&modestbranding=1&autoplay=1`}
                                    title={lesson.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="w-full h-full"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500">
                                    <p>Video yuklanmoqda...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

                        {/* Lesson Navigation */}
                        <div className="flex items-center justify-between">
                            {prevLesson ? (
                                <Link to={`/lesson/${prevLesson.id}`} className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                                    <ArrowLeft className="w-4 h-4" />
                                    <span className="hidden sm:block truncate max-w-xs">{prevLesson.title}</span>
                                </Link>
                            ) : <div />}
                            {nextLesson && (
                                <Link to={`/lesson/${nextLesson.id}`} className="flex items-center gap-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-all">
                                    Keyingi dars →
                                </Link>
                            )}
                        </div>

                        {/* Smart Indexing (Chapters) */}
                        {lesson?.chapters && lesson.chapters.length > 0 && (
                            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
                                    Video Mundarijasi
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {lesson.chapters.map((chapter, i) => (
                                        <a
                                            key={i}
                                            href={`https://www.youtube.com/watch?v=${lesson.videoId}&t=${chapter.timestamp}s`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-all"
                                        >
                                            <span className="text-xs font-bold text-indigo-600 font-mono">{formatTime(chapter.timestamp)}</span>
                                            <span className="text-xs font-medium text-slate-700 truncate">{chapter.title}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Summary */}
                        <div className="space-y-3">
                            <h2 className="text-xl font-bold text-slate-900">Dars Xulosasi</h2>
                            <p className="text-slate-600 leading-relaxed p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
                                {context?.summary}
                            </p>
                        </div>

                        {/* Vocabulary */}
                        {lesson?.vocabulary && lesson.vocabulary.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="text-lg">📜</span>
                                    Yangi so'zlar
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {lesson.vocabulary.map((item, i) => (
                                        <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-lg font-bold text-indigo-600">{item.word}</span>
                                                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{item.translation}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 italic">"{item.context}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quiz */}
                        {lesson?.quiz && lesson.quiz.length > 0 && (
                            <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-2xl overflow-hidden relative">
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                        <Zap className="text-amber-400" />
                                        O'zingizni sinab ko'ring
                                    </h3>
                                    <div className="space-y-8">
                                        {lesson.quiz.map((q, i) => (
                                            <div key={i} className="space-y-3">
                                                <p className="font-medium text-slate-200">{i + 1}. {q.question}</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {q.options.map((opt) => (
                                                        <button
                                                            key={opt}
                                                            className="p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-indigo-600/40 text-left text-sm transition-all"
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-32 -mt-32" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Tutor Sidebar */}
            <AITutorSidebar context={context} />
        </div>
    )
}
