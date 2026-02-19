import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Dashboard } from "@/pages/Dashboard"
import { CoursePlayer } from "@/pages/CoursePlayer"

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/course/:id" element={<CoursePlayer />} />
            </Routes>
        </Router>
    )
}

export default App
