'use client'
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TagInput } from '@/components/ui/TagInput'
import { UserProfile, StarStory, TargetRole } from '@/lib/types/profile'

const ROLE_LABELS: Record<TargetRole, string> = {
  backend: 'Backend Engineer',
  fullstack: 'Full-Stack Engineer',
  'java-backend': 'Java Backend Engineer',
  'new-grad-swe': 'New Grad SWE',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm text-[hsl(var(--muted))] mb-1.5 block">{label}</label>
      {children}
    </div>
  )
}

const EMPTY_STORY: StarStory = { title: '', situation: '', task: '', action: '', result: '' }

interface OnboardingReviewProps {
  draft: UserProfile
  onChange: (updates: Partial<UserProfile>) => void
  onConfirm: () => void
  onBack: () => void
}

export function OnboardingReview({ draft, onChange, onConfirm, onBack }: OnboardingReviewProps) {
  const [editingStory, setEditingStory] = useState<{ index: number; story: StarStory } | null>(null)

  function patchStory(index: number, updates: Partial<StarStory>) {
    const next = draft.starStories.map((s, i) => i === index ? { ...s, ...updates } : s)
    onChange({ starStories: next })
  }

  function addStory() {
    onChange({ starStories: [...draft.starStories, { ...EMPTY_STORY }] })
    setEditingStory({ index: draft.starStories.length, story: { ...EMPTY_STORY } })
  }

  function removeStory(index: number) {
    onChange({ starStories: draft.starStories.filter((_, i) => i !== index) })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div>
          <h2 className="text-lg font-semibold mb-1">Review your profile</h2>
          <p className="text-sm text-[hsl(var(--muted))]">Everything below was extracted from our conversation. Edit anything that needs fixing.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Name">
            <Input value={draft.name} onChange={(e) => onChange({ name: e.target.value })} />
          </Field>
          <Field label="Email (optional)">
            <Input value={draft.email ?? ''} onChange={(e) => onChange({ email: e.target.value })} />
          </Field>
        </div>

        <Field label="Education">
          <Input value={draft.education} onChange={(e) => onChange({ education: e.target.value })} />
        </Field>

        <Field label="Background">
          <textarea
            value={draft.background}
            onChange={(e) => onChange({ background: e.target.value })}
            rows={3}
            className="w-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] px-3.5 py-2 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] resize-none"
          />
        </Field>

        <Field label="Top Skills">
          <TagInput value={draft.topSkills} onChange={(v) => onChange({ topSkills: v })} placeholder="Add a skill and press Enter..." />
        </Field>

        <Field label="Projects">
          <TagInput value={draft.projects} onChange={(v) => onChange({ projects: v })} placeholder="Add a project name..." />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Target Role">
            <select
              value={draft.targetRole}
              onChange={(e) => onChange({ targetRole: e.target.value as TargetRole })}
              className="w-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] px-3.5 py-2 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
            >
              {(Object.entries(ROLE_LABELS) as [TargetRole, string][]).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </Field>
          <Field label="Salary Expectation (optional)">
            <Input value={draft.salaryExpectation ?? ''} onChange={(e) => onChange({ salaryExpectation: e.target.value })} placeholder="e.g. $90k-$120k" />
          </Field>
        </div>

        <Field label="Target Locations">
          <TagInput value={draft.targetLocations} onChange={(v) => onChange({ targetLocations: v })} placeholder="Add a city or Remote..." />
        </Field>

        <Field label="Dealbreakers">
          <TagInput value={draft.dealbreakers} onChange={(v) => onChange({ dealbreakers: v })} placeholder="Add a dealbreaker..." />
        </Field>

        <Field label="Working Style">
          <textarea
            value={draft.workingStyle}
            onChange={(e) => onChange({ workingStyle: e.target.value })}
            rows={2}
            className="w-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] px-3.5 py-2 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] resize-none"
          />
        </Field>

        <Field label="Core Values">
          <TagInput value={draft.coreValues} onChange={(v) => onChange({ coreValues: v })} placeholder="Add a value..." />
        </Field>

        {/* STAR Stories */}
        <div>
          <label className="text-sm text-[hsl(var(--muted))] mb-2 block">STAR Stories</label>
          <div className="space-y-3">
            {draft.starStories.map((story, i) => (
              <div key={i} className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Input
                    value={story.title}
                    onChange={(e) => patchStory(i, { title: e.target.value })}
                    placeholder="Story title"
                    className="mr-2"
                  />
                  <button onClick={() => removeStory(i)} className="text-[hsl(var(--muted))] hover:text-[hsl(var(--destructive))] transition-colors shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {(['situation', 'task', 'action', 'result'] as const).map((field) => (
                  <div key={field}>
                    <label className="text-xs text-[hsl(var(--muted))] mb-1 block capitalize">{field}</label>
                    <textarea
                      value={story[field]}
                      onChange={(e) => patchStory(i, { [field]: e.target.value })}
                      rows={2}
                      className="w-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] px-3 py-1.5 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] resize-none"
                    />
                  </div>
                ))}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addStory}>
              <Plus className="h-4 w-4" />
              Add Story
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-[hsl(var(--border))] p-4 flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onConfirm}>Looks good, continue</Button>
      </div>
    </div>
  )
}
