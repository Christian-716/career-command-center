'use client'
import { useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import { useApplicationsStore } from '@/lib/stores/useApplicationsStore'
import { Application, STAGE_LABELS } from '@/lib/types/application'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ApplicationTableProps {
  onSelect: (app: Application) => void
}

type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'destructive'
const stageBadge: Record<string, BadgeVariant> = {
  offer: 'success', rejected: 'destructive',
  interview: 'warning', final: 'warning', applied: 'default',
  oa: 'default', interested: 'secondary', applying: 'secondary',
}

type SortKey = 'company' | 'role' | 'stage' | 'location' | 'appliedDate'

const cols: { key: SortKey; label: string; className: string }[] = [
  { key: 'company',     label: 'Company',  className: 'w-[180px]' },
  { key: 'role',        label: 'Role',     className: 'flex-1 min-w-0' },
  { key: 'stage',       label: 'Stage',    className: 'w-[170px]' },
  { key: 'location',    label: 'Location', className: 'w-[150px]' },
  { key: 'appliedDate', label: 'Applied',  className: 'w-[120px]' },
]

export function ApplicationTable({ onSelect }: ApplicationTableProps) {
  const { applications } = useApplicationsStore()
  const [sortKey, setSortKey] = useState<SortKey>('company')
  const [sortAsc, setSortAsc] = useState(true)

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((a) => !a)
    else { setSortKey(key); setSortAsc(true) }
  }

  const sorted = [...applications].sort((a, b) => {
    const av = String(a[sortKey] ?? '')
    const bv = String(b[sortKey] ?? '')
    return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av)
  })

  return (
    <div className="p-4">
      <div className="rounded-lg border border-[hsl(var(--border))] overflow-hidden">
        {/* Header */}
        <div className="flex bg-[hsl(var(--surface-2))] border-b border-[hsl(var(--border))]">
          {cols.map(({ key, label, className }) => (
            <button
              key={key}
              onClick={() => toggleSort(key)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors text-left shrink-0',
                className
              )}
            >
              {label}
              <ArrowUpDown className="h-3 w-3 opacity-40" />
            </button>
          ))}
          <div className="flex-1 px-4 py-3 text-sm font-medium text-[hsl(var(--muted))]">Salary</div>
        </div>

        {/* Rows */}
        {sorted.map((app) => (
          <div
            key={app.id}
            onClick={() => onSelect(app)}
            className="flex items-center border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--surface-2))] transition-colors cursor-pointer"
          >
            <div className="w-[180px] shrink-0 px-4 py-3.5 text-sm font-medium">{app.company}</div>
            <div className="flex-1 min-w-0 px-4 py-3.5 text-sm text-[hsl(var(--muted))] truncate">{app.role}</div>
            <div className="w-[170px] shrink-0 px-4 py-3.5">
              <Badge variant={stageBadge[app.stage] ?? 'secondary'}>
                {STAGE_LABELS[app.stage]}
              </Badge>
            </div>
            <div className="w-[150px] shrink-0 px-4 py-3.5 text-sm text-[hsl(var(--muted))]">{app.location || '—'}</div>
            <div className="w-[120px] shrink-0 px-4 py-3.5 text-sm text-[hsl(var(--muted))]">{app.appliedDate ?? '—'}</div>
            <div className="flex-1 px-4 py-3.5 text-sm text-[hsl(var(--muted))] truncate">{app.salary ?? '—'}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-[hsl(var(--muted))]">
        {sorted.length} applications — click any row to view or edit
      </p>
    </div>
  )
}
