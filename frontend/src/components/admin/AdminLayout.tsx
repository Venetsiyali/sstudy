import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Users, LogOut, GraduationCap, ChevronRight } from "lucide-react";
import { adminLogout } from "@/data/adminStore";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: BookOpen, label: "Kurslar", href: "/admin/courses" },
    { icon: Users, label: "Foydalanuvchilar", href: "/admin/users" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        adminLogout();
        navigate("/admin/login");
    };

    return (
        <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">
                {/* Logo */}
                <div className="flex h-16 items-center px-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <span className="block font-bold text-base text-white leading-none">S-STUDY</span>
                            <span className="text-[10px] font-medium text-indigo-400 tracking-wider">ADMIN PANEL</span>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4 space-y-1">
                    <div className="px-3 mb-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Boshqaruv</div>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href ||
                            (item.href !== "/admin" && location.pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${isActive
                                    ? "bg-indigo-600/20 text-indigo-400"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`}
                            >
                                <item.icon className={`h-4.5 w-4.5 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                                {item.label}
                                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-500" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-3 py-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">A</div>
                        <div>
                            <p className="text-sm font-medium text-slate-200">Admin</p>
                            <p className="text-[11px] text-slate-500">admin@s-study.uz</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 border border-slate-700 py-2 text-xs font-medium text-slate-400 hover:text-red-400 hover:border-red-900 hover:bg-red-950/30 transition-colors"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        Chiqish
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 md:ml-64">
                <main className="p-6 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
