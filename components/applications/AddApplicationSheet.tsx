'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Sheet } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApplicationsStore } from '@/lib/stores/useApplicationsStore'
import { ApplicationStage, STAGE_LABELS, STAGE_ORDER } from '@/lib/types/application'

interface AddApplicationSheetProps {
  open: boolean
  onClose: () => void
}

const empty = {
  company: '',
  role: '',
  stage: 'interested' as ApplicationStage,
  location: '',
  salary: '',
  appliedDate: '',
  url: '',
  resumeVersion: '',
  notes: '',
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm text-[hsl(var(--muted))] mb-1.5 block">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-[hsl(var(--destructive))]">{error}</p>}
    </div>
  )
}

export function AddApplicationSheet({ open, onClose }: AddApplicationSheetProps) {
  const { addApplication } = useApplicationsStore()
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof typeof empty, string>>>({})

  function patch(key: keyof typeof empty, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validate() {
    const next: typeof errors = {}
    if (!form.company.trim()) next.company = 'Required'
    if (!form.role.trim()) next.role = 'Required'
    if (!form.location.trim()) next.location = 'Required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    addApplication({
      id: crypto.randomUUID(),
      company: form.company.trim(),
      role: form.role.trim(),
      stage: form.stage,
      location: form.location.trim(),
      ...(form.salary.trim() && { salary: form.salary.trim() }),
      ...(form.appliedDate && { appliedDate: form.appliedDate }),
      ...(form.url.trim() && { url: form.url.trim() }),
      ...(form.resumeVersion.trim() && { resumeVersion: form.resumeVersion.trim() }),
      ...(form.notes.trim() && { notes: form.notes.trim() }),
    })
    setForm(empty)
    setErrors({})
    onClose()
  }

  function handleClose() {
    setForm(empty)
    setErrors({})
    onClose()
  }

  return (
    <Sheet open={open} onClose={handleClose} title="Add Application">
      <div className="p-6 flex flex-col gap-5">
        <Field label="Company" error={errors.company}>
          <Input
            value={form.company}
            onChange={(e) => patch('company', e.target.value)}
            placeholder="e.g. Stripe"
          />
        </Field>

        <Field label="Role" error={errors.role}>
          <Input
            value={form.role}
            onChange={(e) => patch('role', e.target.value)}
            placeholder="e.g. Software Engineer, New Grad"
          />
        </Field>

        <Field label="Stage">
          <select
            value={form.stage}
            onChange={(e) => patch('stage', e.target.value)}
            className="w-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] px-3.5 py-2 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
          >
            {STAGE_ORDER.map((s) => (
              <option key={s} value={s}>{STAGE_LABELS[s]}</option>
            ))}
          </select>
        </Field>

        <Field label="Location" error={errors.location}>
          <Input
            value={form.location}
            onChange={(e) => patch('location', e.target.value)}
            placeholder="e.g. Remote, New York, NY"
          />
        </Field>

        <Field label="Salary">
          <Input
            value={form.salary}
            onChange={(e) => patch('salary', e.target.value)}
            placeholder="e.g. $90,000 – $120,000"
          />
        </Field>

        <Field label="Applied Date">
          <Input
            type="date"
            value={form.appliedDate}
            onChange={(e) => patch('appliedDate', e.target.value)}
          />
        </Field>

        <Field label="Job Posting URL">
          <Input
            value={form.url}
            onChange={(e) => patch('url', e.target.value)}
            placeholder="https://..."
          />
        </Field>

        <Field label="Resume Version">
          <Input
            value={form.resumeVersion}
            onChange={(e) => patch('resumeVersion', e.target.value)}
            placeholder="e.g. General, Epic TSE"
          />
        </Field>

        <Field label="Notes">
          <textarea
            value={form.notes}
            onChange={(e) => patch('notes', e.target.value)}
            rows={3}
            placeholder="Anything worth remembering about this role..."
            className="w-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] px-3.5 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] resize-none"
          />
        </Field>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            <Plus className="h-4 w-4" />
            Add Application
          </Button>
        </div>
      </div>
    </Sheet>
  )
}
