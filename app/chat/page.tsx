'use client'
import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { ChatInput } from '@/components/chat/ChatInput'
import { SuggestedActions } from '@/components/chat/SuggestedActions'
import { Message } from '@/lib/types/message'
import { useProfileStore } from '@/lib/stores/useProfileStore'
import { useApplicationsStore } from '@/lib/stores/useApplicationsStore'

const SUGGESTED_ACTIONS = [
  'Tailor resume for this role',
  'Generate cover letter',
  'Analyze job posting',
  'Prep interview questions',
  'What should I work on next?',
]

const INITIAL_MESSAGE: Message = {
  id: '0',
  role: 'assistant',
  content: `Hey! I'm your career assistant. I have context on your applications, resume, STAR stories, and background.\n\nPaste a job description, ask me to write something, or just tell me what you need.`,
  createdAt: new Date(),
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)
  const { profile } = useProfileStore()
  const { applications } = useApplicationsStore()

  async function handleSend(text: string) {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      createdAt: new Date(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setIsLoading(true)

    const assistantId = (Date.now() + 1).toString()
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '', createdAt: new Date() }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(({ role, content }) => ({ role, content })),
          profile,
          applications,
        }),
      })

      if (!res.ok || !res.body) {
        throw new Error(`API error: ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value, { stream: true })
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: fullText } : m))
        )
      }
    } catch (err) {
      const msg = err instanceof Error && err.message.includes('API error')
        ? 'Could not reach the AI. Check that GOOGLE_GENERATIVE_AI_API_KEY is set in .env.local and the dev server has been restarted.'
        : 'Something went wrong. Please try again.'
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: msg } : m))
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Chat" subtitle="Ask anything about your job search" />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <ChatWindow messages={messages} isLoading={isLoading} />
          <div className="border-t border-[hsl(var(--border))] p-4">
            <SuggestedActions actions={SUGGESTED_ACTIONS} onSelect={handleSend} />
            <ChatInput onSend={handleSend} disabled={isLoading} />
          </div>
        </div>
      </div>
    </div>
  )
}
