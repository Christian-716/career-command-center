'use client'
import { useState, useEffect } from 'react'
import { Sheet } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StarStory } from '@/lib/types/profile'

const EMPTY: StarStory = { title: '', situation: '', task: '', action: '', result: '' }

interface StarStorySheetProps {
  open: boolean
  onClose: () => void
  initial?: StarStory
  onSave: (story: StarStory) => void
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm text-[hsl(var(--muted))] mb-1.5 block">{label}</label>
      {children}
    </div>
  )
}

export function StarStorySheet({ open, onClose, initial, onSave }: StarStorySheetProps) {
  const [draft, setDraft] = useState<StarStory>(initial ?? EMPTY)

  useEffect(() => {
    setDraft(initial ?? EMPTY)
  }, [open, initial])

  function patch(key: keyof StarStory, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    if (!draft.title.trim()) return
    onSave(draft)
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title={initial ? 'Edit Story' : 'Add STAR Story'}>
      <div className="p-6 flex flex-col gap-4">
        <Field label="Title">
          <Input value={draft.title} onChange={(e) => patch('title', e.target.value)} placeholder="e.g. Reduced API latency by 40%" />
        </Field>
        {(['situation', 'task', 'action', 'result'] as const).map((field) => (
          <Field key={field} label={field.charAt(0).toUpperCase() + field.slice(1)}>
            <textarea
              value={draft[field]}
              onChange={(e) => patch(field, e.target.value)}
              rows={3}
              placeholder={
                field === 'situation' ? 'What was the context and challenge?' :
                field === 'task' ? 'What was your specific responsibility?' :
                field === 'action' ? 'What steps did you take?' :
                'What was the measurable outcome?'
              }
              className="w-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] px-3.5 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] resize-none"
            />
          </Field>
        ))}
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!draft.title.trim()}>Save Story</Button>
        </div>
      </div>
    </Sheet>
  )
}
