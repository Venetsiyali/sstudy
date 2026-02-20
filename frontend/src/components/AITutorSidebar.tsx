import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardHeader, CardTitle } from '@/components/ui/card'; // CardContent/Card is not used, removing it
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react'; // Added Loader2 as per instruction

interface Message {
    role: "user" | "bot"
    content: string
}

export function AITutorSidebar() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "bot", content: "Assalomu alaykum! Men sizning SI-Maslahatchingizman. Dars bo'yicha har qanday savolingizni bering." }
    ])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage = { role: "user" as const, content: input }
        setMessages(prev => [...prev, userMessage])
        setInput("")
        setLoading(true)

        try {
            // Mock API call for now
            // In real implementation, this calls POST /api/v1/rag/ask
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: "bot",
                    content: "Darslikdan ushbu ma'lumotni topdim. Bu tushuncha shuni anglatadiki..."
                }])
                setLoading(false)
            }, 1000)
        } catch (error) {
            console.error("Failed to fetch answer", error)
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-full border-l bg-muted/10 w-[350px]">
            <CardHeader className="border-b px-4 py-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    SI-Maslahatchi
                </CardTitle>
            </CardHeader>

            <div className="flex-1 overflow-hidden p-4">
                <ScrollArea className="h-full pr-4">
                    {messages.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                            <Bot className="mb-2 h-12 w-12 opacity-20" />
                            <p>Dars bo'yicha savolingiz bormi?</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                >
                                    <div
                                        className={`flex max-w-[80%] items-start gap-2 rounded-lg p-3 ${msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted'
                                            }`}
                                    >
                                        {msg.role === 'bot' && <Bot className="mt-1 h-4 w-4 shrink-0" />}
                                        <div className="text-sm">{msg.content}</div>
                                        {msg.role === 'user' && <User className="mt-1 h-4 w-4 shrink-0" />}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-sm">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        O'ylanmoqda...
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </ScrollArea>
            </div>

            <div className="p-4 border-t">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSend()
                    }}
                    className="flex gap-2"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Savolingizni yozing..."
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={loading}>
                        <Send className="w-4 h-4" />
                        <span className="sr-only">Yuborish</span>
                    </Button>
                </form>
            </div>
        </div>
    )
}
