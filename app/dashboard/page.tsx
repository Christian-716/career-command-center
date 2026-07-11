'use client'
import { TopBar } from '@/components/layout/TopBar'
import { MetricsGrid } from '@/components/dashboard/MetricsGrid'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { InsightsPanel } from '@/components/dashboard/InsightsPanel'

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Dashboard" subtitle="Your job search at a glance" />
      <div className="flex-1 overflow-y-auto p-6">
        <MetricsGrid />
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ActivityFeed />
          <InsightsPanel />
        </div>
      </div>
    </div>
  )
}
