'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Message } from '@/lib/types/message'
import { MessageBubble } from '@/components/chat/MessageBubble'

const INITIAL_MESSAGE: Message = {
  id: '0',
  role: 'assistant',
  content: `Hey! I'm going to ask you a few questions to build your career profile. This usually takes about 5-10 minutes.\n\nLet's start simple: what's your name, and when are you graduating (or did you already)?`,
  createdAt: new Date(),
}

const MOCK_QUESTIONS = [
  "What university are you at, and what's your major and expected graduation date?",
  "Any internships or work experience so far, or mainly academic projects?",
  "What programming languages and frameworks are you most comfortable with? Be specific — languages, any backend/frontend frameworks, databases, tools.",
  "Tell me about a standout project. What did you build, what tech did you use, and what was the outcome?",
  "What type of role are you targeting? Options: Backend Engineer, Full-Stack Engineer, Java Backend Engineer, or general New Grad SWE.",
  "Where are you looking to work, and do you prefer remote, hybrid, or onsite?",
  "Any salary expectations, or do you want to skip that for now?",
  "What are your dealbreakers — company types, cultures, or role attributes you want to avoid?",
  "How do you prefer to work? Describe your working style — collaboration, pace, environment.",
  "What are your core values in a job? What matters most to you?",
  "Let's capture a STAR story. Pick your strongest project or experience and walk me through it: what was the situation, what was your specific task, what did you do, and what was the result?",
  "I think I have everything I need to build your profile. Click **Finish** when you're ready to review what I've collected.",
]

interface OnboardingChatProps {
  messages: Message[]
  setMessages: (fn: (prev: Message[]) => Message[]) => void
  onFinish: (messages: Message[]) => void
}

export function OnboardingChat({ messages, setMessages, onFinish }: OnboardingChatProps) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const mockIndexRef = useRef(0)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function mockStreamResponse(assistantId: string) {
    const text = MOCK_QUESTIONS[Math.min(mockIndexRef.current, MOCK_QUESTIONS.length - 1)]
    mockIndexRef.current++
    const words = text.split(' ')
    let acc = ''
    for (const word of words) {
      await new Promise((r) => setTimeout(r, 35))
      acc += word + ' '
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: acc.trimEnd() } : m))
      )
    }
  }

  async function handleSend() {
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      createdAt: new Date(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(() => updatedMessages)
    setIsLoading(true)

    const assistantId = (Date.now() + 1).toString()
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '', createdAt: new Date() }])

    try {
      await mockStreamResponse(assistantId)
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const canFinish = messages.filter((m) => m.role === 'user').length >= 3

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))]">
              <Loader2 className="h-4 w-4 text-white animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-[hsl(var(--border))] p-4 space-y-3">
        {canFinish && (
          <div className="flex justify-center">
            <Button variant="outline" size="sm" onClick={() => onFinish(messages)} disabled={isLoading}>
              Finish Interview
            </Button>
          </div>
        )}
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer..."
            rows={2}
            disabled={isLoading}
            className="flex-1 rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] px-3.5 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] resize-none disabled:opacity-50"
          />
          <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="icon">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

export { INITIAL_MESSAGE }
