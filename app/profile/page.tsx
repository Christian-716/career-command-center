'use client'
import { useState } from 'react'
import { Pencil, X, Check } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { AvatarUpload } from '@/components/profile/AvatarUpload'
import { OverviewTab } from '@/components/profile/tabs/OverviewTab'
import { ProjectsTab } from '@/components/profile/tabs/ProjectsTab'
import { ResumesTab } from '@/components/profile/tabs/ResumesTab'
import { StarStoriesTab } from '@/components/profile/tabs/StarStoriesTab'
import { useProfileStore } from '@/lib/stores/useProfileStore'
import { UserProfile, TargetRole } from '@/lib/types/profile'
import { cn } from '@/lib/utils'

type Tab = 'overview' | 'projects' | 'resumes' | 'stories'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'projects', label: 'Projects' },
  { id: 'resumes', label: 'Resumes' },
  { id: 'stories', label: 'STAR Stories' },
]

const ROLE_LABELS: Record<TargetRole, string> = {
  backend: 'Backend Engineer',
  fullstack: 'Full-Stack Engineer',
  'java-backend': 'Java Backend Engineer',
  'new-grad-swe': 'New Grad SWE',
}

export default function ProfilePage() {
  const { profile, setProfile } = useProfileStore()
  const [tab, setTab] = useState<Tab>('overview')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Partial<UserProfile>>({})

  if (!profile) return null

  function startEdit() {
    setDraft({})
    setEditing(true)
  }

  function cancelEdit() {
    setDraft({})
    setEditing(false)
  }

  function saveEdit() {
    setProfile({ ...profile!, ...draft })
    setDraft({})
    setEditing(false)
  }

  function patch(key: keyof UserProfile, value: unknown) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  const current = { ...profile, ...draft }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Profile" subtitle="Your career identity" />

      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))]">
          <div className="flex items-start gap-5">
            <AvatarUpload
              avatarUrl={current.avatarUrl}
              name={current.name}
              editing={editing}
              onUpload={(url) => patch('avatarUrl', url)}
            />
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="space-y-2">
                  <Input
                    value={draft.name ?? profile.name}
                    onChange={(e) => patch('name', e.target.value)}
                    className="text-lg font-semibold h-auto py-1"
                  />
                  <Input
                    value={draft.education ?? profile.education}
                    onChange={(e) => patch('education', e.target.value)}
                    placeholder="Education"
                  />
                  <select
                    value={draft.targetRole ?? profile.targetRole}
                    onChange={(e) => patch('targetRole', e.target.value as TargetRole)}
                    className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] px-3 py-1.5 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
                  >
                    {(Object.entries(ROLE_LABELS) as [TargetRole, string][]).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <h1 className="text-xl font-bold">{profile.name}</h1>
                  <p className="text-sm text-[hsl(var(--muted))] mt-0.5">{profile.education}</p>
                  <Badge variant="secondary" className="mt-2">{ROLE_LABELS[profile.targetRole]}</Badge>
                </>
              )}
            </div>
            <div className="shrink-0">
              {editing ? (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={cancelEdit}>
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={saveEdit}>
                    <Check className="h-4 w-4" />
                    Save
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={startEdit}>
                  <Pencil className="h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 py-2 border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))]">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm transition-colors',
                tab === id
                  ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]'
                  : 'text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--surface-2))]'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === 'overview' && (
          <OverviewTab profile={profile} editing={editing} draft={draft} patch={patch} />
        )}
        {tab === 'projects' && <ProjectsTab />}
        {tab === 'resumes' && <ResumesTab />}
        {tab === 'stories' && (
          <StarStoriesTab
            stories={current.starStories}
            editing={editing}
            patch={patch}
          />
        )}
      </div>
    </div>
  )
}
