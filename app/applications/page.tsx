'use client'
import { useRef, useEffect, useState } from 'react'
import { LayoutGrid, List, Plus } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { KanbanBoard } from '@/components/applications/KanbanBoard'
import { ApplicationDetail } from '@/components/applications/ApplicationDetail'
import { ApplicationTable } from '@/components/applications/ApplicationTable'
import { AddApplicationSheet } from '@/components/applications/AddApplicationSheet'
import { Button } from '@/components/ui/button'
import { Application } from '@/lib/types/application'
import { useApplicationsStore } from '@/lib/stores/useApplicationsStore'
import { cn } from '@/lib/utils'

export default function ApplicationsPage() {
  const { applications, pendingSelectId, setPendingSelectId } = useApplicationsStore()
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [view, setView] = useState<'board' | 'table'>('board')
  const [adding, setAdding] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-open application detail when navigated here from activity feed
  useEffect(() => {
    if (pendingSelectId) {
      const app = applications.find((a) => a.id === pendingSelectId)
      if (app) setSelectedApp(app)
      setPendingSelectId(null)
    }
  }, [pendingSelectId, applications, setPendingSelectId])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY
        e.preventDefault()
      }
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Applications" subtitle="Track and manage your job applications" />

      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))]">
        <button
          onClick={() => setView('board')}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors',
            view === 'board'
              ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]'
              : 'text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--surface-2))]'
          )}
        >
          <LayoutGrid className="h-4 w-4" />
          Board
        </button>
        <button
          onClick={() => setView('table')}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors',
            view === 'table'
              ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]'
              : 'text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--surface-2))]'
          )}
        >
          <List className="h-4 w-4" />
          Table
        </button>
        <div className="ml-auto">
          <Button size="sm" onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4" />
            Add Application
          </Button>
        </div>
      </div>

      {view === 'board' ? (
        <div ref={scrollRef} className="flex-1 overflow-x-auto overflow-y-hidden p-4">
          <KanbanBoard onSelect={setSelectedApp} />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <ApplicationTable onSelect={setSelectedApp} />
        </div>
      )}

      <ApplicationDetail
        application={selectedApp}
        onClose={() => setSelectedApp(null)}
      />
      <AddApplicationSheet open={adding} onClose={() => setAdding(false)} />
    </div>
  )
}
