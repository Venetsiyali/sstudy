import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import Dashboard from "@/pages/Dashboard";
import { CoursePlayer } from "@/pages/CoursePlayer";
import { CourseLessons } from "@/pages/CourseLessons";
import TutorPage from "@/pages/TutorPage";
import MyCourses from "@/pages/MyCourses";
import Settings from "@/pages/Settings";
import { Toaster } from "@/components/ui/toaster";

// Admin imports
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminLessons from "@/pages/admin/AdminLessons";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminLayout from "@/components/admin/AdminLayout";
import { isAdminLoggedIn } from "@/data/adminStore";

// Shared layout with Sidebar + Header
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

// Admin guard — redirects to login if not authenticated
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
                {/* ── Student routes ── */}
                <Route path="/" element={<WithSidebar><Dashboard /></WithSidebar>} />
                <Route path="/courses" element={<WithSidebar><MyCourses /></WithSidebar>} />
                <Route path="/course/:id" element={<WithSidebar><CourseLessons /></WithSidebar>} />
                <Route path="/tutor" element={<WithSidebar><TutorPage /></WithSidebar>} />
                <Route path="/settings" element={<WithSidebar><Settings /></WithSidebar>} />
                <Route path="/lesson/:id" element={<CoursePlayer />} />

                {/* ── Admin routes ── */}
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
