import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock } from "lucide-react"
import { Link } from "react-router-dom"

const MOCK_COURSES = [
    {
        id: 1,
        title: "Introduction to Artificial Intelligence",
        description: "Learn the basics of AI, Machine Learning, and Neural Networks.",
        modules: 5,
        duration: "10h 30m"
    },
    {
        id: 2,
        title: "Advanced React Patterns",
        description: "Master React hooks, context, and performance optimization techniques.",
        modules: 8,
        duration: "12h 15m"
    },
    {
        id: 3,
        title: "Python for Data Science",
        description: "Data analysis and visualization using Pandas and Matplotlib.",
        modules: 6,
        duration: "15h 00m"
    }
]

export function CourseList() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_COURSES.map((course) => (
                <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>{course.title}</CardTitle>
                        <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                            <div className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                {course.modules} Modules
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {course.duration}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link to={`/course/${course.id}`}>Start Learning</Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
