import { motion } from "framer-motion";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, TrendingUp, Award, Clock, Zap } from "lucide-react";

const mockCourses = [
    {
        id: 1,
        title: "Advanced Python for AI Development",
        description: "Master Python and build you own AI models from scratch.",
        progress: 78,
        moduleCount: 14,
        duration: "12h 40m",
        image: "https://images.unsplash.com/photo-1526379095098-d400fdbfbf63?auto=format&fit=crop&q=80&w=800",
        teacher: "Dr. Sarah Chen"
    },
    {
        id: 2,
        title: "Full-Stack React & Next.js 14",
        description: "Build modern web applications with the latest tech stack.",
        progress: 42,
        moduleCount: 20,
        duration: "24h 15m",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
        teacher: "Alex Johnson"
    },
    {
        id: 3,
        title: "Data Science & Analytics Bundle",
        description: "Learn statistics, pandas, and matplotlib for data analysis.",
        progress: 5,
        moduleCount: 8,
        duration: "8h 00m",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
        teacher: "Prof. Michael Brown"
    },
    {
        id: 4,
        title: "Modern UI/UX Design Principles",
        description: "Create beautiful and functional user interfaces.",
        progress: 0,
        moduleCount: 6,
        duration: "5h 45m",
        image: "https://images.unsplash.com/photo-1586717791821-3f44a5638d07?auto=format&fit=crop&q=80&w=800",
        teacher: "Emily Davis"
    }
];

const stats = [
    { label: "O'qish Vaqti", value: "34 soat", icon: Clock, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
    { label: "Sertifikatlar", value: "3", icon: Award, color: "text-purple-600", bg: "bg-purple-50 border-purple-100" },
    { label: "Joriy Streak", value: "12 Kun", icon: Zap, color: "text-amber-500", bg: "bg-amber-50 border-amber-100" },
];

export default function Dashboard() {
    return (
        <div className="space-y-10">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Boshqaruv Paneli</h1>
                    <p className="text-slate-500 mt-2 text-lg">Xush kelibsiz, Talaba! Bugun yangi bilim olishga tayyormisiz?</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                        Hisobotlar
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all">
                        <PlusCircle className="h-4 w-4" />
                        Kurslarni Ko'rish
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-2xl border ${stat.bg} flex items-center justify-between shadow-sm`}
                    >
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-xl bg-white shadow-sm ring-1 ring-black/5`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Continued Learning */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Davom etish</h2>
                        <p className="text-sm text-slate-500">O'qishni to'xtagan joydan davom eting</p>
                    </div>
                    <Button variant="link" className="text-indigo-600 font-semibold">Barchasini ko'rish</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {mockCourses.map((course) => (
                        <CourseCard key={course.id} {...course} />
                    ))}
                </div>
            </div>
        </div>
    );
}
