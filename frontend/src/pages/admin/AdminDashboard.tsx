import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, Plus, TrendingUp, BarChart3, Loader2 } from "lucide-react";
import { getCourses, getAllProfiles, type Course, type Profile } from "@/lib/supabase";

export default function AdminDashboard() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        const [c, u] = await Promise.all([getCourses(), getAllProfiles()]);
        setCourses(c); setUsers(u); setLoading(false);
    };

    if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 text-indigo-400 animate-spin" /></div>;

    const stats = [
        { label: "Jami Kurslar", value: courses.length, icon: BookOpen, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
        { label: "Foydalanuvchilar", value: users.length, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        { label: "Adminlar", value: users.filter(u => u.is_admin).length, icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-slate-500 text-sm mt-1">Platformani boshqarish uchun umumiy ko'rinish</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {stats.map(s => (
                    <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
                            <div><p className="text-2xl font-bold text-white">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Link to="/admin/courses" className="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center group-hover:bg-indigo-600/30 transition-colors"><Plus className="w-6 h-6 text-indigo-400" /></div>
                        <div><h3 className="font-bold text-white">Yangi kurs qo'shish</h3><p className="text-xs text-slate-500 mt-0.5">YouTube linklar orqali darslar qo'shing</p></div>
                    </div>
                </Link>
                <Link to="/admin/users" className="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center group-hover:bg-blue-600/30 transition-colors"><Users className="w-6 h-6 text-blue-400" /></div>
                        <div><h3 className="font-bold text-white">Foydalanuvchilar</h3><p className="text-xs text-slate-500 mt-0.5">Foydalanuvchilar ro'yxatini ko'ring</p></div>
                    </div>
                </Link>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                    <h2 className="font-bold text-white">Kurslar</h2>
                    <Link to="/admin/courses" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">Barchasini ko'rish →</Link>
                </div>
                <table className="w-full">
                    <thead><tr className="border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                        <th className="text-left px-6 py-3 font-medium">Kurs</th><th className="text-left px-6 py-3 font-medium">Til</th><th className="text-left px-6 py-3 font-medium">O'qituvchi</th>
                    </tr></thead>
                    <tbody>
                        {courses.slice(0, 5).map(c => (
                            <tr key={c.id} className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-3"><div className="flex items-center gap-3">
                                    <img src={c.thumbnail} alt="" className="w-10 h-7 object-cover rounded-lg" />
                                    <span className="text-sm font-medium text-white truncate max-w-[200px]">{c.title}</span>
                                </div></td>
                                <td className="px-6 py-3 text-sm text-slate-400">{c.language}</td>
                                <td className="px-6 py-3 text-sm text-slate-400">{c.teacher}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
