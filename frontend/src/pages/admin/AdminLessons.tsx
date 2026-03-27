import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Play, X, Link as LinkIcon, Loader2 } from "lucide-react";
import { getCourseWithLessons, addLesson, deleteLesson, extractVideoId, getYoutubeThumbnail, getYoutubeEmbedUrl, type Course, type Lesson } from "@/lib/supabase";

export default function AdminLessons() {
    const { id } = useParams();
    const courseId = Number(id);
    const [course, setCourse] = useState<Course | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [previewVideoId, setPreviewVideoId] = useState<string | null>(null);
    const [form, setForm] = useState({ title: "", youtubeUrl: "", content: "" });
    const [urlError, setUrlError] = useState("");

    useEffect(() => { loadData(); }, [courseId]);

    const loadData = async () => {
        setLoading(true);
        const data = await getCourseWithLessons(courseId);
        setCourse(data.course);
        setLessons(data.lessons);
        setLoading(false);
    };

    const handleUrlChange = (url: string) => {
        setForm({ ...form, youtubeUrl: url });
        setUrlError("");
        if (url && !extractVideoId(url)) setUrlError("YouTube URL noto'g'ri formatda");
    };

    const handleAdd = async () => {
        const videoId = extractVideoId(form.youtubeUrl);
        if (!form.title || !videoId) return;
        setSaving(true);

        const order = lessons.length > 0 ? Math.max(...lessons.map(l => l.lesson_order)) + 1 : 1;

        await addLesson({
            course_id: courseId,
            lesson_order: order,
            title: form.title,
            video_id: videoId,
            video_url: form.youtubeUrl,
            thumbnail: getYoutubeThumbnail(videoId),
            content: form.content || form.title,
        });

        setForm({ title: "", youtubeUrl: "", content: "" });
        setShowModal(false);
        setSaving(false);
        loadData();
    };

    const handleDelete = async (lessonId: number) => {
        if (!confirm("Bu darsni o'chirmoqchimisiz?")) return;
        await deleteLesson(lessonId);
        loadData();
    };

    if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 text-indigo-400 animate-spin" /></div>;

    if (!course) {
        return <div className="text-center py-20 text-slate-500"><p>Kurs topilmadi</p><Link to="/admin/courses" className="text-indigo-400 text-sm mt-2 inline-block">← Kurslarga qaytish</Link></div>;
    }

    const videoId = extractVideoId(form.youtubeUrl);

    return (
        <div>
            <div className="mb-8">
                <Link to="/admin/courses" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-400 mb-4 transition-colors"><ArrowLeft className="w-4 h-4" /> Kurslarga qaytish</Link>
                <div className="flex items-center gap-4">
                    <img src={course.thumbnail} alt="" className="w-16 h-11 object-cover rounded-xl" />
                    <div className="flex-1"><h1 className="text-xl font-bold text-white">{course.title}</h1><p className="text-sm text-slate-500">{lessons.length} ta dars</p></div>
                    <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-600/20">
                        <Plus className="w-4 h-4" /> Dars qo'shish
                    </button>
                </div>
            </div>

            {lessons.length === 0 ? (
                <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
                    <Play className="w-10 h-10 text-slate-700 mx-auto mb-3" /><p className="text-slate-500 mb-2">Hozircha darslar yo'q</p>
                    <button onClick={() => setShowModal(true)} className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">+ Birinchi darsni qo'shish</button>
                </div>
            ) : (
                <div className="space-y-3">
                    {lessons.sort((a, b) => a.lesson_order - b.lesson_order).map((lesson, i) => (
                        <div key={lesson.id} className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all group">
                            <span className="text-slate-600 text-xs font-mono w-6 text-center">{i + 1}</span>
                            <div className="relative w-24 h-16 rounded-xl overflow-hidden shrink-0 cursor-pointer" onClick={() => setPreviewVideoId(lesson.video_id)}>
                                <img src={lesson.thumbnail} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Play className="w-5 h-5 text-white fill-current" /></div>
                            </div>
                            <div className="flex-1 min-w-0"><h3 className="text-sm font-medium text-white truncate">{lesson.title}</h3><p className="text-xs text-slate-500 mt-0.5 truncate">{lesson.content}</p></div>
                            <div className="flex items-center gap-2 shrink-0">
                                <a href={lesson.video_url} target="_blank" rel="noreferrer" className="p-2 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-indigo-400 transition-colors"><LinkIcon className="w-3.5 h-3.5" /></a>
                                <button onClick={() => handleDelete(lesson.id)} className="p-2 rounded-lg text-slate-500 hover:bg-red-500/20 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {previewVideoId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setPreviewVideoId(null)}>
                    <div className="w-full max-w-3xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-end mb-2"><button onClick={() => setPreviewVideoId(null)} className="text-white/70 hover:text-white"><X className="w-6 h-6" /></button></div>
                        <div className="aspect-video rounded-2xl overflow-hidden"><iframe src={getYoutubeEmbedUrl(previewVideoId)} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-bold text-white">Yangi dars qo'shish</h2><button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button></div>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-medium text-slate-400 mb-1">Dars nomi *</label>
                                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Masalan: 1-dars – Alifbo"
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                            <div><label className="block text-sm font-medium text-slate-400 mb-1">YouTube URL *</label>
                                <input value={form.youtubeUrl} onChange={e => handleUrlChange(e.target.value)} placeholder="https://www.youtube.com/watch?v=..."
                                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-800 border text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${urlError ? "border-red-500" : "border-slate-700"}`} />
                                {urlError && <p className="text-xs text-red-400 mt-1">{urlError}</p>}
                                {videoId && !urlError && (
                                    <div className="mt-3 rounded-xl overflow-hidden border border-slate-700">
                                        <div className="aspect-video"><iframe src={getYoutubeEmbedUrl(videoId)} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
                                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 text-xs text-emerald-400"><Play className="w-3 h-3" /> Video topildi</div>
                                    </div>
                                )}</div>
                            <div><label className="block text-sm font-medium text-slate-400 mb-1">Dars tavsifi</label>
                                <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Darsning qisqacha tavsifi..." rows={2}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" /></div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={handleAdd} disabled={!form.title || !videoId || saving}
                                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all disabled:opacity-40 flex items-center justify-center gap-2">
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Darsni qo'shish"}
                                </button>
                                <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-700 text-sm text-slate-400 hover:text-white transition-all">Bekor</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
