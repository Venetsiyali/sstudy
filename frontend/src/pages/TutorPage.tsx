import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Loader2, Sparkles, BookOpen } from 'lucide-react';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const MODEL = 'meta-llama/llama-3.1-8b-instruct:free';

interface Message {
    role: "user" | "bot";
    content: string;
}

const SYSTEM_PROMPT = `Sen "S-STUDY" ta'lim platformasining AI maslahatchi assistantisan. Isming "SI-Maslahatchi".
Doimo O'zbek tilida javob ber. Qisqa, aniq va tushunarli tilda yoz. Emoji ishlat.
O'quvchiga ingliz tili, grammatika, so'zlar bo'yicha savollarga yordam ber.
Agar bilmasang, "Bilmayman, lekin quyidagini tavsiya etaman..." deb yoz.`;

export default function TutorPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "bot",
            content: "Assalomu alaykum! 👋 Men sizning SI-Maslahatchingizman.\n\nMenga ingliz tili, grammatika yoki o'rganmoqchi bo'lgan mavzularingiz bo'yicha savollar bering — o'zbek tilida javob beraman! 🎓"
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userText = input.trim();
        setMessages(prev => [...prev, { role: "user", content: userText }]);
        setInput("");
        setLoading(true);

        try {
            const history = messages.map(m => ({
                role: m.role === 'user' ? 'user' : 'assistant',
                content: m.content
            }));

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://s-study.uz',
                    'X-Title': 'S-STUDY SI-Maslahatchi',
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        ...history,
                        { role: 'user', content: userText }
                    ],
                    max_tokens: 600,
                    temperature: 0.7,
                }),
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content || 'Javob olishda xatolik.';
            setMessages(prev => [...prev, { role: "bot", content: reply }]);
        } catch (error: any) {
            setMessages(prev => [...prev, {
                role: "bot",
                content: `❌ Xatolik yuz berdi: ${error.message}. Internetni tekshiring.`
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">SI-Maslahatchi</h1>
                    <p className="text-sm text-slate-500">Gemini 2.0 Flash · Sun'iy intellekt yordamchisi</p>
                </div>
                <div className="ml-auto flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-medium">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Jonli
                </div>
            </div>

            {/* Suggested questions */}
            {messages.length === 1 && (
                <div className="mb-4 grid grid-cols-2 gap-2">
                    {[
                        "Present Simple qoidasini tushuntir",
                        "\"Make\" va \"Do\" farqi nima?",
                        "Ingliz tilini tez o'rganish uchun maslahat ber",
                        "Vocabulary qanday yaxshi eslab qolaman?",
                    ].map((q) => (
                        <button
                            key={q}
                            onClick={() => { setInput(q); }}
                            className="text-left p-3 rounded-xl border border-slate-100 bg-white hover:border-indigo-200 hover:bg-indigo-50 text-sm text-slate-600 hover:text-indigo-700 transition-all shadow-sm"
                        >
                            <BookOpen className="w-3.5 h-3.5 inline mr-1.5 text-indigo-400" />
                            {q}
                        </button>
                    ))}
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[80%] items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${msg.role === 'bot' ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                {msg.role === 'bot'
                                    ? <Bot className="w-4 h-4 text-white" />
                                    : <User className="w-4 h-4 text-slate-600" />}
                            </div>
                            <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-sm'
                                : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="flex items-center gap-2 ml-11 bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="border-t pt-4 bg-slate-50/80 backdrop-blur -mx-8 px-8 pb-4">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Savolingizni yozing..."
                        className="flex-1 bg-white border-slate-200 rounded-xl text-sm h-11"
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-5 h-11"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </form>
            </div>
        </div>
    );
}
