'use client'
import { Zap, MapPin, Briefcase, Code2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserProfile, TargetRole } from '@/lib/types/profile'

const ROLE_LABELS: Record<TargetRole, string> = {
  backend: 'Backend Engineer',
  fullstack: 'Full-Stack Engineer',
  'java-backend': 'Java Backend Engineer',
  'new-grad-swe': 'New Grad SWE',
}

interface OnboardingConfirmProps {
  profile: UserProfile
  onConfirm: () => void
  onBack: () => void
}

export function OnboardingConfirm({ profile, onConfirm, onBack }: OnboardingConfirmProps) {
  const initials = profile.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex flex-col h-full items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(var(--primary))] text-white text-xl font-bold mx-auto">
            {initials}
          </div>
          <h2 className="text-2xl font-bold">{profile.name}</h2>
          <p className="text-sm text-[hsl(var(--muted))]">{profile.education}</p>
        </div>

        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] divide-y divide-[hsl(var(--border))]">
          <div className="flex items-center gap-3 p-4">
            <Briefcase className="h-4 w-4 text-[hsl(var(--muted))] shrink-0" />
            <div>
              <p className="text-xs text-[hsl(var(--muted))]">Target Role</p>
              <p className="text-sm font-medium">{ROLE_LABELS[profile.targetRole]}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4">
            <Code2 className="h-4 w-4 text-[hsl(var(--muted))] shrink-0" />
            <div>
              <p className="text-xs text-[hsl(var(--muted))]">Skills</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {profile.topSkills.slice(0, 6).map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                ))}
                {profile.topSkills.length > 6 && (
                  <Badge variant="secondary" className="text-xs">+{profile.topSkills.length - 6} more</Badge>
                )}
              </div>
            </div>
          </div>
          {profile.targetLocations.length > 0 && (
            <div className="flex items-center gap-3 p-4">
              <MapPin className="h-4 w-4 text-[hsl(var(--muted))] shrink-0" />
              <div>
                <p className="text-xs text-[hsl(var(--muted))]">Locations</p>
                <p className="text-sm font-medium">{profile.targetLocations.join(', ')}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 p-4">
            <Zap className="h-4 w-4 text-[hsl(var(--muted))] shrink-0" />
            <div>
              <p className="text-xs text-[hsl(var(--muted))]">STAR Stories</p>
              <p className="text-sm font-medium">{profile.starStories.length} on file</p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-[hsl(var(--muted))]">
          You can edit any of this from your Profile page at any time.
        </p>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">Go Back</Button>
          <Button onClick={onConfirm} className="flex-1">Launch Dashboard</Button>
        </div>
      </div>
    </div>
  )
}
