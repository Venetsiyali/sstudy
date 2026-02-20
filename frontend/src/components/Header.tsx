import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Header() {
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 bg-white/80 backdrop-blur-md border-b px-6">
            <div className="flex flex-1 items-center gap-4 md:ml-64">
                <div className="relative w-full max-w-md hidden md:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        type="search"
                        placeholder="Search courses..."
                        className="w-full bg-slate-50 pl-9 border-slate-200 focus:bg-white transition-colors"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-700">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </Button>
                <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-sm font-semibold text-slate-900">Student User</span>
                        <span className="text-xs text-slate-500">Free Account</span>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                        SU
                    </div>
                </div>
            </div>
        </header>
    );
}
