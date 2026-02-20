import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const MODEL = 'meta-llama/llama-3.1-8b-instruct:free';

interface Message {
    role: "user" | "bot";
    content: string;
}

interface AITutorSidebarProps {
    context?: {
        title?: string;
        content?: string;
        transcript?: string | null;
        summary?: string;
        vocabulary?: { word: string; translation: string; context: string }[];
        quiz?: { question: string; options: string[]; answer: string }[];
    } | null;
}

function buildSystemPrompt(context: AITutorSidebarProps['context']): string {
    const parts: string[] = [
        `Sen "S-STUDY" ta'lim platformasining AI maslahatchi assistantisan. Sening isming "SI-Maslahatchi".`,
        `Doimo O'zbek tilida javob ber. Qisqa, aniq va tushunarli tilda yoz. Emoji ishlatishingiz mumkin.`,
        `O'quvchi savollariga dars mazmuniga asoslanib yordam ber. Do'stona va rag'batlantiruvchi tarzda gapir.`,
    ];
    if (context?.title) parts.push(`\nHozirgi dars mavzusi: "${context.title}"`);
    if (context?.summary) parts.push(`Dars xulosasi: ${context.summary}`);
    if (context?.content) parts.push(`Dars matni: ${context.content}`);
    if (context?.vocabulary?.length) {
        const v = context.vocabulary.map(w => `${w.word} = ${w.translation}`).join(', ');
        parts.push(`Kalit so'zlar: ${v}`);
    }
    if (context?.transcript) {
        parts.push(`Video transkripsiya (qisqartirilgan): ${context.transcript.substring(0, 800)}`);
    }
    return parts.join('\n');
}

export function AITutorSidebar({ context }: AITutorSidebarProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "bot",
            content: "Assalomu alaykum! 👋 Men sizning SI-Maslahatchingizman. Dars bo'yicha har qanday savolingizni bering, o'zbek tilida javob beraman!"
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userText = input.trim();
        setMessages(prev => [...prev, { role: "user", content: userText }]);
        setInput("");
        setLoading(true);

        try {
            // Build message history for OpenRouter (OpenAI-compatible format)
            const systemPrompt = buildSystemPrompt(context);

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
                        { role: 'system', content: systemPrompt },
                        ...history,
                        { role: 'user', content: userText }
                    ],
                    max_tokens: 600,
                    temperature: 0.7,
                }),
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err?.error?.message || `HTTP ${response.status}`);
            }

            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content || 'Javob olishda xatolik yuz berdi.';

            setMessages(prev => [...prev, { role: "bot", content: reply }]);
        } catch (error: any) {
            console.error("OpenRouter API error:", error);
            setMessages(prev => [...prev, {
                role: "bot",
                content: `❌ Xatolik: ${error.message || 'Internetni tekshiring va qayta urinib ko\'ring.'}`
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full border-l bg-white w-[350px] shrink-0">
            {/* Header */}
            <CardHeader className="border-b px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 shrink-0">
                <CardTitle className="text-base flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 leading-none">SI-Maslahatchi</p>
                        <p className="text-xs text-indigo-500 font-normal mt-0.5">Gemini 2.0 Flash · Jonli</p>
                    </div>
                </CardTitle>
            </CardHeader>

            {/* Messages */}
            <ScrollArea className="flex-1 p-3">
                <div className="space-y-3">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-[85%] items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                {/* Avatar */}
                                <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${msg.role === 'bot' ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                    {msg.role === 'bot'
                                        ? <Bot className="w-3.5 h-3.5 text-white" />
                                        : <User className="w-3.5 h-3.5 text-slate-600" />}
                                </div>
                                {/* Bubble */}
                                <div className={`rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                                    : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="flex items-center gap-1.5 bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-3 border-t bg-white shrink-0">
                {context?.title && (
                    <p className="text-xs text-slate-400 mb-2 truncate">📚 {context.title}</p>
                )}
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Savolingizni yozing..."
                        className="flex-1 text-sm"
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={loading || !input.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 shrink-0"
                    >
                        {loading
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Send className="w-4 h-4" />}
                    </Button>
                </form>
            </div>
        </div>
    );
}
