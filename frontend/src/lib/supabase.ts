import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Types ───
export interface Profile {
    id: string;
    name: string;
    email: string;
    is_admin: boolean;
    created_at: string;
}

export interface Course {
    id: number;
    title: string;
    description: string;
    language: string;
    teacher: string;
    thumbnail: string;
    created_at: string;
}

export interface Lesson {
    id: number;
    course_id: number;
    lesson_order: number;
    title: string;
    video_id: string;
    video_url: string;
    thumbnail: string;
    content: string;
    created_at: string;
}

export interface UserProgress {
    id: number;
    user_id: string;
    course_id: number;
    lesson_id: number;
    completed_at: string;
}

// ─── YouTube Helpers ───
export function extractVideoId(url: string): string | null {
    if (!url) return null;
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/,
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
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}

// ─── Auth ───
export async function signUp(name: string, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, user: data.user };
}

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };
    return { ok: true, user: data.user };
}

export async function signOut() {
    await supabase.auth.signOut();
}

export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export async function getCurrentProfile(): Promise<Profile | null> {
    const user = await getCurrentUser();
    if (!user) return null;
    const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
    return data;
}

export async function isAdmin(): Promise<boolean> {
    const profile = await getCurrentProfile();
    return profile?.is_admin ?? false;
}

// ─── Courses CRUD ───
export async function getCourses(): Promise<Course[]> {
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) { console.error('getCourses error:', error); return []; }
    return data || [];
}

export async function getCourseWithLessons(courseId: number) {
    const { data: course } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
    
    const { data: lessons } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('lesson_order', { ascending: true });
    
    return { course, lessons: lessons || [] };
}

export async function addCourse(course: Omit<Course, 'id' | 'created_at'>) {
    const { data, error } = await supabase
        .from('courses')
        .insert(course)
        .select()
        .single();
    if (error) { console.error('addCourse error:', error); return null; }
    return data;
}

export async function deleteCourse(id: number) {
    const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
    if (error) console.error('deleteCourse error:', error);
}

// ─── Lessons CRUD ───
export async function getLessons(courseId: number): Promise<Lesson[]> {
    const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('lesson_order', { ascending: true });
    if (error) { console.error('getLessons error:', error); return []; }
    return data || [];
}

export async function addLesson(lesson: Omit<Lesson, 'id' | 'created_at'>) {
    const { data, error } = await supabase
        .from('lessons')
        .insert(lesson)
        .select()
        .single();
    if (error) { console.error('addLesson error:', error); return null; }
    return data;
}

export async function deleteLesson(id: number) {
    const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id);
    if (error) console.error('deleteLesson error:', error);
}

export async function getLessonById(lessonId: number): Promise<Lesson | null> {
    const { data } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();
    return data;
}

// ─── Progress ───
export async function markLessonComplete(courseId: number, lessonId: number) {
    const user = await getCurrentUser();
    if (!user) return;
    
    await supabase
        .from('user_progress')
        .upsert({
            user_id: user.id,
            course_id: courseId,
            lesson_id: lessonId,
        }, { onConflict: 'user_id,lesson_id' });
}

export async function getCourseProgress(courseId: number): Promise<{ completed: number; total: number; percent: number }> {
    const user = await getCurrentUser();
    
    const { count: total } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', courseId);
    
    if (!user) return { completed: 0, total: total || 0, percent: 0 };
    
    const { count: completed } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('course_id', courseId);
    
    const t = total || 0;
    const c = completed || 0;
    return { completed: c, total: t, percent: t > 0 ? Math.round((c / t) * 100) : 0 };
}

export async function isLessonComplete(lessonId: number): Promise<boolean> {
    const user = await getCurrentUser();
    if (!user) return false;
    
    const { count } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId);
    
    return (count || 0) > 0;
}

// ─── Admin: Users ───
export async function getAllProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) { console.error('getAllProfiles error:', error); return []; }
    return data || [];
}

export async function toggleAdminStatus(userId: string, makeAdmin: boolean) {
    const { error } = await supabase
        .from('profiles')
        .update({ is_admin: makeAdmin })
        .eq('id', userId);
    if (error) console.error('toggleAdminStatus error:', error);
}

// ─── All courses with lessons ───
export async function getAllCoursesWithLessons() {
    const courses = await getCourses();
    const result = [];
    for (const course of courses) {
        const lessons = await getLessons(course.id);
        result.push({ ...course, lessons });
    }
    return result;
}
