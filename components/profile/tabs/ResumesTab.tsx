'use client'
import { useState } from 'react'
import { Search, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { NoteDetail } from '@/components/vault/NoteDetail'
import { useVaultStore } from '@/lib/stores/useVaultStore'
import { VaultResult } from '@/lib/types/vault'

export function ResumesTab() {
  const { results } = useVaultStore()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<VaultResult | null>(null)

  const resumes = results
    .filter((r) => r.type === 'resume')
    .filter((r) =>
      !query ||
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.excerpt.toLowerCase().includes(query.toLowerCase())
    )

  return (
    <div className="p-6">
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted))]" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search resumes..." className="pl-10" />
      </div>

      {resumes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-[hsl(var(--muted))]">
          <FileText className="h-8 w-8 mb-2 opacity-30" />
          <p className="text-sm">No resumes found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {resumes.map((result) => (
            <div
              key={result.path}
              onClick={() => setSelected(result)}
              className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4 hover:border-[hsl(var(--primary)/0.4)] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-[hsl(var(--muted))]" />
                <span className="font-medium text-sm">{result.title}</span>
                <Badge variant="default">Resume</Badge>
              </div>
              <p className="text-sm text-[hsl(var(--muted))] line-clamp-2">{result.excerpt}</p>
            </div>
          ))}
        </div>
      )}

      <NoteDetail result={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
