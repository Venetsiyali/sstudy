import { ENGLISH_COURSE, ALL_COURSES, type Course, type Lesson } from './courses';

// ─── YouTube helpers ───
export function extractVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const p of patterns) {
        const m = url.match(p);
        if (m) return m[1];
    }
    return null;
}

export function getYoutubeThumbnail(videoId: string): string {
    return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
}

export function getYoutubeEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`;
}

// ─── Admin Auth ───
const ADMIN_CREDENTIALS = {
    email: 'admin@s-study.uz',
    password: 'admin123',
};

export function adminLogin(email: string, password: string): boolean {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('admin_logged_in', 'true');
        localStorage.setItem('admin_login_time', new Date().toISOString());
        return true;
    }
    return false;
}

export function adminLogout(): void {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_login_time');
}

export function isAdminLoggedIn(): boolean {
    return localStorage.getItem('admin_logged_in') === 'true';
}

// ─── Courses CRUD (localStorage) ───
const COURSES_KEY = 'admin_courses';

function getDefaultCourses(): Course[] {
    return JSON.parse(JSON.stringify(ALL_COURSES));
}

export function getAdminCourses(): Course[] {
    const stored = localStorage.getItem(COURSES_KEY);
    if (stored) {
        try { return JSON.parse(stored); } catch { /* ignore */ }
    }
    const defaults = getDefaultCourses();
    localStorage.setItem(COURSES_KEY, JSON.stringify(defaults));
    return defaults;
}

export function saveAdminCourses(courses: Course[]): void {
    localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
}

export function addCourse(course: Omit<Course, 'id' | 'lessons'>): Course {
    const courses = getAdminCourses();
    const newId = Math.max(0, ...courses.map(c => c.id)) + 1;
    const newCourse: Course = { ...course, id: newId, lessons: [] };
    courses.push(newCourse);
    saveAdminCourses(courses);
    return newCourse;
}

export function deleteCourse(id: number): void {
    const courses = getAdminCourses().filter(c => c.id !== id);
    saveAdminCourses(courses);
}

export function addLesson(courseId: number, lesson: Omit<Lesson, 'id'>): Lesson | null {
    const courses = getAdminCourses();
    const course = courses.find(c => c.id === courseId);
    if (!course) return null;
    const newId = Math.max(0, ...course.lessons.map(l => l.id)) + 1;
    const newLesson: Lesson = { ...lesson, id: newId };
    course.lessons.push(newLesson);
    saveAdminCourses(courses);
    return newLesson;
}

export function deleteLesson(courseId: number, lessonId: number): void {
    const courses = getAdminCourses();
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    course.lessons = course.lessons.filter(l => l.id !== lessonId);
    saveAdminCourses(courses);
}

// ─── Users (mock) ───
export interface AppUser {
    id: number;
    name: string;
    email: string;
    registeredAt: string;
    status: 'active' | 'blocked';
    coursesCount: number;
    lastActive: string;
}

const USERS_KEY = 'admin_users';

const DEFAULT_USERS: AppUser[] = [
    { id: 1, name: "Abdulloh Karimov", email: "abdulloh@gmail.com", registeredAt: "2025-12-15", status: "active", coursesCount: 3, lastActive: "Bugun" },
    { id: 2, name: "Malika Toshmatova", email: "malika@mail.ru", registeredAt: "2026-01-20", status: "active", coursesCount: 2, lastActive: "Kecha" },
    { id: 3, name: "Jasur Aliyev", email: "jasur.a@gmail.com", registeredAt: "2026-02-05", status: "active", coursesCount: 1, lastActive: "3 kun oldin" },
    { id: 4, name: "Nilufar Rahimova", email: "nilufar@inbox.uz", registeredAt: "2026-02-18", status: "blocked", coursesCount: 0, lastActive: "1 hafta oldin" },
    { id: 5, name: "Sardor Bekmurodov", email: "sardor.b@gmail.com", registeredAt: "2026-03-01", status: "active", coursesCount: 4, lastActive: "Bugun" },
    { id: 6, name: "Dilorom Yusupova", email: "dilorom@yahoo.com", registeredAt: "2026-03-10", status: "active", coursesCount: 1, lastActive: "2 kun oldin" },
];

export function getAdminUsers(): AppUser[] {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) {
        try { return JSON.parse(stored); } catch { /* ignore */ }
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
}

export function saveAdminUsers(users: AppUser[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function toggleUserStatus(userId: number): void {
    const users = getAdminUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return;
    user.status = user.status === 'active' ? 'blocked' : 'active';
    saveAdminUsers(users);
}
