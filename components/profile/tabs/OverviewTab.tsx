'use client'
import { TagInput } from '@/components/ui/TagInput'
import { UserProfile } from '@/lib/types/profile'

interface OverviewTabProps {
  profile: UserProfile
  editing: boolean
  draft: Partial<UserProfile>
  patch: (key: keyof UserProfile, value: unknown) => void
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted))] mb-2">{label}</h3>
      {children}
    </div>
  )
}

export function OverviewTab({ profile, editing, draft, patch }: OverviewTabProps) {
  const current = editing ? { ...profile, ...draft } : profile

  return (
    <div className="space-y-6 p-6">
      <Section label="Background">
        {editing ? (
          <textarea
            value={draft.background ?? profile.background}
            onChange={(e) => patch('background', e.target.value)}
            rows={4}
            className="w-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] px-3.5 py-2 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] resize-none"
          />
        ) : (
          <p className="text-sm leading-relaxed">{profile.background}</p>
        )}
      </Section>

      <Section label="Top Skills">
        {editing ? (
          <TagInput
            value={draft.topSkills ?? profile.topSkills}
            onChange={(v) => patch('topSkills', v)}
            placeholder="Add a skill and press Enter..."
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {profile.topSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-md bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))] px-2.5 py-1 text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </Section>

      <Section label="Core Values">
        {editing ? (
          <TagInput
            value={draft.coreValues ?? profile.coreValues}
            onChange={(v) => patch('coreValues', v)}
            placeholder="Add a value..."
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {profile.coreValues.map((v) => (
              <span
                key={v}
                className="inline-flex items-center rounded-md bg-[hsl(var(--surface-2))] text-[hsl(var(--foreground))] px-2.5 py-1 text-sm"
              >
                {v}
              </span>
            ))}
          </div>
        )}
      </Section>

      <Section label="Working Style">
        {editing ? (
          <textarea
            value={draft.workingStyle ?? profile.workingStyle}
            onChange={(e) => patch('workingStyle', e.target.value)}
            rows={3}
            className="w-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] px-3.5 py-2 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] resize-none"
          />
        ) : (
          <p className="text-sm leading-relaxed">{profile.workingStyle}</p>
        )}
      </Section>

      <Section label="Job Preferences">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-[hsl(var(--muted))] mb-1">Locations</p>
            {editing ? (
              <TagInput
                value={draft.targetLocations ?? profile.targetLocations}
                onChange={(v) => patch('targetLocations', v)}
                placeholder="City or Remote..."
              />
            ) : (
              <p>{current.targetLocations.join(', ') || 'Not set'}</p>
            )}
          </div>
          <div>
            <p className="text-xs text-[hsl(var(--muted))] mb-1">Salary Expectation</p>
            {editing ? (
              <input
                value={draft.salaryExpectation ?? profile.salaryExpectation ?? ''}
                onChange={(e) => patch('salaryExpectation', e.target.value)}
                placeholder="e.g. $90k-$120k"
                className="w-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] px-3 py-1.5 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
              />
            ) : (
              <p>{current.salaryExpectation || 'Not set'}</p>
            )}
          </div>
        </div>
        {(current.dealbreakers.length > 0 || editing) && (
          <div className="mt-3">
            <p className="text-xs text-[hsl(var(--muted))] mb-1">Dealbreakers</p>
            {editing ? (
              <TagInput
                value={draft.dealbreakers ?? profile.dealbreakers}
                onChange={(v) => patch('dealbreakers', v)}
                placeholder="Add a dealbreaker..."
              />
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {profile.dealbreakers.map((d) => (
                  <span key={d} className="text-xs rounded bg-[hsl(var(--destructive)/0.1)] text-[hsl(var(--destructive))] px-2 py-0.5">{d}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </Section>
    </div>
  )
}
