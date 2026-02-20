import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import Dashboard from "@/pages/Dashboard";
import { CoursePlayer } from "@/pages/CoursePlayer";
import { CourseLessons } from "@/pages/CourseLessons";
import { Toaster } from "@/components/ui/toaster";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Main app with sidebar layout */}
                <Route path="/" element={
                    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
                        <Sidebar />
                        <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
                            <Header />
                            <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
                                <Dashboard />
                            </main>
                        </div>
                        <Toaster />
                    </div>
                } />
                {/* Course lessons list */}
                <Route path="/course/:id" element={
                    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
                        <Sidebar />
                        <div className="flex-1 flex flex-col md:ml-64">
                            <Header />
                            <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
                                <CourseLessons />
                            </main>
                        </div>
                        <Toaster />
                    </div>
                } />
                {/* Lesson player — fullscreen without sidebar padding */}
                <Route path="/lesson/:id" element={<CoursePlayer />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
