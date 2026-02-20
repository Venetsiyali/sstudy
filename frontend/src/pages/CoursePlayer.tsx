import { useParams } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { AITutorSidebar } from "@/components/AITutorSidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ReactPlayer from 'react-player'
import { Link } from "react-router-dom"

export function CoursePlayer() {
    const { id } = useParams()

    const [context, setContext] = useState<any>(null);

    // Mock fetching context
    // In real app: useEffect to fetch from /api/v1/lessons/{id}/context
    useEffect(() => {
        // Simulating API response
        setTimeout(() => {
            setContext({
                title: `Lesson ${id}`,
                content: "Lesson content placeholder...",
                transcript: "Bu darsda biz React asoslarini o'rganamiz. Komponentlar, holat (state) va xususiyatlar (props) haqida gaplashamiz..."
            });
        }, 500);
    }, [id]);

    const playerRef = useRef<ReactPlayer>(null)

    const handleSeek = (seconds: number) => {
        playerRef.current?.seekTo(seconds)
    }

    const formatTime = (seconds: number) => {
        const date = new Date(0);
        date.setSeconds(seconds);
        return date.toISOString().substr(11, 8);
    }

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
                        <div className="relative group bg-slate-900 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10">
                            <div className="aspect-video">
                                <ReactPlayer
                                    ref={playerRef}
                                    url="https://www.youtube.com/watch?v=LXb3EKWsInQ" // Default or from context
                                    width="100%"
                                    height="100%"
                                    controls
                                    config={{
                                        youtube: {
                                            playerVars: { showinfo: 0, modestbranding: 1 }
                                        }
                                    }}
                                />
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
                                        <button
                                            key={index}
                                            onClick={() => handleSeek(chapter.timestamp)}
                                            className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 hover:shadow-sm transition-all text-left"
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white border border-slate-200 text-xs font-bold text-indigo-600 shadow-sm">
                                                {formatTime(chapter.timestamp).substr(3, 5)}
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">{chapter.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Lesson Summary/Content */}
                        <div className="prose prose-slate lg:prose-lg max-w-none">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Dars Xulosasi (AI Summary)</h2>
                            {context?.summary ? (
                                <p className="text-slate-600 leading-relaxed p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
                                    {context.summary}
                                </p>
                            ) : (
                                <p className="text-slate-500 italic">Xulosa yuklanmoqda...</p>
                            )}

                            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Qo'shimcha Materiallar</h3>
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
