'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react'
import { StarStory } from '@/lib/types/profile'

interface StarStoryCardProps {
  story: StarStory
  editing?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export function StarStoryCard({ story, editing, onEdit, onDelete }: StarStoryCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))] overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 text-left hover:bg-[hsl(var(--surface-2))] transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex-1 min-w-0 pr-4">
          <p className="font-medium text-sm">{story.title || 'Untitled Story'}</p>
          {!expanded && (
            <p className="text-sm text-[hsl(var(--muted))] line-clamp-1 mt-0.5">
              {story.situation}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {editing && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit?.() }}
                className="p-1 rounded text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--surface-2))] transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete?.() }}
                className="p-1 rounded text-[hsl(var(--muted))] hover:text-[hsl(var(--destructive))] hover:bg-[hsl(var(--surface-2))] transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
          {expanded ? <ChevronUp className="h-4 w-4 text-[hsl(var(--muted))]" /> : <ChevronDown className="h-4 w-4 text-[hsl(var(--muted))]" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-[hsl(var(--border))]">
          {(['situation', 'task', 'action', 'result'] as const).map((field) => (
            <div key={field}>
              <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted))] mb-1">{field}</p>
              <p className="text-sm leading-relaxed">{story[field]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
