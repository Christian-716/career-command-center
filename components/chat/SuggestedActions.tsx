interface SuggestedActionsProps {
  actions: string[]
  onSelect: (action: string) => void
}

export function SuggestedActions({ actions, onSelect }: SuggestedActionsProps) {
  return (
    <div className="mb-2 flex flex-wrap gap-2">
      {actions.map((action) => (
        <button
          key={action}
          onClick={() => onSelect(action)}
          className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-3 py-1 text-xs text-[hsl(var(--muted))] hover:border-[hsl(var(--primary)/0.5)] hover:text-[hsl(var(--foreground))] transition-colors"
        >
          {action}
        </button>
      ))}
    </div>
  )
}
