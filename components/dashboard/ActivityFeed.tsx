'use client'
import { useRouter } from 'next/navigation'
import { FileText, Briefcase, Search, Star, GitBranch, Clock } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { mockActivity } from '@/lib/mock/metrics'
import { useApplicationsStore } from '@/lib/stores/useApplicationsStore'

const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  application: { icon: Briefcase, color: 'text-[hsl(var(--primary))]' },
  resume:      { icon: FileText,  color: 'text-[hsl(var(--success))]' },
  research:    { icon: Search,    color: 'text-[hsl(var(--warning))]' },
  interview:   { icon: Star,      color: 'text-[hsl(var(--warning))]' },
  update:      { icon: GitBranch, color: 'text-[hsl(var(--muted))]' },
  vault:       { icon: GitBranch, color: 'text-[hsl(var(--muted))]' },
}

export function ActivityFeed() {
  const router = useRouter()
  const { setPendingSelectId } = useApplicationsStore()

  function handleClick(item: typeof mockActivity[number]) {
    if (item.appId) {
      setPendingSelectId(item.appId)
      router.push('/applications')
    } else if (item.vaultPath) {
      router.push('/vault')
    } else if (item.type === 'resume') {
      router.push('/profile')
    } else {
      router.push('/vault')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-[hsl(var(--border))]">
          {mockActivity.map((item) => {
            const { icon: Icon, color } = typeConfig[item.type] ?? typeConfig.update
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleClick(item)}
                  className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-[hsl(var(--surface-2))] transition-colors text-left"
                >
                  <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">{item.action}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-xs text-[hsl(var(--muted))]">
                    <Clock className="h-3 w-3" />
                    {item.time}
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
