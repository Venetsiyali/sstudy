import { useParams, Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { AITutorSidebar } from "@/components/AITutorSidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Zap } from "lucide-react"

// Helper: YouTube URL'dan video ID'sini olish
function getYouTubeId(url: string): string | null {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}

export function CoursePlayer() {
    const { id } = useParams()
    const [context, setContext] = useState<any>(null);
    // playerRef is kept for future seek functionality if needed
    const playerRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        setTimeout(() => {
            setContext({
                title: `Dars ${id}`,
                content: "Bu darsda biz React asoslarini o'rganamiz.",
                video_url: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
                summary: "Bu darsda biz React asoslarini o'rganamiz. Komponentlar va state haqida gaplashamiz.",
                vocabulary: [
                    { word: "State", translation: "Holat", context: "State is an object that holds information." },
                    { word: "Props", translation: "Xususiyatlar", context: "Props are used to pass data." }
                ],
                quiz: [
                    { question: "State nima?", options: ["Ob'ekt", "Funksiya", "Massiv", "Klass"], answer: "Ob'ekt" }
                ],
                chapters: [
                    { timestamp: 0, title: "Kirish" },
                    { timestamp: 120, title: "State haqida" }
                ]
            });
        }, 500);
    }, [id]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }

    const videoId = getYouTubeId(context?.video_url);

    return (
        <div className="flex h-screen bg-background">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="h-14 border-b flex items-center px-4 bg-card shrink-0">
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Kursga qaytish
                        </Link>
                    </Button>
                    <h1 className="ml-4 font-semibold text-lg">{context?.title || `Dars ${id}`}</h1>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <div className="max-w-5xl mx-auto space-y-8">

                        {/* Video Player Section */}
                        <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10">
                            <div className="aspect-video">
                                {videoId ? (
                                    <iframe
                                        ref={playerRef}
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        className="w-full h-full"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                                        <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                                            </svg>
                                        </div>
                                        <p className="font-medium text-sm">Video yuklanmagan</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Smart Indexing (Chapters) */}
                        {context?.chapters && context.chapters.length > 0 && (
                            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
                                    Video Mundarijasi (Smart Indexing)
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {context.chapters.map((chapter: any, index: number) => (
                                        <a
                                            key={index}
                                            href={`https://www.youtube.com/watch?v=${videoId}&t=${chapter.timestamp}s`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 hover:shadow-sm transition-all text-left"
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white border border-slate-200 text-xs font-bold text-indigo-600 shadow-sm">
                                                {formatTime(chapter.timestamp)}
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">{chapter.title}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Lesson Summary */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900">Dars Xulosasi (AI Summary)</h2>
                            {context?.summary ? (
                                <p className="text-slate-600 leading-relaxed p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
                                    {context.summary}
                                </p>
                            ) : (
                                <p className="text-slate-500 italic">Xulosa yuklanmoqda...</p>
                            )}

                            {/* Vocabulary Section */}
                            {context?.vocabulary && context.vocabulary.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <span className="p-1 rounded-md bg-amber-100 text-amber-600">📜</span>
                                        Yangi so'zlar ro'yxati
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {context.vocabulary.map((item: any, i: number) => (
                                            <div key={i} className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col gap-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-lg font-bold text-indigo-600">{item.word}</span>
                                                    <span className="text-sm font-medium text-slate-400">/ {item.translation}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 italic">"{item.context}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quiz Section */}
                            {context?.quiz && context.quiz.length > 0 && (
                                <div className="mt-12 p-8 rounded-3xl bg-slate-900 text-white shadow-2xl overflow-hidden relative">
                                    <div className="relative z-10">
                                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                            <Zap className="text-amber-400" />
                                            Dars bo'yicha test savollari
                                        </h3>
                                        <div className="space-y-8">
                                            {context.quiz.map((q: any, i: number) => (
                                                <div key={i} className="space-y-4">
                                                    <p className="text-lg font-medium text-slate-200">{i + 1}. {q.question}</p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {q.options.map((opt: string) => (
                                                            <button
                                                                key={opt}
                                                                className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-indigo-600/40 text-left transition-all"
                                                            >
                                                                {opt}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                                </div>
                            )}

                            <h3 className="text-xl font-bold text-slate-900 mt-12 mb-4">Qo'shimcha Materiallar</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {context?.content || "Dars mazmuni yuklanmoqda..."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar: AI Tutor */}
            <AITutorSidebar context={context} />
        </div>
    )
}
