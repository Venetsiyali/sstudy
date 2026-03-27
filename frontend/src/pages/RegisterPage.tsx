import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "@/data/authStore";
import { GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle, User, ArrowRight, Check } from "lucide-react";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const passwordStrength = password.length === 0 ? 0 : password.length < 4 ? 1 : password.length < 8 ? 2 : password.length < 12 ? 3 : 4;
    const passwordsMatch = password.length > 0 && password === confirmPass;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!name.trim()) return setError("Ism kiriting");
        if (password !== confirmPass) return setError("Parollar mos kelmaydi");

        setLoading(true);
        setTimeout(() => {
            const result = register(name, email, password);
            if (result.ok) {
                navigate("/");
            } else {
                setError(result.error || "Xatolik yuz berdi");
            }
            setLoading(false);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 mb-4">
                        <GraduationCap className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Ro'yxatdan o'tish</h1>
                    <p className="text-slate-500 text-sm mt-1">S-STUDY'da bepul hisob yarating</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-xl shadow-slate-200/50">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">To'liq ism</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Sardor Karimov"
                                    required
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="email@example.com"
                                    required
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Parol</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Kamida 4 ta belgi"
                                    required
                                    className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {/* Strength bar */}
                            {password.length > 0 && (
                                <div className="flex gap-1 mt-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                                            passwordStrength >= i
                                                ? i <= 1 ? "bg-red-400" : i <= 2 ? "bg-amber-400" : "bg-emerald-400"
                                                : "bg-slate-200"
                                        }`} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Confirm password*/}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Parolni tasdiqlang</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={confirmPass}
                                    onChange={e => setConfirmPass(e.target.value)}
                                    placeholder="Parolni qayta kiriting"
                                    required
                                    className={`w-full pl-11 pr-11 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all ${
                                        confirmPass.length > 0
                                            ? passwordsMatch ? "border-emerald-300 bg-emerald-50/50" : "border-red-300 bg-red-50/50"
                                            : "border-slate-200"
                                    }`}
                                />
                                {passwordsMatch && (
                                    <Check className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !passwordsMatch}
                            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Ro'yxatdan o'tish <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-500">
                            Allaqachon hisobingiz bormi?{" "}
                            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                                Kirish
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-slate-400 text-xs mt-6">© 2026 S-STUDY Ta'lim Platformasi</p>
            </div>
        </div>
    );
}
