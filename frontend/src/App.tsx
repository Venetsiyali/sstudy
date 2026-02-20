import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import Dashboard from "@/pages/Dashboard";
import { CoursePlayer } from "@/pages/CoursePlayer";
import { CourseLessons } from "@/pages/CourseLessons";
import TutorPage from "@/pages/TutorPage";
import { Toaster } from "@/components/ui/toaster";

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

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<WithSidebar><Dashboard /></WithSidebar>} />
                <Route path="/course/:id" element={<WithSidebar><CourseLessons /></WithSidebar>} />
                <Route path="/tutor" element={<WithSidebar><TutorPage /></WithSidebar>} />
                {/* Lesson player — immersive fullscreen with AI sidebar built-in */}
                <Route path="/lesson/:id" element={<CoursePlayer />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
