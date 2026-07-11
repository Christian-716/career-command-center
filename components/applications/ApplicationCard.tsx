'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MapPin, DollarSign, Calendar, GripVertical } from 'lucide-react'
import { Application } from '@/lib/types/application'
import { cn } from '@/lib/utils'

interface ApplicationCardProps {
  application: Application
  isDragging?: boolean
  onSelect?: (app: Application) => void
}

export function ApplicationCard({ application, isDragging, onSelect }: ApplicationCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortDragging } =
    useSortable({ id: application.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        'rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] select-none',
        'hover:border-[hsl(var(--primary)/0.5)] transition-colors',
        (isSortDragging || isDragging) && 'opacity-50 shadow-lg'
      )}
    >
      {/* Clickable body */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => onSelect?.(application)}
      >
        <div className="text-base font-medium leading-tight">{application.company}</div>
        <div className="mt-0.5 text-sm text-[hsl(var(--muted))] leading-tight">{application.role}</div>

        <div className="mt-2.5 flex flex-col gap-1.5">
          {application.location && (
            <div className="flex items-center gap-1.5 text-sm text-[hsl(var(--muted))]">
              <MapPin className="h-4 w-4 shrink-0" />
              {application.location}
            </div>
          )}
          {application.salary && (
            <div className="flex items-center gap-1.5 text-sm text-[hsl(var(--muted))]">
              <DollarSign className="h-4 w-4 shrink-0" />
              {application.salary}
            </div>
          )}
          {application.appliedDate && (
            <div className="flex items-center gap-1.5 text-sm text-[hsl(var(--muted))]">
              <Calendar className="h-4 w-4 shrink-0" />
              {application.appliedDate}
            </div>
          )}
        </div>

        {application.notes && (
          <p className="mt-2.5 text-sm text-[hsl(var(--muted))] leading-snug line-clamp-2 border-t border-[hsl(var(--border))] pt-2.5">
            {application.notes}
          </p>
        )}
      </div>

      {/* Drag handle — only this element triggers drag */}
      <div
        {...listeners}
        className="flex items-center justify-center h-7 border-t border-[hsl(var(--border))] cursor-grab hover:bg-[hsl(var(--surface))] rounded-b-md transition-colors active:cursor-grabbing"
      >
        <GripVertical className="h-3.5 w-3.5 text-[hsl(var(--border))] hover:text-[hsl(var(--muted))]" />
      </div>
    </div>
  )
}
