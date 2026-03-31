import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, getCurrentProfile } from "@/lib/supabase";
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLogin() {
    const navigate = useNavigate();
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
        if (!result.ok) {
            setError(result.error || "Xatolik yuz berdi");
            setLoading(false);
            return;
        }

        // Small delay to ensure auth state is fully propagated
        await new Promise(resolve => setTimeout(resolve, 500));

        // Check if user is admin
        const profile = await getCurrentProfile();
        console.log('Admin login - profile result:', profile);

        if (!profile) {
            setError("Profil topilmadi. Supabase SQL sozlamalarini tekshiring.");
            setLoading(false);
            return;
        }

        if (profile.is_admin !== true) {
            setError("Sizda admin huquqi yo'q. Supabase > profiles jadvalida is_admin = TRUE qilib o'rnating.");
            setLoading(false);
            return;
        }

        navigate("/admin");
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-900/50 mb-4">
                        <Shield className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                    <p className="text-slate-400 text-sm mt-1">S-STUDY boshqaruv paneli</p>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4 shrink-0" />{error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@s-study.uz" required
                                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Parol</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                                    className="w-full pl-11 pr-11 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-900/30 disabled:opacity-50 flex items-center justify-center gap-2">
                            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Kirish <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
