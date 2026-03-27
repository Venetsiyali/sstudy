import { useState, useEffect } from "react";
import { getAllProfiles, toggleAdminStatus, type Profile } from "@/lib/supabase";
import { Search, UserCheck, UserX, Users, Loader2 } from "lucide-react";

export default function AdminUsers() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        setLoading(true);
        const data = await getAllProfiles();
        setUsers(data);
        setLoading(false);
    };

    const handleToggle = async (userId: string, isAdmin: boolean) => {
        await toggleAdminStatus(userId, !isAdmin);
        loadUsers();
    };

    const filtered = users.filter(u => {
        const s = search.toLowerCase();
        return (u.name || '').toLowerCase().includes(s) || (u.email || '').toLowerCase().includes(s);
    });

    const adminCount = users.filter(u => u.is_admin).length;

    if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 text-indigo-400 animate-spin" /></div>;

    return (
        <div>
            <div className="mb-8"><h1 className="text-2xl font-bold text-white">Foydalanuvchilar</h1><p className="text-slate-500 text-sm mt-1">Platformadagi barcha foydalanuvchilarni boshqaring</p></div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center"><Users className="w-4 h-4 text-blue-400" /></div>
                    <div><p className="text-xl font-bold text-white">{users.length}</p><p className="text-xs text-slate-500">Jami</p></div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center"><UserCheck className="w-4 h-4 text-emerald-400" /></div>
                    <div><p className="text-xl font-bold text-white">{users.length - adminCount}</p><p className="text-xs text-slate-500">Oddiy</p></div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center"><UserX className="w-4 h-4 text-amber-400" /></div>
                    <div><p className="text-xl font-bold text-white">{adminCount}</p><p className="text-xs text-slate-500">Adminlar</p></div>
                </div>
            </div>

            <div className="flex gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Ism yoki email bilan qidirish..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead><tr className="border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                        <th className="text-left px-6 py-3 font-medium">Foydalanuvchi</th>
                        <th className="text-left px-6 py-3 font-medium">Email</th>
                        <th className="text-left px-6 py-3 font-medium">Ro'yxatdan</th>
                        <th className="text-left px-6 py-3 font-medium">Rol</th>
                        <th className="text-left px-6 py-3 font-medium">Amal</th>
                    </tr></thead>
                    <tbody>
                        {filtered.map(user => (
                            <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${user.is_admin ? "bg-amber-600" : "bg-indigo-600"}`}>
                                            {(user.name || '?').split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-white">{user.name || "Nomsiz"}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-400">{user.email}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{new Date(user.created_at).toLocaleDateString('uz')}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${user.is_admin
                                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.is_admin ? "bg-amber-400" : "bg-emerald-400"}`} />
                                        {user.is_admin ? "Admin" : "Talaba"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleToggle(user.id, user.is_admin)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${user.is_admin
                                            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                                            : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20"}`}>
                                        {user.is_admin ? "Admin o'chirish" : "Admin qilish"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-slate-500 text-sm">Hech qanday foydalanuvchi topilmadi</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
