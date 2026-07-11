'use client'
import Link from 'next/link'
import { Send, Calendar, TrendingUp, XCircle, Activity, Trophy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { mockMetrics } from '@/lib/mock/metrics'

const metrics = [
  { label: 'Submitted', value: mockMetrics.submitted, icon: Send, color: 'text-[hsl(var(--primary))]', href: '/applications' },
  { label: 'Interviews', value: mockMetrics.interviews, icon: Calendar, color: 'text-[hsl(var(--success))]', href: '/applications' },
  { label: 'Response Rate', value: `${mockMetrics.responseRate}%`, icon: TrendingUp, color: 'text-[hsl(var(--warning))]', href: '/applications' },
  { label: 'Rejections', value: mockMetrics.rejections, icon: XCircle, color: 'text-[hsl(var(--destructive))]', href: '/applications' },
  { label: 'Active', value: mockMetrics.active, icon: Activity, color: 'text-[hsl(var(--primary))]', href: '/applications' },
  { label: 'Offers', value: mockMetrics.offers, icon: Trophy, color: 'text-[hsl(var(--success))]', href: '/applications' },
]

export function MetricsGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {metrics.map(({ label, value, icon: Icon, color, href }) => (
        <Link key={label} href={href} className="group">
          <Card className="group-hover:border-[hsl(var(--primary)/0.4)] transition-colors cursor-pointer h-full">
            <CardContent className="p-4">
              <Icon className={`h-4 w-4 ${color} mb-2`} />
              <div className="text-3xl font-bold">{value}</div>
              <div className="text-sm text-[hsl(var(--muted))] mt-0.5">{label}</div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
