'use client'
import { useRef, KeyboardEvent } from 'react'
import { X } from 'lucide-react'

interface TagInputProps {
  value: string[]
  onChange: (v: string[]) => void
  placeholder?: string
}

export function TagInput({ value, onChange, placeholder }: TagInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function addTag(raw: string) {
    const tags = raw.split(',').map((t) => t.trim()).filter(Boolean)
    const next = [...value]
    for (const t of tags) {
      if (!next.includes(t)) next.push(t)
    }
    onChange(next)
    if (inputRef.current) inputRef.current.value = ''
  }

  function removeTag(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const val = inputRef.current?.value ?? ''
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (val.trim()) addTag(val)
    } else if (e.key === 'Backspace' && val === '' && value.length > 0) {
      removeTag(value.length - 1)
    }
  }

  function handleBlur() {
    const val = inputRef.current?.value ?? ''
    if (val.trim()) addTag(val)
  }

  return (
    <div
      className="flex flex-wrap gap-1.5 min-h-10 rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] px-3 py-2 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 rounded-md bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))] px-2 py-0.5 text-sm font-medium"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); removeTag(i) }}
            className="hover:text-[hsl(var(--foreground))] transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] bg-transparent text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted))] outline-none"
      />
    </div>
  )
}
