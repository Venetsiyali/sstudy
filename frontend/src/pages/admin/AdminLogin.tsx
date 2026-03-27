import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "@/data/adminStore";
import { GraduationCap, Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        setTimeout(() => {
            if (adminLogin(email, password)) {
                navigate("/admin");
            } else {
                setError("Email yoki parol noto'g'ri!");
            }
            setLoading(false);
        }, 600);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/30 mb-4">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">S-STUDY Admin</h1>
                    <p className="text-slate-500 text-sm mt-1">Boshqaruv paneliga kirish</p>
                </div>

                {/* Login card */}
                <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/50 border border-red-900/50 text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="admin@s-study.uz"
                                    required
                                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Parol</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-11 pr-11 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400">
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Tekshirilmoqda...
                                </span>
                            ) : "Kirish"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-slate-600 text-xs mt-6">
                    © 2026 S-STUDY. Barcha huquqlar himoyalangan.
                </p>
            </div>
        </div>
    );
}
