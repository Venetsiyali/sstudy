import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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
import { isLoggedIn } from "@/data/authStore";

// Admin imports
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminLessons from "@/pages/admin/AdminLessons";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminLayout from "@/components/admin/AdminLayout";
import { isAdminLoggedIn } from "@/data/adminStore";

// ── Student layout ──
function WithSidebar({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <Sidebar />
            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
                <Header />
                <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
            <Toaster />
        </div>
    );
}

// ── Auth guard: redirects to /login if user is not logged in ──
function AuthGuard({ children }: { children: React.ReactNode }) {
    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }
    return <WithSidebar>{children}</WithSidebar>;
}

// ── Admin guard ──
function AdminGuard({ children }: { children: React.ReactNode }) {
    if (!isAdminLoggedIn()) {
        return <Navigate to="/admin/login" replace />;
    }
    return <AdminLayout>{children}</AdminLayout>;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ── Public ── */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* ── Student (protected) ── */}
                <Route path="/" element={<AuthGuard><Dashboard /></AuthGuard>} />
                <Route path="/courses" element={<AuthGuard><MyCourses /></AuthGuard>} />
                <Route path="/course/:id" element={<AuthGuard><CourseLessons /></AuthGuard>} />
                <Route path="/tutor" element={<AuthGuard><TutorPage /></AuthGuard>} />
                <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
                <Route path="/lesson/:id" element={<CoursePlayer />} />

                {/* ── Admin ── */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
                <Route path="/admin/courses" element={<AdminGuard><AdminCourses /></AdminGuard>} />
                <Route path="/admin/courses/:id" element={<AdminGuard><AdminLessons /></AdminGuard>} />
                <Route path="/admin/users" element={<AdminGuard><AdminUsers /></AdminGuard>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
