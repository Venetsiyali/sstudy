import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area" // We need to create this or use a div
import { Send, Bot, User } from "lucide-react"

interface Message {
    role: "user" | "bot"
    content: string
}

export function AITutorSidebar() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "bot", content: "Hello! I'm your AI Tutor. Ask me anything about this lesson." }
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
                    content: "I found some relevant information in the lesson. This concept explains..."
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
                    AI Tutor
                </CardTitle>
            </CardHeader>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}>
                            {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div
                            className={`rounded-lg p-3 text-sm max-w-[85%] ${msg.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-foreground"
                                }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 animate-pulse">
                            <Bot className="w-4 h-4 opacity-50" />
                        </div>
                        <div className="bg-muted rounded-lg p-3 text-sm text-foreground animate-pulse">
                            Thinking...
                        </div>
                    </div>
                )}
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
                        placeholder="Ask a question..."
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={loading}>
                        <Send className="w-4 h-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </div>
        </div>
    )
}
