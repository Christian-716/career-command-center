import { useDroppable } from '@dnd-kit/core'
import { Application, ApplicationStage, STAGE_LABELS } from '@/lib/types/application'
import { ApplicationCard } from './ApplicationCard'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  stage: ApplicationStage
  applications: Application[]
  onSelect: (app: Application) => void
}

const stageColors: Partial<Record<ApplicationStage, string>> = {
  offer: 'text-[hsl(var(--success))]',
  rejected: 'text-[hsl(var(--destructive))]',
  interview: 'text-[hsl(var(--warning))]',
  final: 'text-[hsl(var(--warning))]',
}

export function KanbanColumn({ stage, applications, onSelect }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex min-w-[220px] flex-1 flex-col rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))] transition-colors',
        isOver && 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.05)]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--border))]">
        <span className={cn('text-sm font-semibold uppercase tracking-wider', stageColors[stage] ?? 'text-[hsl(var(--muted))]')}>
          {STAGE_LABELS[stage]}
        </span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(var(--surface-2))] text-sm text-[hsl(var(--muted))]">
          {applications.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-2.5 min-h-[200px]">
        {applications.map((app) => (
          <ApplicationCard key={app.id} application={app} onSelect={onSelect} />
        ))}
        {applications.length === 0 && (
          <div className="flex flex-1 items-center justify-center text-xs text-[hsl(var(--muted))] opacity-50">
            Drop here
          </div>
        )}
      </div>
    </div>
  )
}
