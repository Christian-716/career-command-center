'use client'
import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, FileText, Briefcase, Building2, Code2, BookOpen } from 'lucide-react'
import { VaultResult } from '@/lib/types/vault'
import { useVaultStore } from '@/lib/stores/useVaultStore'
import { NoteDetail } from '@/components/vault/NoteDetail'
import { cn } from '@/lib/utils'

type FilterType = 'all' | VaultResult['type']

const typeConfig: Record<VaultResult['type'], { icon: React.ElementType; label: string; badge: BadgeVariant }> = {
  note: { icon: BookOpen, label: 'Note', badge: 'secondary' },
  resume: { icon: FileText, label: 'Resume', badge: 'default' },
  application: { icon: Briefcase, label: 'Application', badge: 'warning' },
  company: { icon: Building2, label: 'Company', badge: 'secondary' },
  project: { icon: Code2, label: 'Project', badge: 'success' },
}

type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'destructive'

export default function VaultPage() {
  const { results: allResults } = useVaultStore()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [selectedResult, setSelectedResult] = useState<VaultResult | null>(null)

  const results = allResults.filter((r) => {
    const matchesFilter = filter === 'all' || r.type === filter
    const matchesQuery =
      !query ||
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.excerpt.toLowerCase().includes(query.toLowerCase())
    return matchesFilter && matchesQuery
  })

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'resume', label: 'Resumes' },
    { value: 'application', label: 'Applications' },
    { value: 'company', label: 'Companies' },
    { value: 'project', label: 'Projects' },
    { value: 'note', label: 'Notes' },
  ]

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Vault Search" subtitle="Search across all your Obsidian notes" />
      <div className="flex-1 overflow-y-auto p-6">
        {/* Search bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[hsl(var(--muted))]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, resumes, applications, companies..."
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {filters.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm transition-colors',
                filter === value
                  ? 'bg-[hsl(var(--primary))] text-white'
                  : 'bg-[hsl(var(--surface-2))] text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="space-y-3">
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-[hsl(var(--muted))]">
              <Search className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">No results for &quot;{query}&quot;</p>
            </div>
          ) : (
            results.map((result) => {
              const { icon: Icon, label, badge } = typeConfig[result.type]
              return (
                <div
                  key={result.path}
                  onClick={() => setSelectedResult(result)}
                  className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-5 hover:border-[hsl(var(--primary)/0.4)] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="h-4 w-4 text-[hsl(var(--muted))]" />
                    <span className="text-base font-medium">{result.title}</span>
                    <Badge variant={badge}>{label}</Badge>
                  </div>
                  <p className="text-sm text-[hsl(var(--muted))] leading-relaxed line-clamp-2">{result.excerpt}</p>
                  <p className="mt-1.5 text-sm text-[hsl(var(--border))] font-mono">{result.path}</p>
                </div>
              )
            })
          )}
        </div>
      </div>
      <NoteDetail result={selectedResult} onClose={() => setSelectedResult(null)} />
    </div>
  )
}
