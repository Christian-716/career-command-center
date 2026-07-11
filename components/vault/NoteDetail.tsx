'use client'
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { VaultResult } from '@/lib/types/vault'
import { useVaultStore } from '@/lib/stores/useVaultStore'
import { Sheet } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar, ExternalLink, FileText, Briefcase, Building2, Code2, BookOpen, Pencil, X, Check } from 'lucide-react'

const typeConfig: Record<VaultResult['type'], {
  icon: React.ElementType
  label: string
  badge: 'default' | 'secondary' | 'success' | 'warning' | 'destructive'
}> = {
  note:        { icon: BookOpen,  label: 'Note',        badge: 'secondary' },
  resume:      { icon: FileText,  label: 'Resume',      badge: 'default' },
  application: { icon: Briefcase, label: 'Application', badge: 'warning' },
  company:     { icon: Building2, label: 'Company',     badge: 'secondary' },
  project:     { icon: Code2,     label: 'Project',     badge: 'success' },
}

interface NoteDetailProps {
  result: VaultResult | null
  onClose: () => void
}

export function NoteDetail({ result, onClose }: NoteDetailProps) {
  const { results, updateResult } = useVaultStore()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Partial<VaultResult>>({})

  // Always show the live store version so edits are reflected immediately
  const live = result ? (results.find((r) => r.path === result.path) ?? result) : null

  useEffect(() => {
    setEditing(false)
    setDraft({})
  }, [result?.path])

  function startEdit() {
    if (!live) return
    setDraft({ title: live.title, excerpt: live.excerpt, content: live.content })
    setEditing(true)
  }

  function cancelEdit() {
    setDraft({})
    setEditing(false)
  }

  function saveEdit() {
    if (!live) return
    updateResult(live.path, draft)
    setEditing(false)
    setDraft({})
  }

  return (
    <Sheet open={!!result} onClose={() => { cancelEdit(); onClose() }} title={live?.title ?? ''} width="640px">
      {live && (() => {
        const { icon: Icon, label, badge } = typeConfig[live.type]
        const obsidianUri = `obsidian://open?vault=ProfessionalObsidian&file=${encodeURIComponent(live.path)}`

        return (
          <div className="p-6 flex flex-col gap-5">
            {/* Meta + actions row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-[hsl(var(--muted))]" />
                <Badge variant={badge}>{label}</Badge>
                {live.modifiedAt && (
                  <span className="flex items-center gap-1 text-xs text-[hsl(var(--muted))]">
                    <Calendar className="h-3 w-3" />
                    {live.modifiedAt}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {editing ? (
                  <>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      <X className="h-3.5 w-3.5" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={saveEdit}>
                      <Check className="h-3.5 w-3.5" />
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline" onClick={startEdit}>
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <a
                      href={obsidianUri}
                      className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted))] hover:text-[hsl(var(--primary))] transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Obsidian
                    </a>
                  </>
                )}
              </div>
            </div>

            {editing ? (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm text-[hsl(var(--muted))] mb-1.5 block">Title</label>
                  <Input
                    value={draft.title ?? ''}
                    onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm text-[hsl(var(--muted))] mb-1.5 block">Summary</label>
                  <textarea
                    value={draft.excerpt ?? ''}
                    onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))}
                    rows={2}
                    className="w-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] px-3.5 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-[hsl(var(--muted))] mb-1.5 block">Content (Markdown)</label>
                  <textarea
                    value={draft.content ?? ''}
                    onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
                    rows={20}
                    className="w-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] px-3.5 py-2 text-sm text-[hsl(var(--foreground))] font-mono placeholder:text-[hsl(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] resize-y"
                  />
                </div>
              </div>
            ) : (
              <div className="prose prose-sm prose-invert max-w-none
                [&_h1]:text-base [&_h1]:font-semibold [&_h1]:mt-0 [&_h1]:mb-3
                [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:text-[hsl(var(--foreground))]
                [&_h3]:text-sm [&_h3]:font-medium [&_h3]:mt-4 [&_h3]:mb-1.5 [&_h3]:text-[hsl(var(--foreground))]
                [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-[hsl(var(--foreground))] [&_p]:my-1.5
                [&_ul]:text-sm [&_ul]:my-1.5 [&_ul]:pl-4 [&_li]:my-0.5 [&_li]:text-[hsl(var(--foreground))]
                [&_strong]:font-semibold [&_strong]:text-[hsl(var(--foreground))]
                [&_em]:text-[hsl(var(--muted))] [&_em]:not-italic [&_em]:text-xs
                [&_code]:bg-[hsl(var(--surface-2))] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono [&_code]:text-[hsl(var(--primary))]
                [&_hr]:border-[hsl(var(--border))] [&_hr]:my-4
                [&_blockquote]:border-l-2 [&_blockquote]:border-[hsl(var(--border))] [&_blockquote]:pl-3 [&_blockquote]:text-[hsl(var(--muted))]">
                <ReactMarkdown
                  components={{
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--primary))] hover:underline">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {live.content ?? live.excerpt}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )
      })()}
    </Sheet>
  )
}
