import { Message } from '@/lib/types/message'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import { User, Zap } from 'lucide-react'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div className={cn(
        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
        isUser ? 'bg-[hsl(var(--surface-2))]' : 'bg-[hsl(var(--primary))]'
      )}>
        {isUser ? <User className="h-4 w-4 text-[hsl(var(--muted))]" /> : <Zap className="h-4 w-4 text-white" />}
      </div>

      {/* Bubble */}
      <div className={cn(
        'max-w-[75%] rounded-lg px-4 py-2.5 text-sm leading-relaxed',
        isUser
          ? 'bg-[hsl(var(--primary))] text-white'
          : 'bg-[hsl(var(--surface))] border border-[hsl(var(--border))]'
      )}>
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold text-[hsl(var(--foreground))]">{children}</strong>,
              ul: ({ children }) => <ul className="mb-2 list-disc pl-4 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="mb-2 list-decimal pl-4 space-y-1">{children}</ol>,
              li: ({ children }) => <li>{children}</li>,
              code: ({ children }) => (
                <code className="rounded bg-[hsl(var(--surface-2))] px-1.5 py-0.5 font-mono text-xs">{children}</code>
              ),
              pre: ({ children }) => (
                <pre className="my-2 overflow-x-auto rounded-md bg-[hsl(var(--surface-2))] p-3 font-mono text-xs">{children}</pre>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  )
}
