'use client'
import { useState, useMemo } from 'react'
import { Building2, ChevronRight, Loader2, ExternalLink } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useApplicationsStore } from '@/lib/stores/useApplicationsStore'
import { useProfileStore } from '@/lib/stores/useProfileStore'
import { Application } from '@/lib/types/application'
import { STAGE_LABELS } from '@/lib/types/application'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'

interface CompanyGroup {
  company: string
  roles: Application[]
}

function stageBadgeVariant(stage: Application['stage']): 'default' | 'secondary' | 'success' | 'warning' | 'destructive' {
  if (stage === 'offer') return 'success'
  if (stage === 'rejected') return 'destructive'
  if (stage === 'interview' || stage === 'final') return 'warning'
  return 'secondary'
}

export default function InsightsPage() {
  const { applications } = useApplicationsStore()
  const { profile } = useProfileStore()
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<Application | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const grouped = useMemo<CompanyGroup[]>(() => {
    const map = new Map<string, Application[]>()
    for (const app of applications) {
      const list = map.get(app.company) ?? []
      map.set(app.company, [...list, app])
    }
    return Array.from(map.entries()).map(([company, roles]) => ({ company, roles }))
  }, [applications])

  const selectedRoles = grouped.find((g) => g.company === selectedCompany)?.roles ?? []

  function selectRole(role: Application) {
    if (selectedRole?.id === role.id) {
      setSelectedRole(null)
      setAnalysis('')
    } else {
      setSelectedRole(role)
      setAnalysis('')
      setJobDescription('')
    }
  }

  async function runAnalysis() {
    if (!jobDescription.trim() || !selectedRole) return
    setIsAnalyzing(true)
    setAnalysis('')

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          jobDescription,
          company: selectedRole.company,
          role: selectedRole.role,
        }),
      })

      if (!res.ok || !res.body) throw new Error('API error')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value, { stream: true })
        setAnalysis(fullText)
      }
    } catch {
      setAnalysis('Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Insights" subtitle="Analyze roles and match your profile" />

      <div className="flex flex-1 overflow-hidden">
        {/* Company list */}
        <div className="w-60 shrink-0 border-r border-[hsl(var(--border))] overflow-y-auto">
          <div className="p-3 space-y-0.5">
            {grouped.length === 0 ? (
              <div className="py-8 text-center text-[hsl(var(--muted))]">
                <Building2 className="h-6 w-6 mx-auto mb-2 opacity-30" />
                <p className="text-xs">No applications yet.</p>
                <Link href="/applications" className="text-xs text-[hsl(var(--primary))] hover:underline mt-1 block">
                  Add some
                </Link>
              </div>
            ) : (
              grouped.map(({ company, roles }) => (
                <button
                  key={company}
                  onClick={() => { setSelectedCompany(company); setSelectedRole(null); setAnalysis('') }}
                  className={cn(
                    'w-full flex items-center justify-between rounded-[var(--radius)] px-3 py-2.5 text-sm text-left transition-colors',
                    selectedCompany === company
                      ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]'
                      : 'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--surface-2))]'
                  )}
                >
                  <span className="font-medium truncate">{company}</span>
                  <span className={cn(
                    'ml-2 shrink-0 text-xs rounded-full px-1.5 py-0.5',
                    selectedCompany === company
                      ? 'bg-[hsl(var(--primary)/0.2)]'
                      : 'bg-[hsl(var(--surface-2))]'
                  )}>
                    {roles.length}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Role panel */}
        <div className="flex-1 overflow-y-auto">
          {!selectedCompany ? (
            <div className="flex flex-col items-center justify-center h-full text-[hsl(var(--muted))]">
              <ChevronRight className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">Select a company to see roles</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              <h2 className="text-lg font-bold">{selectedCompany}</h2>

              {selectedRoles.map((role) => (
                <div key={role.id} className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))] overflow-hidden">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{role.role}</span>
                        <Badge variant={stageBadgeVariant(role.stage)}>{STAGE_LABELS[role.stage]}</Badge>
                      </div>
                      <p className="text-xs text-[hsl(var(--muted))] mt-0.5">
                        {role.location}{role.salary ? ` · ${role.salary}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      {role.url && (
                        <a href={role.url} target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <Button
                        variant={selectedRole?.id === role.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => selectRole(role)}
                      >
                        {selectedRole?.id === role.id ? 'Close' : 'Analyze'}
                      </Button>
                    </div>
                  </div>

                  {selectedRole?.id === role.id && (
                    <div className="border-t border-[hsl(var(--border))] p-4 space-y-4">
                      <div>
                        <label className="text-sm text-[hsl(var(--muted))] mb-1.5 block">
                          Paste the job description
                        </label>
                        <textarea
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          rows={8}
                          placeholder="Copy and paste the full job description here..."
                          className="w-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] px-3.5 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] resize-none"
                        />
                      </div>

                      <Button
                        onClick={runAnalysis}
                        disabled={!jobDescription.trim() || isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <><Loader2 className="h-4 w-4 animate-spin" />Analyzing...</>
                        ) : (
                          'Run Analysis'
                        )}
                      </Button>

                      {(analysis || isAnalyzing) && (
                        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] p-4">
                          {isAnalyzing && !analysis && (
                            <div className="flex items-center gap-2 text-[hsl(var(--muted))] text-sm">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Analyzing...
                            </div>
                          )}
                          <ReactMarkdown
                            components={{
                              h2: ({ children }) => <h2 className="text-sm font-semibold mt-4 mb-1.5 first:mt-0">{children}</h2>,
                              p: ({ children }) => <p className="text-sm mb-2 last:mb-0 leading-relaxed">{children}</p>,
                              ul: ({ children }) => <ul className="text-sm list-disc pl-4 space-y-1 mb-2">{children}</ul>,
                              li: ({ children }) => <li>{children}</li>,
                              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            }}
                          >
                            {analysis}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
