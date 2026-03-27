import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, PlayCircle, BookOpen } from "lucide-react"
import { getAdminCourses } from "@/data/adminStore"
import type { Lesson } from "@/data/courses"

const LANG_MAP: Record<string, { flag: string; name: string }> = {
    en: { flag: "🇬🇧", name: "Ingliz tili" },
    ru: { flag: "🇷🇺", name: "Rus tili" },
    de: { flag: "🇩🇪", name: "Nemis tili" },
    fr: { flag: "🇫🇷", name: "Fransuz tili" },
    uz: { flag: "🇺🇿", name: "O'zbek tili" },
};

export function CourseLessons() {
    const { id } = useParams()
    const courses = getAdminCourses()
    const course = courses.find(c => c.id === Number(id)) || courses[0]

    if (!course) {
        return (
            <div className="text-center py-20 text-slate-500">
                <p>Kurs topilmadi</p>
                <Link to="/" className="text-indigo-600 text-sm mt-2 inline-block">← Bosh sahifaga</Link>
            </div>
        )
    }

    const lang = LANG_MAP[course.language] || { flag: "🌐", name: course.language };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link to="/" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Orqaga
                    </Link>
                </Button>
            </div>

            {/* Course Info Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 shadow-2xl">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="text-sm font-medium text-indigo-300 uppercase tracking-widest">{lang.name}</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                    <p className="text-slate-400 text-lg">{course.description}</p>
                    <div className="flex items-center gap-6 mt-4 text-sm text-slate-400">
                        <span>👨‍🏫 {course.teacher}</span>
                        <span>📚 {course.lessons.length} ta dars</span>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl -mr-36 -mt-36" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -ml-24 -mb-24" />
            </div>

            {/* Lessons List */}
            <div className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    Darslar ro'yxati
                </h2>

                {course.lessons.length === 0 ? (
                    <div className="py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-400">Hozircha darslar yo'q. Admin paneldan qo'shing!</p>
                    </div>
                ) : (
                    course.lessons.map((lesson: Lesson) => (
                        <Link
                            key={lesson.id}
                            to={`/lesson/${lesson.id}?course=${course.id}`}
                            className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50 transition-all"
                        >
                            {/* Thumbnail */}
                            <div className="relative w-32 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-900">
                                <img
                                    src={lesson.thumbnail}
                                    alt={lesson.title}
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${lesson.videoId}/hqdefault.jpg`
                                    }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <PlayCircle className="w-5 h-5 text-indigo-600" />
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                        #{lesson.order}-dars
                                    </span>
                                </div>
                                <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors truncate">
                                    {lesson.title}
                                </h3>
                                <p className="text-sm text-slate-500 mt-0.5 truncate">{lesson.content}</p>
                            </div>

                            {/* Arrow */}
                            <div className="shrink-0 text-slate-300 group-hover:text-indigo-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}
