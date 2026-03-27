import { useState } from "react";
import { getAdminUsers, toggleUserStatus, type AppUser } from "@/data/adminStore";
import { Search, UserCheck, UserX, Users, Shield, MoreVertical } from "lucide-react";

export default function AdminUsers() {
    const [users, setUsers] = useState(getAdminUsers());
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "active" | "blocked">("all");

    const refresh = () => setUsers(getAdminUsers());

    const handleToggle = (userId: number) => {
        toggleUserStatus(userId);
        refresh();
    };

    const filtered = users.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        if (filter === "active") return matchSearch && u.status === "active";
        if (filter === "blocked") return matchSearch && u.status === "blocked";
        return matchSearch;
    });

    const activeCount = users.filter(u => u.status === "active").length;
    const blockedCount = users.filter(u => u.status === "blocked").length;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Foydalanuvchilar</h1>
                <p className="text-slate-500 text-sm mt-1">Platformadagi barcha foydalanuvchilarni boshqaring</p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-white">{users.length}</p>
                        <p className="text-xs text-slate-500">Jami</p>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-white">{activeCount}</p>
                        <p className="text-xs text-slate-500">Faol</p>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
                        <UserX className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-white">{blockedCount}</p>
                        <p className="text-xs text-slate-500">Bloklangan</p>
                    </div>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Ism yoki email bilan qidirish..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="flex gap-2">
                    {(["all", "active", "blocked"] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${filter === f
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-900 border border-slate-800 text-slate-500 hover:text-slate-300"}`}
                        >
                            {f === "all" ? "Barchasi" : f === "active" ? "Faol" : "Bloklangan"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                            <th className="text-left px-6 py-3 font-medium">Foydalanuvchi</th>
                            <th className="text-left px-6 py-3 font-medium">Email</th>
                            <th className="text-left px-6 py-3 font-medium">Ro'yxatdan</th>
                            <th className="text-left px-6 py-3 font-medium">Kurslar</th>
                            <th className="text-left px-6 py-3 font-medium">Oxirgi faollik</th>
                            <th className="text-left px-6 py-3 font-medium">Holat</th>
                            <th className="text-left px-6 py-3 font-medium">Amal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(user => (
                            <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${user.status === "active" ? "bg-indigo-600" : "bg-slate-700"}`}>
                                            {user.name.split(" ").map(w => w[0]).join("").substring(0, 2)}
                                        </div>
                                        <span className="text-sm font-medium text-white">{user.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-400">{user.email}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{user.registeredAt}</td>
                                <td className="px-6 py-4 text-sm text-slate-400">{user.coursesCount}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{user.lastActive}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${user.status === "active"
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-emerald-400" : "bg-red-400"}`} />
                                        {user.status === "active" ? "Faol" : "Bloklangan"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleToggle(user.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${user.status === "active"
                                            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                                            : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"}`}
                                    >
                                        {user.status === "active" ? "Bloklash" : "Faollashtirish"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-slate-500 text-sm">
                                    Hech qanday foydalanuvchi topilmadi
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
