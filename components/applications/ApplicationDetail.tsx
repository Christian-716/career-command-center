'use client'
import { useState, useEffect } from 'react'
import { Application, ApplicationStage, STAGE_LABELS, STAGE_ORDER } from '@/lib/types/application'
import { Sheet } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApplicationsStore } from '@/lib/stores/useApplicationsStore'
import { MapPin, DollarSign, Calendar, FileText, ExternalLink, ArrowRight, Pencil, X, Check } from 'lucide-react'

interface ApplicationDetailProps {
  application: Application | null
  onClose: () => void
}

const stageBadgeVariant: Partial<Record<ApplicationStage, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'>> = {
  offer: 'success', rejected: 'destructive',
  interview: 'warning', final: 'warning', applied: 'default',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm text-[hsl(var(--muted))] mb-1.5 block">{label}</label>
      {children}
    </div>
  )
}

export function ApplicationDetail({ application, onClose }: ApplicationDetailProps) {
  const { updateApplication } = useApplicationsStore()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Partial<Application>>({})

  useEffect(() => {
    setEditing(false)
    setDraft({})
  }, [application?.id])

  function startEdit() {
    if (!application) return
    setDraft({ ...application })
    setEditing(true)
  }

  function cancelEdit() {
    setDraft({})
    setEditing(false)
  }

  function saveEdit() {
    if (!application) return
    updateApplication(application.id, draft)
    setEditing(false)
    setDraft({})
  }

  function patch(updates: Partial<Application>) {
    setDraft((d) => ({ ...d, ...updates }))
  }

  return (
    <Sheet open={!!application} onClose={() => { cancelEdit(); onClose() }} title={application?.company ?? ''}>
      {application && (
        <div className="p-6 flex flex-col gap-5">
          {/* Action bar */}
          <div className="flex justify-end">
            {editing ? (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={cancelEdit}>
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </Button>
                <Button size="sm" onClick={saveEdit}>
                  <Check className="h-3.5 w-3.5" />
                  Save
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="outline" onClick={startEdit}>
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
            )}
          </div>

          {editing ? (
            <>
              <Field label="Company">
                <Input value={draft.company ?? ''} onChange={(e) => patch({ company: e.target.value })} />
              </Field>
              <Field label="Role">
                <Input value={draft.role ?? ''} onChange={(e) => patch({ role: e.target.value })} />
              </Field>
              <Field label="Stage">
                <select
                  value={draft.stage}
                  onChange={(e) => patch({ stage: e.target.value as ApplicationStage })}
                  className="w-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] px-3.5 py-2 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
                >
                  {STAGE_ORDER.map((s) => (
                    <option key={s} value={s}>{STAGE_LABELS[s]}</option>
                  ))}
                </select>
              </Field>
              <Field label="Location">
                <Input value={draft.location ?? ''} onChange={(e) => patch({ location: e.target.value })} />
              </Field>
              <Field label="Salary">
                <Input value={draft.salary ?? ''} onChange={(e) => patch({ salary: e.target.value })} placeholder="e.g. $90,000 – $120,000" />
              </Field>
              <Field label="Applied Date">
                <Input type="date" value={draft.appliedDate ?? ''} onChange={(e) => patch({ appliedDate: e.target.value })} />
              </Field>
              <Field label="Resume Version">
                <Input value={draft.resumeVersion ?? ''} onChange={(e) => patch({ resumeVersion: e.target.value })} />
              </Field>
              <Field label="Job Posting URL">
                <Input value={draft.url ?? ''} onChange={(e) => patch({ url: e.target.value })} placeholder="https://..." />
              </Field>
              <Field label="Notes">
                <textarea
                  value={draft.notes ?? ''}
                  onChange={(e) => patch({ notes: e.target.value })}
                  rows={4}
                  className="w-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] px-3.5 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] resize-none"
                />
              </Field>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm text-[hsl(var(--muted))] mb-1">Role</p>
                <p className="text-lg font-semibold">{application.role}</p>
              </div>

              <div>
                <p className="text-sm text-[hsl(var(--muted))] mb-2">Stage</p>
                <Badge variant={stageBadgeVariant[application.stage] ?? 'secondary'}>
                  {STAGE_LABELS[application.stage]}
                </Badge>
              </div>

              <div className="flex flex-col gap-2">
                {application.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 shrink-0 text-[hsl(var(--muted))]" />
                    <span>{application.location}</span>
                  </div>
                )}
                {application.salary && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 shrink-0 text-[hsl(var(--muted))]" />
                    <span>{application.salary}</span>
                  </div>
                )}
                {application.appliedDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 shrink-0 text-[hsl(var(--muted))]" />
                    <span>Applied {application.appliedDate}</span>
                  </div>
                )}
                {application.resumeVersion && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 shrink-0 text-[hsl(var(--muted))]" />
                    <span>Resume: {application.resumeVersion}</span>
                  </div>
                )}
                {application.url && (
                  <a
                    href={application.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[hsl(var(--primary))] hover:underline"
                  >
                    <ExternalLink className="h-4 w-4 shrink-0" />
                    View Job Posting
                  </a>
                )}
              </div>

              {application.notes && (
                <div>
                  <p className="text-sm text-[hsl(var(--muted))] mb-2">Notes</p>
                  <p className="text-sm leading-relaxed bg-[hsl(var(--surface-2))] rounded-[var(--radius)] p-4">
                    {application.notes}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-[hsl(var(--muted))] mb-3">Move to stage</p>
                <div className="flex flex-wrap gap-2">
                  {STAGE_ORDER.filter((s) => s !== application.stage).map((stage) => (
                    <button
                      key={stage}
                      onClick={() => { updateApplication(application.id, { stage }); onClose() }}
                      className="flex items-center gap-1.5 rounded-full bg-[hsl(var(--surface-2))] px-3 py-1.5 text-sm text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--border))] transition-colors"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                      {STAGE_LABELS[stage]}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </Sheet>
  )
}
