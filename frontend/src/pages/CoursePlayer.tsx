import { useParams } from "react-router-dom"
import { AITutorSidebar } from "@/components/AITutorSidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export function CoursePlayer() {
    const { id } = useParams()

    return (
        <div className="flex h-screen bg-background">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="h-14 border-b flex items-center px-4 bg-card shrink-0">
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Courses
                        </Link>
                    </Button>
                    <h1 className="ml-4 font-semibold text-lg">Course Title - Lesson {id}</h1>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Video Placeholder */}
                        <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-white/50">
                            <span className="text-lg">Video Player Placeholder</span>
                        </div>

                        {/* Lesson Summary/Content */}
                        <div className="prose dark:prose-invert max-w-none">
                            <h2>Lesson Summary</h2>
                            <p>
                                This lesson covers the fundamental concepts of...
                                (Here the text content of the lesson would be displayed,
                                potentially fetched from the RAG chunks or database).
                            </p>
                            <h3>Key Takeaways</h3>
                            <ul>
                                <li>Concept 1</li>
                                <li>Concept 2</li>
                                <li>Concept 3</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar: AI Tutor */}
            <AITutorSidebar />
        </div>
    )
}
