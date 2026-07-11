'use client'
import { useState, KeyboardEvent } from 'react'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (text: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('')

  function handleSend() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex gap-2 mt-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Message your career assistant... (Enter to send, Shift+Enter for newline)"
        rows={1}
        className={cn(
          'flex-1 resize-none rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-3 py-2.5 text-sm',
          'text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted))]',
          'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]',
          'disabled:opacity-50 min-h-[42px] max-h-[200px]'
        )}
        style={{ height: 'auto' }}
        onInput={(e) => {
          const el = e.currentTarget
          el.style.height = 'auto'
          el.style.height = Math.min(el.scrollHeight, 200) + 'px'
        }}
      />
      <button
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
          'bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary-hover))]',
          'disabled:opacity-40 disabled:pointer-events-none'
        )}
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  )
}
