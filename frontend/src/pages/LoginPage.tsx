import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { signIn } from "@/lib/supabase";
import { GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await signIn(email, password);
        if (result.ok) {
            navigate(redirectTo);
        } else {
            setError(result.error || "Xatolik yuz berdi");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 mb-4">
                        <GraduationCap className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">S-STUDY'ga kirish</h1>
                    <p className="text-slate-500 text-sm mt-1">Hisobingizga kiring va o'rganishni davom ettiring</p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-xl shadow-slate-200/50">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" required
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Parol</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                                    className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all" />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-2">
                            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Kirish <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-500">Hisobingiz yo'qmi? <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">Ro'yxatdan o'ting</Link></p>
                    </div>
                </div>
                <p className="text-center text-slate-400 text-xs mt-6">© 2026 S-STUDY Ta'lim Platformasi</p>
            </div>
        </div>
    );
}
