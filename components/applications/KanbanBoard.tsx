'use client'
import {
  DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent,
  MouseSensor, TouchSensor, useSensor, useSensors, closestCorners, UniqueIdentifier,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import { Application, ApplicationStage, STAGE_ORDER } from '@/lib/types/application'
import { useApplicationsStore } from '@/lib/stores/useApplicationsStore'
import { KanbanColumn } from './KanbanColumn'
import { ApplicationCard } from './ApplicationCard'

interface KanbanBoardProps {
  onSelect: (app: Application) => void
}

function getTargetStage(
  over: { id: UniqueIdentifier; data: { current?: Record<string, unknown> } } | null
): ApplicationStage | null {
  if (!over) return null
  const overId = String(over.id)
  // Dropped directly on a column
  if (STAGE_ORDER.includes(overId as ApplicationStage)) return overId as ApplicationStage
  // Dropped on a card — get its SortableContext container id (which is the stage)
  const containerId = String(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (over.data?.current as any)?.sortable?.containerId ?? ''
  )
  if (STAGE_ORDER.includes(containerId as ApplicationStage)) return containerId as ApplicationStage
  return null
}

export function KanbanBoard({ onSelect }: KanbanBoardProps) {
  const { applications, moveApplication } = useApplicationsStore()
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  )

  const activeApp = activeId ? applications.find((a) => a.id === activeId) : null

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string)
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    const targetStage = getTargetStage(over)
    if (targetStage) moveApplication(active.id as string, targetStage)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null)
    const targetStage = getTargetStage(over)
    if (targetStage) moveApplication(active.id as string, targetStage)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="inline-flex min-w-full gap-3 h-full pb-2">
        {STAGE_ORDER.map((stage) => {
          const columnApps = applications.filter((a) => a.stage === stage)
          return (
            <SortableContext
              key={stage}
              id={stage}
              items={columnApps.map((a) => a.id)}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn stage={stage} applications={columnApps} onSelect={onSelect} />
            </SortableContext>
          )
        })}
      </div>
      <DragOverlay>
        {activeApp ? <ApplicationCard application={activeApp} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  )
}
