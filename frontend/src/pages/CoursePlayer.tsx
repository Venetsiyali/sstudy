import { useParams, Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AITutorSidebar } from "@/components/AITutorSidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import { getLessonById, getLessons, getCourses, type Lesson, type Course } from "@/lib/supabase";

export function CoursePlayer() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const courseIdParam = searchParams.get('course');
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [course, setCourse] = useState<Course | null>(null);
    const [courseLessons, setCourseLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLesson();
    }, [id, courseIdParam]);

    const loadLesson = async () => {
        setLoading(true);
        const lessonData = await getLessonById(Number(id));
        setLesson(lessonData);

        if (lessonData) {
            const cId = courseIdParam ? Number(courseIdParam) : lessonData.course_id;
            const courses = await getCourses();
            setCourse(courses.find(c => c.id === cId) || null);
            const lessons = await getLessons(cId);
            setCourseLessons(lessons);
        }
        setLoading(false);
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen"><Loader2 className="w-8 h-8 text-indigo-600 animate-spin" /></div>;
    }

    const currentIdx = courseLessons.findIndex(l => l.id === lesson?.id);
    const prevLesson = currentIdx > 0 ? courseLessons[currentIdx - 1] : null;
    const nextLesson = currentIdx < courseLessons.length - 1 ? courseLessons[currentIdx + 1] : null;
    const backLink = course ? `/course/${course.id}` : '/';

    const context = lesson ? {
        title: lesson.title,
        content: lesson.content,
        video_url: lesson.video_url,
        summary: `Bu darsda "${lesson.title}" mavzusi ko'rib chiqiladi. ${lesson.content}`,
    } : null;

    return (
        <div className="flex h-screen bg-background">
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="h-14 border-b flex items-center px-4 bg-card shrink-0 gap-3">
                    <Button variant="ghost" size="sm" asChild>
                        <Link to={backLink} className="gap-2"><ArrowLeft className="w-4 h-4" /> Darslarga qaytish</Link>
                    </Button>
                    <div className="w-px h-5 bg-slate-200" />
                    <span className="flex items-center gap-1.5 text-sm text-indigo-600 font-medium">
                        <BookOpen className="w-4 h-4" /> {course?.title || "Kurs"}
                    </span>
                    <div className="w-px h-5 bg-slate-200" />
                    <h1 className="font-semibold text-slate-800 text-sm truncate">{lesson?.title || "Yuklanmoqda..."}</h1>
                </header>

                <div className="flex-1 overflow-y-auto scroll-smooth">
                    <div className="bg-slate-950 w-full">
                        <div className="aspect-video max-w-5xl mx-auto">
                            {lesson?.video_id ? (
                                <iframe width="100%" height="100%"
                                    src={`https://www.youtube.com/embed/${lesson.video_id}?rel=0&modestbranding=1&autoplay=1`}
                                    title={lesson.title} frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen className="w-full h-full" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500"><p>Video yuklanmoqda...</p></div>
                            )}
                        </div>
                    </div>

                    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
                        <div className="flex items-center justify-between">
                            {prevLesson ? (
                                <Link to={`/lesson/${prevLesson.id}?course=${course?.id}`} className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                                    <ArrowLeft className="w-4 h-4" /><span className="hidden sm:block truncate max-w-xs">{prevLesson.title}</span>
                                </Link>
                            ) : <div />}
                            {nextLesson && (
                                <Link to={`/lesson/${nextLesson.id}?course=${course?.id}`} className="flex items-center gap-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-all">
                                    Keyingi dars →
                                </Link>
                            )}
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-bold text-slate-900">Dars Xulosasi</h2>
                            <p className="text-slate-600 leading-relaxed p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
                                {context?.summary}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <AITutorSidebar context={context} />
        </div>
    );
}
