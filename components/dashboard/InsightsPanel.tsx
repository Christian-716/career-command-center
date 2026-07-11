'use client'
import { Lightbulb, AlertTriangle, TrendingUp, Clock, X } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAppStore } from '@/lib/stores/useAppStore'

type Insight = { id: string; type: 'tip' | 'warning' | 'trend' | 'deadline'; text: string }

const insightsByRole: Record<string, Insight[]> = {
  backend: [
    { id: '1', type: 'warning', text: 'Only 2 applications submitted. Backend SWE roles typically need 20–30 apps for 3–5 interviews.' },
    { id: '2', type: 'tip', text: 'Your Java + C# combo is rare for a new grad. Lead with both in every application.' },
    { id: '3', type: 'deadline', text: 'Veeva reapply window opens October 4, 2026.' },
    { id: '4', type: 'trend', text: 'Backend roles with Spring Boot or ASP.NET Core are getting more responses.' },
  ],
  'java-backend': [
    { id: '1', type: 'warning', text: 'Your Blog API is in progress. Finishing it would close the biggest gap for Java-first roles.' },
    { id: '2', type: 'tip', text: 'Add "Spring Data JPA" and "Hibernate" to your skills — they appear in 80% of Java JDs you\'ve looked at.' },
    { id: '3', type: 'deadline', text: 'Veeva reapply window opens October 4, 2026.' },
    { id: '4', type: 'trend', text: 'Fintech and healthtech companies like Veeva and Upstart strongly favor Java backend.' },
  ],
  fullstack: [
    { id: '1', type: 'warning', text: 'No frontend projects yet. Career Command Center is a good first one — add it when it ships.' },
    { id: '2', type: 'tip', text: 'React + Next.js are in over 60% of full-stack JDs. Your current projects don\'t show this.' },
    { id: '3', type: 'deadline', text: 'Veeva reapply window opens October 4, 2026.' },
    { id: '4', type: 'trend', text: 'Full-stack roles with TypeScript + Java or Python backend are easiest to get interviews for.' },
  ],
  'new-grad-swe': [
    { id: '1', type: 'warning', text: 'Application volume is low. New grad success rate typically requires 30–50 apps.' },
    { id: '2', type: 'tip', text: 'Handshake is underused — OSU has strong employer connections there for recent grads.' },
    { id: '3', type: 'deadline', text: 'Veeva reapply window opens October 4, 2026.' },
    { id: '4', type: 'trend', text: 'Your 3.23 GPA and two complete projects put you in the top tier of new grad applicants.' },
  ],
}

const icons = {
  tip:      { icon: Lightbulb,      color: 'text-[hsl(var(--primary))]',     bg: 'bg-[hsl(var(--primary)/0.1)]' },
  warning:  { icon: AlertTriangle,  color: 'text-[hsl(var(--warning))]',     bg: 'bg-[hsl(var(--warning)/0.1)]' },
  trend:    { icon: TrendingUp,     color: 'text-[hsl(var(--success))]',     bg: 'bg-[hsl(var(--success)/0.1)]' },
  deadline: { icon: Clock,          color: 'text-[hsl(var(--destructive))]', bg: 'bg-[hsl(var(--destructive)/0.1)]' },
}

export function InsightsPanel() {
  const { targetRole, dismissedInsights, dismissInsight, resetInsights } = useAppStore()
  const insights = insightsByRole[targetRole] ?? insightsByRole['new-grad-swe']

  const visible = insights.filter((i) => !dismissedInsights.includes(i.id + targetRole))

  function dismiss(id: string) {
    dismissInsight(id + targetRole)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3 text-sm text-[hsl(var(--muted))]">
            <p>All caught up.</p>
            <button onClick={resetInsights} className="text-xs underline hover:text-[hsl(var(--foreground))] transition-colors">
              Show again
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-[hsl(var(--border))]">
            {visible.map((insight) => {
              const { icon: Icon, color, bg } = icons[insight.type]
              return (
                <li key={insight.id} className="flex items-start gap-3 px-4 py-3.5 group">
                  <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${bg}`}>
                    <Icon className={`h-3 w-3 ${color}`} />
                  </div>
                  <p className="text-sm leading-snug flex-1">{insight.text}</p>
                  <button
                    onClick={() => dismiss(insight.id)}
                    className="mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                    aria-label="Dismiss insight"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
