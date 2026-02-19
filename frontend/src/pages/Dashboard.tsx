import { CourseList } from "@/components/CourseList"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

export function Dashboard() {
    return (
        <div className="min-h-screen bg-muted/20">
            <header className="bg-background border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10">
                <div className="font-bold text-xl text-primary">S-STUDY</div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground hidden md:inline-block">Welcome, Student</span>
                    <Button variant="ghost" size="icon">
                        <User className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            <main className="container mx-auto py-8 px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">My Courses</h1>
                    <p className="text-muted-foreground">Continue learning where you left off.</p>
                </div>

                <CourseList />
            </main>
        </div>
    )
}
