import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, BookOpen, Eye, X, Globe, Loader2 } from "lucide-react";
import { getCourses, addCourse, deleteCourse, getLessons, extractVideoId, getYoutubeThumbnail, type Course, type Lesson } from "@/lib/supabase";

const LANGUAGES = [
    { code: "en", label: "Ingliz tili", flag: "🇬🇧" },
    { code: "ru", label: "Rus tili", flag: "🇷🇺" },
    { code: "de", label: "Nemis tili", flag: "🇩🇪" },
    { code: "fr", label: "Fransuz tili", flag: "🇫🇷" },
    { code: "uz", label: "O'zbek tili", flag: "🇺🇿" },
];

type CourseWithCount = Course & { lessonCount: number };

export default function AdminCourses() {
    const [courses, setCourses] = useState<CourseWithCount[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ title: "", description: "", language: "en", teacher: "", thumbnailUrl: "" });

    useEffect(() => { loadCourses(); }, []);

    const loadCourses = async () => {
        setLoading(true);
        const data = await getCourses();
        const withCounts = await Promise.all(data.map(async c => {
            const lessons = await getLessons(c.id);
            return { ...c, lessonCount: lessons.length };
        }));
        setCourses(withCounts);
        setLoading(false);
    };

    const handleAdd = async () => {
        if (!form.title || !form.teacher) return;
        setSaving(true);

        let thumbnail = form.thumbnailUrl;
        const vid = extractVideoId(form.thumbnailUrl);
        if (vid) thumbnail = getYoutubeThumbnail(vid);
        if (!thumbnail) thumbnail = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800";

        await addCourse({ title: form.title, description: form.description, language: form.language, teacher: form.teacher, thumbnail });
        setForm({ title: "", description: "", language: "en", teacher: "", thumbnailUrl: "" });
        setShowModal(false);
        setSaving(false);
        loadCourses();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu kursni o'chirmoqchimisiz?")) return;
        await deleteCourse(id);
        loadCourses();
    };

    if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 text-indigo-400 animate-spin" /></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div><h1 className="text-2xl font-bold text-white">Kurslar</h1><p className="text-slate-500 text-sm mt-1">{courses.length} ta kurs mavjud</p></div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-600/20">
                    <Plus className="w-4 h-4" /> Yangi kurs
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map(course => (
                    <div key={course.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-slate-700 transition-all">
                        <div className="relative">
                            <img src={course.thumbnail} alt="" className="w-full h-36 object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                            <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900/80 text-white backdrop-blur">
                                {LANGUAGES.find(l => l.code === course.language)?.flag || "🌐"} {LANGUAGES.find(l => l.code === course.language)?.label || course.language}
                            </span>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-white leading-tight mb-1 truncate">{course.title}</h3>
                            <p className="text-xs text-slate-500 mb-3 line-clamp-2">{course.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500"><BookOpen className="w-3.5 h-3.5 inline mr-1" />{course.lessonCount} ta dars</span>
                                <div className="flex gap-2">
                                    <Link to={`/admin/courses/${course.id}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 text-xs font-medium hover:bg-indigo-600/30 transition-colors">
                                        <Eye className="w-3 h-3" /> Darslar
                                    </Link>
                                    <button onClick={() => handleDelete(course.id)} className="p-1.5 rounded-lg text-slate-500 hover:bg-red-500/20 hover:text-red-400 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-white">Yangi kurs qo'shish</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-medium text-slate-400 mb-1">Kurs nomi *</label>
                                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Masalan: Ingliz tili A2"
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                            <div><label className="block text-sm font-medium text-slate-400 mb-1">Tavsif</label>
                                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Kurs haqida..." rows={2}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-slate-400 mb-1"><Globe className="w-3.5 h-3.5 inline mr-1" /> Til</label>
                                    <select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
                                    </select></div>
                                <div><label className="block text-sm font-medium text-slate-400 mb-1">O'qituvchi *</label>
                                    <input value={form.teacher} onChange={e => setForm({ ...form, teacher: e.target.value })} placeholder="Ism familiya"
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                            </div>
                            <div><label className="block text-sm font-medium text-slate-400 mb-1">Muqova rasm URL</label>
                                <input value={form.thumbnailUrl} onChange={e => setForm({ ...form, thumbnailUrl: e.target.value })} placeholder="https://..."
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={handleAdd} disabled={!form.title || !form.teacher || saving}
                                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all disabled:opacity-40 flex items-center justify-center gap-2">
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Kurs qo'shish"}
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
