import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Trophy, Play, Search, Filter, ChevronRight, Star, Zap, BarChart3, CheckCircle2, Lock } from "lucide-react";
import { ALL_COURSES } from "@/data/courses";

// Merge data/courses with extra mock metadata for richer UI
const enrolledCourses = [
    {
        id: 1,
        title: "Ingliz tilini 0 dan o'rganish",
        teacher: "Ibrat Farzandlari",
        thumbnail: "https://i.ytimg.com/vi/vXF_nHbjE0w/maxresdefault.jpg",
        progress: 11, // 1/9 lessons done
        totalLessons: 9,
        completedLessons: 1,
        language: "🇬🇧 Ingliz tili",
        level: "Boshlang'ich · A1",
        rating: 4.9,
        lastStudied: "Bugun",
        badge: "🔥 Yangi",
        color: "from-indigo-500 to-blue-600",
    },
    {
        id: 2,
        title: "Intermediate English (B1)",
        teacher: "Ibrat Farzandlari",
        thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
        progress: 5,
        totalLessons: 18,
        completedLessons: 1,
        language: "🇬🇧 Ingliz tili",
        level: "O'rta · B1",
        rating: 4.8,
        lastStudied: "3 kun oldin",
        badge: null,
        color: "from-violet-500 to-purple-600",
    },
    {
        id: 3,
        title: "Russian Grammar Basics",
        teacher: "Ibrat Farzandlari",
        thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
        progress: 42,
        totalLessons: 20,
        completedLessons: 8,
        language: "🇷🇺 Rus tili",
        level: "Boshlang'ich · A2",
        rating: 4.7,
        lastStudied: "Kecha",
        badge: "⚡ Faol",
        color: "from-rose-500 to-pink-600",
    },
];

const stats = [
    { label: "Jami Kurslar", value: "3", icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
    { label: "O'qilgan vaqt", value: "34h", icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "Joriy Streak", value: "12 🔥", icon: Zap, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100" },
    { label: "Sertifikatlar", value: "3", icon: Trophy, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
];

const ProgressRing = ({ progress }: { progress: number }) => {
    const r = 20;
    const circ = 2 * Math.PI * r;
    const offset = circ - (progress / 100) * circ;
    return (
        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r={r} fill="none" stroke="#e2e8f0" strokeWidth="4" />
            <circle cx="24" cy="24" r={r} fill="none" stroke="#6366f1" strokeWidth="4"
                strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
                className="transition-all duration-700" />
        </svg>
    );
};

export default function MyCourses() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "active" | "done">("all");

    const filtered = enrolledCourses.filter(c => {
        const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
        if (filter === "active") return matchSearch && c.progress > 0 && c.progress < 100;
        if (filter === "done") return matchSearch && c.progress === 100;
        return matchSearch;
    });

    return (
        <div className="min-h-screen">
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-1">
                    <h1 className="text-3xl font-bold text-slate-900">Mening Kurslarim</h1>
                    <Link to="/" className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                        Ko'proq kurslar <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                <p className="text-slate-500">O'rganishni qayerda qoldirganingizni davom ettiring</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((s) => (
                    <div key={s.label} className={`flex items-center gap-3 p-4 rounded-2xl ${s.bg} border ${s.border}`}>
                        <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                            <s.icon className={`w-5 h-5 ${s.color}`} />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-slate-900">{s.value}</p>
                            <p className="text-xs text-slate-500">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Continue Learning — last active course card */}
            {enrolledCourses[0] && (
                <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-700 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: "radial-gradient(circle at 70% 50%, white 0%, transparent 60%)" }} />
                    <div className="flex items-center gap-5">
                        <img src={enrolledCourses[0].thumbnail} alt="" className="w-20 h-14 object-cover rounded-xl shadow-lg flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-indigo-200 text-xs font-medium mb-1">📚 O'qishni davom ettiring</p>
                            <h3 className="font-bold text-lg leading-tight truncate">{enrolledCourses[0].title}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex-1 h-1.5 bg-white/20 rounded-full">
                                    <div className="h-1.5 bg-white rounded-full" style={{ width: `${enrolledCourses[0].progress}%` }} />
                                </div>
                                <span className="text-xs text-indigo-200">{enrolledCourses[0].progress}%</span>
                            </div>
                        </div>
                        <Link to={`/course/${enrolledCourses[0].id}`}>
                            <button className="flex items-center gap-2 bg-white text-indigo-700 font-bold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm shrink-0">
                                <Play className="w-4 h-4 fill-current" /> Davom et
                            </button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Kurs qidiring..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
                    />
                </div>
                <div className="flex gap-2">
                    {(["all", "active", "done"] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${filter === f
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"}`}
                        >
                            {f === "all" ? "Barchasi" : f === "active" ? "Faol" : "Tugatilgan"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((course) => (
                    <Link
                        key={course.id}
                        to={`/course/${course.id}`}
                        className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                        {/* Thumbnail */}
                        <div className="relative">
                            <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent`} />
                            {course.badge && (
                                <span className="absolute top-3 left-3 text-xs font-bold bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-slate-700">
                                    {course.badge}
                                </span>
                            )}
                            {/* Play button overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
                                    <Play className="w-5 h-5 text-indigo-600 fill-current ml-0.5" />
                                </div>
                            </div>
                            {/* Progress ring */}
                            <div className="absolute bottom-3 right-3">
                                <div className="relative">
                                    <ProgressRing progress={course.progress} />
                                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-indigo-600 rotate-90">
                                        {course.progress}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <div className="flex items-center gap-1.5 mb-2">
                                <span className="text-xs text-slate-500">{course.language}</span>
                                <span className="text-slate-300">·</span>
                                <span className="text-xs text-slate-500">{course.level}</span>
                            </div>
                            <h3 className="font-bold text-slate-900 leading-snug mb-3 group-hover:text-indigo-700 transition-colors">
                                {course.title}
                            </h3>

                            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-50">
                                <div className="flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    {course.completedLessons}/{course.totalLessons} dars
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                                    {course.rating}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {course.lastStudied}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {/* Add Course CTA */}
                <Link to="/" className="group border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-2xl flex flex-col items-center justify-center p-8 gap-3 text-slate-400 hover:text-indigo-600 transition-all hover:bg-indigo-50/50 min-h-[280px]">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                        <p className="font-semibold text-sm">Yangi kurs qo'shish</p>
                        <p className="text-xs mt-1">Dashboarddan kurs tanlang</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
