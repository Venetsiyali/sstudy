import { motion } from "framer-motion";
import { PlayCircle, Clock, BookOpen, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CourseCardProps {
    id: number;
    title: string;
    description: string;
    progress: number;
    image?: string;
    moduleCount?: number;
    duration?: string;
    teacher?: string;
}

export function CourseCard({
    id,
    title,
    description,
    progress,
    image,
    moduleCount = 12,
    duration = "6h 30m",
    teacher = "Dr. Antigravity"
}: CourseCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300"
        >
            {/* Image Section */}
            <div className="aspect-video w-full bg-slate-100 relative overflow-hidden">
                {image ? (
                    <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-white/50" />
                    </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <Link to={`/course/${id}`}>
                        <Button size="icon" className="h-14 w-14 rounded-full bg-white/90 text-indigo-600 hover:bg-white hover:scale-110 shadow-lg transition-all">
                            <PlayCircle className="h-7 w-7 ml-1" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col p-5 gap-3">
                {/* Metadata */}
                <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                        <span>{moduleCount} Modules</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        <Clock className="h-3.5 w-3.5 text-indigo-500" />
                        <span>{duration}</span>
                    </div>
                </div>

                {/* Title & Teacher */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                        {title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                        <GraduationCap className="h-4 w-4" />
                        <span>{teacher}</span>
                    </div>
                </div>

                {/* Description (Hidden on smaller cards or succinct) */}
                {/* <p className="text-sm text-slate-500 line-clamp-2">
            {description}
        </p> */}

                {/* Progress Section */}
                <div className="mt-auto pt-4 space-y-2">
                    <div className="flex justify-between items-end text-xs font-medium">
                        <span className="text-slate-600">Progress</span>
                        <span className="text-indigo-600">{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                            className="h-full bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                        />
                    </div>
                </div>

                <Link to={`/course/${id}`} className="mt-4">
                    <Button className="w-full bg-white border-2 border-slate-100 text-slate-700 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 font-semibold transition-all">
                        Continue Learning
                    </Button>
                </Link>
            </div>
        </motion.div>
    );
}
