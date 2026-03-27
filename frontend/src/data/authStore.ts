// ─── Auth Store ─── localStorage-based auth + progress tracking

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: string;
    avatar?: string;
}

export interface UserProgress {
    [courseId: number]: {
        completedLessons: number[];
        lastOpenedAt: string;
    };
}

const USERS_KEY = 'auth_users';
const SESSION_KEY = 'auth_session';
const PROGRESS_KEY = 'auth_progress';

// ─── Users CRUD ───
function getUsers(): User[] {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch { return []; }
}

function saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ─── Registration ───
export function register(name: string, email: string, password: string): { ok: boolean; error?: string } {
    const users = getUsers();

    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { ok: false, error: "Bu email allaqachon ro'yxatdan o'tgan" };
    }

    if (password.length < 4) {
        return { ok: false, error: "Parol kamida 4 ta belgidan iborat bo'lishi kerak" };
    }

    const newUser: User = {
        id: Date.now(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password, // In production, this should be hashed!
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Auto-login after registration
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: newUser.id, loginAt: new Date().toISOString() }));
    return { ok: true };
}

// ─── Login ───
export function login(email: string, password: string): { ok: boolean; error?: string } {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

    if (!user) {
        return { ok: false, error: "Bu email bilan foydalanuvchi topilmadi" };
    }

    if (user.password !== password) {
        return { ok: false, error: "Parol noto'g'ri" };
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, loginAt: new Date().toISOString() }));
    return { ok: true };
}

// ─── Logout ───
export function logout(): void {
    localStorage.removeItem(SESSION_KEY);
}

// ─── Session ───
export function getCurrentUser(): User | null {
    try {
        const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
        if (!session?.userId) return null;
        const users = getUsers();
        return users.find(u => u.id === session.userId) || null;
    } catch {
        return null;
    }
}

export function isLoggedIn(): boolean {
    return getCurrentUser() !== null;
}

export function getUserInitials(user: User | null): string {
    if (!user) return "?";
    return user.name
        .split(' ')
        .map(w => w[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
}

// ─── Progress Tracking ───
function getAllProgress(): Record<number, UserProgress> {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); } catch { return {}; }
}

function saveAllProgress(data: Record<number, UserProgress>): void {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
}

export function markLessonComplete(courseId: number, lessonId: number): void {
    const user = getCurrentUser();
    if (!user) return;

    const all = getAllProgress();
    if (!all[user.id]) all[user.id] = {};

    const userProgress = all[user.id];
    if (!userProgress[courseId]) {
        userProgress[courseId] = { completedLessons: [], lastOpenedAt: new Date().toISOString() };
    }

    if (!userProgress[courseId].completedLessons.includes(lessonId)) {
        userProgress[courseId].completedLessons.push(lessonId);
    }
    userProgress[courseId].lastOpenedAt = new Date().toISOString();

    saveAllProgress(all);
}

export function isLessonComplete(courseId: number, lessonId: number): boolean {
    const user = getCurrentUser();
    if (!user) return false;
    const all = getAllProgress();
    return all[user.id]?.[courseId]?.completedLessons?.includes(lessonId) ?? false;
}

export function getCourseProgress(courseId: number, totalLessons: number): number {
    const user = getCurrentUser();
    if (!user || totalLessons === 0) return 0;
    const all = getAllProgress();
    const completed = all[user.id]?.[courseId]?.completedLessons?.length ?? 0;
    return Math.round((completed / totalLessons) * 100);
}

export function getCompletedLessonsCount(courseId: number): number {
    const user = getCurrentUser();
    if (!user) return 0;
    const all = getAllProgress();
    return all[user.id]?.[courseId]?.completedLessons?.length ?? 0;
}

export function getTotalStudyTime(): string {
    const user = getCurrentUser();
    if (!user) return "0";
    const all = getAllProgress();
    const userProgress = all[user.id] || {};
    let total = 0;
    for (const courseId in userProgress) {
        total += userProgress[Number(courseId)]?.completedLessons?.length ?? 0;
    }
    // Rough estimate: 20 min per lesson
    const hours = Math.round((total * 20) / 60);
    return `${hours}h`;
}

export function getTotalCompletedLessons(): number {
    const user = getCurrentUser();
    if (!user) return 0;
    const all = getAllProgress();
    const userProgress = all[user.id] || {};
    let total = 0;
    for (const courseId in userProgress) {
        total += userProgress[Number(courseId)]?.completedLessons?.length ?? 0;
    }
    return total;
}
