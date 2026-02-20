// Real course and lesson data for "Ingliz tilini 0 dan o'rganish"
// Sorted by lesson order number

export interface Lesson {
    id: number;
    order: number;
    title: string;
    videoId: string;
    videoUrl: string;
    thumbnail: string;
    content: string;
    vocabulary?: { word: string; translation: string; context: string }[];
    quiz?: { question: string; options: string[]; answer: string }[];
    chapters?: { timestamp: number; title: string }[];
}

export interface Course {
    id: number;
    title: string;
    description: string;
    language: string;
    teacher: string;
    thumbnail: string;
    lessons: Lesson[];
}

export const ENGLISH_COURSE: Course = {
    id: 1,
    title: "Ingliz tilini 0 dan o'rganish",
    description: "Ibrat Farzandlari bilan ingliz tilini mutlaqo noldan boshlang. Har bir dars o'zbek tilida tushuntiriladi.",
    language: "en",
    teacher: "Ibrat Farzandlari",
    thumbnail: "https://i.ytimg.com/vi/vXF_nHbjE0w/maxresdefault.jpg",
    lessons: [
        {
            id: 1,
            order: 1,
            title: "1-dars – Ingliz tili alifbosi (Hayvonlar bilan)",
            videoId: "vXF_nHbjE0w",
            videoUrl: "https://www.youtube.com/watch?v=vXF_nHbjE0w",
            thumbnail: "https://i.ytimg.com/vi/vXF_nHbjE0w/maxresdefault.jpg",
            content: "Ingliz tilining 26 ta harfini hayvonlar yordamida o'rganamiz.",
            vocabulary: [
                { word: "Alphabet", translation: "Alifbo", context: "The English alphabet has 26 letters." },
                { word: "Letter", translation: "Harf", context: "A is the first letter of the alphabet." },
                { word: "Animal", translation: "Hayvon", context: "A is for Ant, B is for Bear." },
            ],
            quiz: [
                { question: "Ingliz alifbosida nechta harf bor?", options: ["24", "25", "26", "28"], answer: "26" },
                { question: "'B' harfi qaysi hayvon bilan bog'liq?", options: ["Bird", "Bear", "Bat", "Bug"], answer: "Bear" },
            ],
            chapters: [
                { timestamp: 0, title: "Kirish" },
                { timestamp: 60, title: "A-F harflari" },
                { timestamp: 180, title: "G-M harflari" },
                { timestamp: 300, title: "N-Z harflari" },
            ],
        },
        {
            id: 7,
            order: 7,
            title: "7-dars – Present Simple Questions",
            videoId: "6icIxa75PcY",
            videoUrl: "https://www.youtube.com/watch?v=6icIxa75PcY",
            thumbnail: "https://i.ytimg.com/vi/6icIxa75PcY/maxresdefault.jpg",
            content: "Present Simple zamonida savol tuzish qoidalarini o'rganamiz.",
            vocabulary: [
                { word: "Do", translation: "fE'li (savol)", context: "Do you speak English?" },
                { word: "Does", translation: "u/u uchun", context: "Does she live here?" },
                { word: "Question", translation: "Savol", context: "How do you form a question?" },
            ],
            quiz: [
                { question: "He ... play football? (to'g'ri variant)", options: ["do", "does", "is", "are"], answer: "does" },
                { question: "They ... study every day?", options: ["does", "do", "is", "has"], answer: "do" },
            ],
            chapters: [
                { timestamp: 0, title: "Kirish" },
                { timestamp: 90, title: "Do yordamida savollar" },
                { timestamp: 210, title: "Does yordamida savollar" },
                { timestamp: 330, title: "Mashqlar" },
            ],
        },
        {
            id: 8,
            order: 8,
            title: "8-dars – Present Simple va Present Continuous",
            videoId: "3_-U78SzHVI",
            videoUrl: "https://www.youtube.com/watch?v=3_-U78SzHVI",
            thumbnail: "https://i.ytimg.com/vi/3_-U78SzHVI/maxresdefault.jpg",
            content: "Present Simple va Present Continuous zamonlarining farqini o'rganamiz.",
            vocabulary: [
                { word: "Continuous", translation: "Davomiy", context: "I am eating now (continuous action)." },
                { word: "Habit", translation: "Odat", context: "I eat breakfast every day (habit)." },
                { word: "Currently", translation: "Hozir", context: "She is currently studying." },
            ],
            quiz: [
                { question: "Hozir sodir bo'layotgan harakat uchun qaysi zamon?", options: ["Past Simple", "Present Simple", "Present Continuous", "Future Simple"], answer: "Present Continuous" },
            ],
            chapters: [
                { timestamp: 0, title: "Kirish" },
                { timestamp: 120, title: "Present Simple" },
                { timestamp: 250, title: "Present Continuous" },
                { timestamp: 380, title: "Farqlari va mashqlar" },
            ],
        },
        {
            id: 17,
            order: 17,
            title: "17-dars – Present Perfect",
            videoId: "xk6Nf-L1OYM",
            videoUrl: "https://www.youtube.com/watch?v=xk6Nf-L1OYM",
            thumbnail: "https://i.ytimg.com/vi/xk6Nf-L1OYM/maxresdefault.jpg",
            content: "Present Perfect zamoni: have/has + V3 qoidasi va qo'llanilishi.",
            vocabulary: [
                { word: "Have", translation: "Ega bo'lmoq / ko'makchi fe'l", context: "I have seen that movie." },
                { word: "Ever", translation: "Hech qachon / hech bo'lmasa", context: "Have you ever been to London?" },
                { word: "Experience", translation: "Tajriba", context: "I have experience in teaching." },
            ],
            quiz: [
                { question: "Present Perfect ga misol toping:", options: ["I go to school", "I went to school", "I have gone to school", "I will go to school"], answer: "I have gone to school" },
            ],
            chapters: [
                { timestamp: 0, title: "Kirish" },
                { timestamp: 100, title: "Have/Has ishlatilishi" },
                { timestamp: 240, title: "Ever, Never, Already, Yet" },
                { timestamp: 360, title: "Mashqlar" },
            ],
        },
        {
            id: 27,
            order: 27,
            title: "27-dars – I'm going to ...",
            videoId: "H1gZ_EWC2zA",
            videoUrl: "https://www.youtube.com/watch?v=H1gZ_EWC2zA",
            thumbnail: "https://i.ytimg.com/vi/H1gZ_EWC2zA/maxresdefault.jpg",
            content: "Kelajak rejalarini 'be going to' bilan ifodalashni o'rganamiz.",
            vocabulary: [
                { word: "Plan", translation: "Reja", context: "I am going to plan my trip." },
                { word: "Future", translation: "Kelajak", context: "What are you going to do in the future?" },
                { word: "Intention", translation: "Niyat", context: "She has intention to study abroad." },
            ],
            quiz: [
                { question: "Rejalashtirilgan kelajak uchun qaysi konstruksiya to'g'ri?", options: ["will do", "am going to do", "does", "did"], answer: "am going to do" },
            ],
            chapters: [
                { timestamp: 0, title: "Kirish" },
                { timestamp: 90, title: "Be going to tuzilishi" },
                { timestamp: 200, title: "Misol gaplar" },
                { timestamp: 300, title: "Mashqlar" },
            ],
        },
        {
            id: 43,
            order: 43,
            title: "43-dars – Have you … ? / Do they … ?",
            videoId: "rsijLLBLRsU",
            videoUrl: "https://www.youtube.com/watch?v=rsijLLBLRsU",
            thumbnail: "https://i.ytimg.com/vi/rsijLLBLRsU/maxresdefault.jpg",
            content: "Have you ever...? va Do they...? konstruksiyalarini o'rganamiz.",
            vocabulary: [
                { word: "Question tag", translation: "Aniqlashtiruvchi savol", context: "You are a teacher, aren't you?" },
                { word: "Auxiliary", translation: "Ko'makchi", context: "Do and have are auxiliary verbs." },
            ],
            quiz: [
                { question: "Qaysi savol to'g'ri?", options: ["Have you ever been to Paris?", "Did you ever been to Paris?", "Do you ever been to Paris?", "Were you ever went to Paris?"], answer: "Have you ever been to Paris?" },
            ],
            chapters: [
                { timestamp: 0, title: "Kirish" },
                { timestamp: 80, title: "Have you...?" },
                { timestamp: 180, title: "Do they...?" },
                { timestamp: 280, title: "Mashqlar" },
            ],
        },
        {
            id: 51,
            order: 51,
            title: "51-dars – I want to do vs I enjoy doing",
            videoId: "KaZDD-rG-h8",
            videoUrl: "https://www.youtube.com/watch?v=KaZDD-rG-h8",
            thumbnail: "https://i.ytimg.com/vi/KaZDD-rG-h8/maxresdefault.jpg",
            content: "Infinitive (to + V) va Gerund (V+ing) ishlatilishini taqqoslaymiz.",
            vocabulary: [
                { word: "Infinitive", translation: "Infinitiv", context: "I want to learn English." },
                { word: "Gerund", translation: "Gerund", context: "I enjoy learning English." },
                { word: "Verb", translation: "Fe'l", context: "Some verbs take infinitive, some take gerund." },
            ],
            quiz: [
                { question: "'Enjoy' dan keyin qaysi shakl keladi?", options: ["to do", "doing", "done", "do"], answer: "doing" },
                { question: "'Want' dan keyin qaysi shakl keladi?", options: ["to do", "doing", "done", "do"], answer: "to do" },
            ],
            chapters: [
                { timestamp: 0, title: "Kirish" },
                { timestamp: 100, title: "Infinitive – to do" },
                { timestamp: 220, title: "Gerund – doing" },
                { timestamp: 340, title: "Farq va mashqlar" },
            ],
        },
        {
            id: 65,
            order: 65,
            title: "65-dars – Countable and Uncountable Nouns",
            videoId: "1AikVRwxtr4",
            videoUrl: "https://www.youtube.com/watch?v=1AikVRwxtr4",
            thumbnail: "https://i.ytimg.com/vi/1AikVRwxtr4/maxresdefault.jpg",
            content: "Sanaladigan va sanalmaydigan otlarni o'rganamiz. Singular va Plural shakllari.",
            vocabulary: [
                { word: "Countable", translation: "Sanaladigan", context: "Book, chair, and apple are countable nouns." },
                { word: "Uncountable", translation: "Sanalmaydigan", context: "Water, rice, and sugar are uncountable." },
                { word: "Much/Many", translation: "Ko'p", context: "How much water? / How many books?" },
            ],
            quiz: [
                { question: "'Water' qaysi turkumga kiradi?", options: ["Countable", "Uncountable", "Ikkala ham", "Hech biri"], answer: "Uncountable" },
            ],
            chapters: [
                { timestamp: 0, title: "Kirish" },
                { timestamp: 90, title: "Countable nouns" },
                { timestamp: 200, title: "Uncountable nouns" },
                { timestamp: 310, title: "Much va Many" },
            ],
        },
        {
            id: 110,
            order: 110,
            title: "110-dars – When?",
            videoId: "q9ZNXPvEeWQ",
            videoUrl: "https://www.youtube.com/watch?v=q9ZNXPvEeWQ",
            thumbnail: "https://i.ytimg.com/vi/q9ZNXPvEeWQ/maxresdefault.jpg",
            content: "'When' so'zi bilan gaplar tuzishni o'rganamiz.",
            vocabulary: [
                { word: "When", translation: "Qachon", context: "When will you arrive?" },
                { word: "Clause", translation: "Gap bo'lagi", context: "When I was young, I played football." },
                { word: "Time", translation: "Vaqt", context: "When is the best time to call?" },
            ],
            quiz: [
                { question: "Qaysi gap to'g'ri?", options: ["When I will come, I call you.", "When I come, I will call you.", "When I came, I will call you.", "When will I come, I call you."], answer: "When I come, I will call you." },
            ],
            chapters: [
                { timestamp: 0, title: "Kirish" },
                { timestamp: 80, title: "'When' - savol so'zi sifatida" },
                { timestamp: 180, title: "'When' - bog'lovchi sifatida" },
                { timestamp: 280, title: "Mashqlar" },
            ],
        },
    ],
};

// All available courses
export const ALL_COURSES: Course[] = [ENGLISH_COURSE];
