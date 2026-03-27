import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import Dashboard from "@/pages/Dashboard";
import { CoursePlayer } from "@/pages/CoursePlayer";
import { CourseLessons } from "@/pages/CourseLessons";
import TutorPage from "@/pages/TutorPage";
import MyCourses from "@/pages/MyCourses";
import Settings from "@/pages/Settings";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";

// Admin imports
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminLessons from "@/pages/admin/AdminLessons";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase, isAdmin } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

// ── Public Student layout (Sidebar & Header present) ──
function StudentLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <Sidebar />
            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
                <Header />
                <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">{children}</main>
            </div>
            <Toaster />
        </div>
    );
}

// ── Strict Auth Guard for Protected Pages ──
function StrictAuthGuard({ children, session }: { children: React.ReactNode; session: Session | null }) {
    const location = useLocation();
    if (!session) {
        // Encode the current path so we can return after login
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
    }
    // If it's a page that uses the Sidebar (like Settings/Tutor), wrap it in StudentLayout
    // But CoursePlayer doesn't use Sidebar, so we handle that in the route definitions.
    return <>{children}</>;
}

// ── Admin guard ──
function AdminGuardWrapper({ children, session }: { children: React.ReactNode; session: Session | null }) {
    const [checking, setChecking] = useState(true);
    const [isAdminUser, setIsAdminUser] = useState(false);

    useEffect(() => {
        if (!session) { setChecking(false); return; }
        isAdmin().then(v => { setIsAdminUser(v); setChecking(false); });
    }, [session]);

    if (!session) return <Navigate to="/admin/login" replace />;
    if (checking) return <div className="flex items-center justify-center min-h-screen bg-slate-950"><Loader2 className="w-8 h-8 text-indigo-400 animate-spin" /></div>;
    if (!isAdminUser) return <Navigate to="/admin/login" replace />;
    return <AdminLayout>{children}</AdminLayout>;
}

function App() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* ── Auth Pages ── */}
                <Route path="/login" element={session ? <Navigate to="/" replace /> : <LoginPage />} />
                <Route path="/register" element={session ? <Navigate to="/" replace /> : <RegisterPage />} />

                {/* ── Public Student Pages (Accessible to everyone) ── */}
                <Route path="/" element={<StudentLayout><Dashboard /></StudentLayout>} />
                <Route path="/courses" element={<StudentLayout><MyCourses /></StudentLayout>} />
                <Route path="/course/:id" element={<StudentLayout><CourseLessons /></StudentLayout>} />

                {/* ── Protected Student Pages (Require Login) ── */}
                <Route path="/tutor" element={<StrictAuthGuard session={session}><StudentLayout><TutorPage /></StudentLayout></StrictAuthGuard>} />
                <Route path="/settings" element={<StrictAuthGuard session={session}><StudentLayout><Settings /></StudentLayout></StrictAuthGuard>} />
                <Route path="/lesson/:id" element={<StrictAuthGuard session={session}><CoursePlayer /></StrictAuthGuard>} />

                {/* ── Admin ── */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminGuardWrapper session={session}><AdminDashboard /></AdminGuardWrapper>} />
                <Route path="/admin/courses" element={<AdminGuardWrapper session={session}><AdminCourses /></AdminGuardWrapper>} />
                <Route path="/admin/courses/:id" element={<AdminGuardWrapper session={session}><AdminLessons /></AdminGuardWrapper>} />
                <Route path="/admin/users" element={<AdminGuardWrapper session={session}><AdminUsers /></AdminGuardWrapper>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
