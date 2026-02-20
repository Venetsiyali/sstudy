import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

interface Message {
    role: "user" | "bot"
    content: string
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
        `Faqat o'zbek tilida javob ber. Qisqa, aniq va tushunarli tilda yoz.`,
        `O'quvchi savollariga dars mazmuniga asoslanib javob ber.`,
    ];

    if (context?.title) {
        parts.push(`\nHozirgi dars: "${context.title}"`);
    }
    if (context?.summary) {
        parts.push(`Dars xulosasi: ${context.summary}`);
    }
    if (context?.content) {
        parts.push(`Dars matni: ${context.content}`);
    }
    if (context?.transcript) {
        parts.push(`Video transkripsiyasi (qisqa): ${context.transcript.substring(0, 1000)}`);
    }
    if (context?.vocabulary && context.vocabulary.length > 0) {
        const vocabStr = context.vocabulary.map(v => `${v.word} = ${v.translation}`).join(', ');
        parts.push(`Darsning kalit so'zlari: ${vocabStr}`);
    }

    parts.push(`\nO'quvchiga do'stona, encouragin va motivatsion tarzda yordam ber. Agar savol darsga bog'liq bo'lmasa, uni dars mavzusiga yo'nalt.`);

    return parts.join('\n');
}

export function AITutorSidebar({ context }: AITutorSidebarProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "bot",
            content: "Assalomu alaykum! 👋 Men sizning SI-Maslahatchingizman (Gemini AI). Dars bo'yicha har qanday savolingizni bering, o'zbek tilida javob beraman!"
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userText = input.trim();
        const userMessage: Message = { role: "user", content: userText };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // Build a full conversation history as context for Gemini
            const systemPrompt = buildSystemPrompt(context);

            // Build history from existing messages (skip first bot greeting in history)
            const conversationHistory = messages.slice(1).map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            }));

            const chat = model.startChat({
                history: [
                    {
                        role: 'user',
                        parts: [{ text: systemPrompt }]
                    },
                    {
                        role: 'model',
                        parts: [{ text: "Yaxshi, tushundim! O'quvchiga yordam berishga tayyorman. Savolini yuboring." }]
                    },
                    ...conversationHistory
                ],
                generationConfig: {
                    maxOutputTokens: 500,
                    temperature: 0.7,
                }
            });

            const result = await chat.sendMessage(userText);
            const responseText = result.response.text();

            setMessages(prev => [...prev, {
                role: "bot",
                content: responseText
            }]);
        } catch (error: any) {
            console.error("Gemini API error:", error);
            setMessages(prev => [...prev, {
                role: "bot",
                content: "Kechirasiz, hozir javob bera olmayapman. Internetni tekshiring yoki keyinroq urinib ko'ring. 🙏"
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
                        <p className="text-xs text-indigo-500 font-normal mt-0.5">Gemini AI · Online</p>
                    </div>
                </CardTitle>
            </CardHeader>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3" ref={scrollRef}>
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[85%] items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            {/* Avatar */}
                            <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${msg.role === 'bot' ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                {msg.role === 'bot'
                                    ? <Bot className="w-3.5 h-3.5 text-white" />
                                    : <User className="w-3.5 h-3.5 text-slate-600" />
                                }
                            </div>
                            {/* Bubble */}
                            <div className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                                    : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Loading indicator */}
                {loading && (
                    <div className="flex justify-start">
                        <div className="flex items-center gap-1.5 bg-slate-100 rounded-2xl rounded-tl-sm px-3 py-2">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t bg-white shrink-0">
                {context?.title && (
                    <p className="text-xs text-slate-400 mb-2 truncate">
                        📚 {context.title}
                    </p>
                )}
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-2"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Savolingizni yozing..."
                        className="flex-1 text-sm"
                        disabled={loading}
                    />
                    <Button type="submit" size="icon" disabled={loading || !input.trim()} className="bg-indigo-600 hover:bg-indigo-700 shrink-0">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </form>
            </div>
        </div>
    );
}
