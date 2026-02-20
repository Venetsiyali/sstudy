import { Home, BookOpen, Bot, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: BookOpen, label: "My Courses", href: "/courses" },
    { icon: Bot, label: "AI Tutor", href: "/tutor" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
    const location = useLocation();

    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-slate-200 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 hidden md:flex flex-col shadow-[1px_0_20px_rgba(0,0,0,0.02)]"
        >
            <div className="flex h-20 items-center px-8 border-b border-slate-100/50">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-indigo-200 shadow-lg">
                        <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <span className="block font-bold text-xl text-slate-900 leading-none tracking-tight">S-STUDY</span>
                        <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase">LMS Platform</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-1.5 px-4 py-8">
                <div className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">Menu</div>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "group relative flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 outline-none",
                                isActive
                                    ? "bg-indigo-50/80 text-indigo-700 shadow-sm"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
                            {item.label}

                            {isActive && (
                                <motion.div
                                    layoutId="active-nav-indicator"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 mt-auto border-t border-slate-100">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                            SU
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-900 truncate">Student User</p>
                            <p className="text-xs text-slate-500 truncate">student@s-study.uz</p>
                        </div>
                    </div>
                    <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors shadow-sm">
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                    </button>
                </div>
            </div>
        </motion.aside>
    );
}
