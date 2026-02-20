import { useState } from "react";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, Award, Clock, Zap } from "lucide-react";

const mockCourses = [
    {
        id: 1,
        title: "Elementary English (A1)",
        description: "Ingliz tilini noldan o'rganishni boshlang.",
        progress: 78,
        moduleCount: 14,
        duration: "12h 40m",
        image: "https://images.unsplash.com/photo-1543167664-400296413a16?auto=format&fit=crop&q=80&w=800",
        teacher: "Ibrat Farzandlari",
        language: "en"
    },
    {
        id: 2,
        title: "Russian Grammar Basics",
        description: "Rus tili grammatikasining asosiy qoidalari.",
        progress: 42,
        moduleCount: 20,
        duration: "24h 15m",
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
        teacher: "Ibrat Farzandlari",
        language: "ru"
    },
    {
        id: 3,
        title: "Intermediate English (B1)",
        description: "Ingliz tilini keyingi bosqichda davom ettiring.",
        progress: 5,
        moduleCount: 18,
        duration: "18h 00m",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
        teacher: "Ibrat Farzandlari",
        language: "en"
    },
    {
        id: 4,
        title: "Deutsch für Anfänger",
        description: "Nemis tili boshlang'ich kurs.",
        progress: 0,
        moduleCount: 10,
        duration: "10h 00m",
        image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=800",
        teacher: "Ibrat Farzandlari",
        language: "de"
    }
];

const stats = [
    { label: "O'qish Vaqti", value: "34 soat", icon: Clock, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
    { label: "Sertifikatlar", value: "3", icon: Award, color: "text-purple-600", bg: "bg-purple-50 border-purple-100" },
    { label: "Joriy Streak", value: "12 Kun", icon: Zap, color: "text-amber-500", bg: "bg-amber-50 border-amber-100" },
];

const languages = [
    { id: 'en', name: 'Ingliz tili', flag: '🇬🇧' },
    { id: 'ru', name: 'Rus tili', flag: '🇷🇺' },
    { id: 'de', name: 'Nemis tili', flag: '🇩🇪' },
    { id: 'fr', name: 'Fransuz tili', flag: '🇫🇷' },
];

export default function Dashboard() {
    const [selectedLang, setSelectedLang] = useState('en');

    const filteredCourses = mockCourses.filter(c => c.language === selectedLang);

    return (
        <div className="space-y-10">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Language Hub 🌍</h1>
                    <p className="text-slate-500 mt-2 text-lg">"Ibrat Farzandlari" bilan tillarni oson o'rganing!</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                        O'zlashtirish koeffitsienti
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all">
                        <PlusCircle className="h-4 w-4" />
                        Yangisini boshlash
                    </Button>
                </div>
            </div>

            {/* Language Selector Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {languages.map((lang) => (
                    <button
                        key={lang.id}
                        onClick={() => setSelectedLang(lang.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${selectedLang === lang.id
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                            : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'
                            }`}
                    >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                    </button>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <CourseCard key={course.id} {...course} />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-400">Bu til bo'yicha kurshlar hozircha yo'q. Tez orada qo'shiladi!</p>
                    </div>
                )}
            </div>

            {/* Global Stats Section */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold mb-2">Sizning Yutuqlaringiz 🏆</h2>
                        <p className="text-slate-400">Har kuni 15 daqiqa dars qiling va natijani ko'ring!</p>
                    </div>
                    <div className="grid grid-cols-3 gap-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
            </div>
        </div>
    );
}
