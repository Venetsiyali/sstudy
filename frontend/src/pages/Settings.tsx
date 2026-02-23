import { useState } from "react";
import {
    User, Bell, Shield, Globe, Palette, Volume2,
    ChevronRight, Check, Moon, Sun, Monitor,
    BookOpen, Trophy, Zap, Mail, Lock, Eye, EyeOff,
    Camera, LogOut, Trash2
} from "lucide-react";

type Tab = "profil" | "xabarnoma" | "konf" | "maxfiylik";

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "profil", label: "Profil", icon: User },
    { id: "xabarnoma", label: "Xabarnomalar", icon: Bell },
    { id: "konf", label: "Ko'rinish", icon: Palette },
    { id: "maxfiylik", label: "Xavfsizlik", icon: Shield },
];

const languages = ["O'zbek", "English", "Русский", "Deutsch", "Français"];
const themes = [
    { id: "light", label: "Yorug'", icon: Sun },
    { id: "dark", label: "Qorang'i", icon: Moon },
    { id: "system", label: "Tizim", icon: Monitor },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
        <button
            onClick={onChange}
            className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${checked ? "bg-indigo-600" : "bg-slate-200"}`}
        >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${checked ? "translate-x-5" : "translate-x-0"}`} />
        </button>
    );
}

function SectionTitle({ title, desc }: { title: string; desc?: string }) {
    return (
        <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            {desc && <p className="text-sm text-slate-500 mt-0.5">{desc}</p>}
        </div>
    );
}

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 gap-4">
            <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{label}</p>
                {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
            </div>
            <div className="shrink-0">{children}</div>
        </div>
    );
}

export default function Settings() {
    const [activeTab, setActiveTab] = useState<Tab>("profil");

    // Profil state
    const [name, setName] = useState("Student User");
    const [email, setEmail] = useState("student@s-study.uz");
    const [bio, setBio] = useState("S-STUDY platformasida ingliz tilini o'rganmoqdaman.");
    const [lang, setLang] = useState("O'zbek");
    const [saved, setSaved] = useState(false);

    // Notifications
    const [notifs, setNotifs] = useState({
        darsEslatma: true,
        yangiDars: true,
        streak: true,
        xabar: false,
        email: true,
    });

    // Theme
    const [theme, setTheme] = useState("light");
    const [fontSize, setFontSize] = useState("medium");

    // Security
    const [showPass, setShowPass] = useState(false);
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Sozlamalar</h1>
                <p className="text-slate-500 mt-1">Akkauntingiz va platforma sozlamalarini boshqaring</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Side navigation */}
                <aside className="md:w-56 shrink-0">
                    <nav className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2 space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-indigo-600" : "text-slate-400"}`} />
                                {tab.label}
                                {activeTab === tab.id && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-400" />}
                            </button>
                        ))}

                        <div className="border-t border-slate-100 pt-2 mt-2">
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
                                <LogOut className="w-4 h-4" />
                                Chiqish
                            </button>
                        </div>
                    </nav>
                </aside>

                {/* Main content */}
                <main className="flex-1">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                        {/* PROFIL TAB */}
                        {activeTab === "profil" && (
                            <div>
                                <SectionTitle title="Profil Ma'lumotlari" desc="Boshqa o'quvchilar ko'radigan ma'lumotlar" />

                                {/* Avatar */}
                                <div className="flex items-center gap-5 mb-8 p-5 bg-slate-50 rounded-2xl">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                            SU
                                        </div>
                                        <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md hover:bg-indigo-700 transition-colors">
                                            <Camera className="w-3.5 h-3.5 text-white" />
                                        </button>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{name}</p>
                                        <p className="text-sm text-slate-500">{email}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="flex items-center gap-1 text-xs bg-amber-50 text-amber-600 border border-amber-100 px-2.5 py-1 rounded-full font-medium">
                                                <Zap className="w-3 h-3" /> 12 kun streak
                                            </span>
                                            <span className="flex items-center gap-1 text-xs bg-purple-50 text-purple-600 border border-purple-100 px-2.5 py-1 rounded-full font-medium">
                                                <Trophy className="w-3 h-3" /> 3 sertifikat
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Form fields */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">To'liq ism</label>
                                        <input
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
                                        <textarea
                                            value={bio}
                                            onChange={e => setBio(e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            <Globe className="w-4 h-4 inline mr-1.5 text-slate-400" />
                                            Interfeys tili
                                        </label>
                                        <select
                                            value={lang}
                                            onChange={e => setLang(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                                        >
                                            {languages.map(l => <option key={l}>{l}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-50">
                                    <button
                                        onClick={handleSave}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${saved
                                            ? "bg-emerald-500 text-white"
                                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"}`}
                                    >
                                        {saved ? <><Check className="w-4 h-4" /> Saqlandi!</> : "O'zgarishlarni saqlash"}
                                    </button>
                                    <button className="px-5 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-100 transition-all border border-slate-200">
                                        Bekor qilish
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* XABARNOMALAR TAB */}
                        {activeTab === "xabarnoma" && (
                            <div>
                                <SectionTitle title="Xabarnomalar" desc="Qaysi eslatmalarni olishni tanlang" />
                                <div className="divide-y divide-slate-50">
                                    <SettingRow label="Dars eslatmasi" desc="Har kuni o'qish vaqtida eslatma">
                                        <Toggle checked={notifs.darsEslatma} onChange={() => setNotifs(p => ({ ...p, darsEslatma: !p.darsEslatma }))} />
                                    </SettingRow>
                                    <SettingRow label="Yangi darslar" desc="Yangi kurs va darslar qo'shilganda">
                                        <Toggle checked={notifs.yangiDars} onChange={() => setNotifs(p => ({ ...p, yangiDars: !p.yangiDars }))} />
                                    </SettingRow>
                                    <SettingRow label="Streak eslatmasi" desc="Streak uzilmasligini ta'minlash">
                                        <Toggle checked={notifs.streak} onChange={() => setNotifs(p => ({ ...p, streak: !p.streak }))} />
                                    </SettingRow>
                                    <SettingRow label="Xabarlar" desc="Platformadan shaxsiy xabarlar">
                                        <Toggle checked={notifs.xabar} onChange={() => setNotifs(p => ({ ...p, xabar: !p.xabar }))} />
                                    </SettingRow>
                                    <SettingRow label="Email habarnomalar" desc="Muhim yangiliklar emailga">
                                        <Toggle checked={notifs.email} onChange={() => setNotifs(p => ({ ...p, email: !p.email }))} />
                                    </SettingRow>
                                </div>
                            </div>
                        )}

                        {/* KO'RINISH TAB */}
                        {activeTab === "konf" && (
                            <div>
                                <SectionTitle title="Ko'rinish" desc="Platforma ko'rinishini moslashtiring" />

                                <div className="mb-6">
                                    <p className="text-sm font-medium text-slate-700 mb-3">Tema</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {themes.map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => setTheme(t.id)}
                                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${theme === t.id
                                                    ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100"
                                                    : "border-slate-100 hover:border-slate-300 bg-white"}`}
                                            >
                                                <t.icon className={`w-6 h-6 ${theme === t.id ? "text-indigo-600" : "text-slate-400"}`} />
                                                <span className={`text-sm font-medium ${theme === t.id ? "text-indigo-700" : "text-slate-600"}`}>
                                                    {t.label}
                                                </span>
                                                {theme === t.id && <Check className="w-4 h-4 text-indigo-600" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-slate-700 mb-3">Matn o'lchami</p>
                                    <div className="flex gap-3">
                                        {[
                                            { id: "small", label: "Kichik", size: "text-xs" },
                                            { id: "medium", label: "O'rta", size: "text-sm" },
                                            { id: "large", label: "Katta", size: "text-base" },
                                        ].map(opt => (
                                            <button
                                                key={opt.id}
                                                onClick={() => setFontSize(opt.id)}
                                                className={`flex-1 py-3 rounded-xl border-2 transition-all ${fontSize === opt.id
                                                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                                    : "border-slate-100 text-slate-500 hover:border-slate-300"}`}
                                            >
                                                <span className={`font-medium ${opt.size}`}>{opt.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* XAVFSIZLIK TAB */}
                        {activeTab === "maxfiylik" && (
                            <div>
                                <SectionTitle title="Xavfsizlik" desc="Parol va akkaunt xavfsizligi" />

                                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl mb-6 flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-indigo-800">Akkauntingiz himoyalangan</p>
                                        <p className="text-xs text-indigo-600 mt-0.5">Parolingizni muntazam yangilasangiz xavfsizroq bo'ladi</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Joriy parol</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type={showPass ? "text" : "password"}
                                                value={currentPass}
                                                onChange={e => setCurrentPass(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                            />
                                            <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Yangi parol</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type={showPass ? "text" : "password"}
                                                value={newPass}
                                                onChange={e => setNewPass(e.target.value)}
                                                placeholder="Kamida 8 ta belgi"
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                            />
                                        </div>
                                        {newPass.length > 0 && (
                                            <div className="flex gap-1 mt-2">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${newPass.length >= i * 2 ? "bg-indigo-400" : "bg-slate-200"}`} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-all shadow-md shadow-indigo-200 mb-8">
                                    Parolni yangilash
                                </button>

                                {/* Danger zone */}
                                <div className="p-4 border border-red-100 rounded-2xl bg-red-50">
                                    <p className="text-sm font-bold text-red-700 mb-1">Xavfli zona</p>
                                    <p className="text-xs text-red-500 mb-3">Akkauntni o'chirish qaytarib bo'lmaydi</p>
                                    <button className="flex items-center gap-2 text-xs font-medium text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 px-4 py-2 rounded-lg transition-all bg-white">
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Akkauntni o'chirish
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </main>
            </div>
        </div>
    );
}
