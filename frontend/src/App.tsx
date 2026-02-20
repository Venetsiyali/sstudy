import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import Dashboard from "@/pages/Dashboard";
import CoursePlayer from "@/pages/CoursePlayer";
import { Toaster } from "@/components/ui/toaster"; // Assuming toaster exists or needs install

function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    // Hide sidebar on course player for immersive mode, or keep it. 
    // Let's keep it consistent but maybe collapsed. For now, show everywhere.
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
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/course/:id" element={<CoursePlayer />} />
                    {/* Add other routes as needed */}
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
