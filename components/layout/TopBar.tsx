interface TopBarProps {
  title: string
  subtitle?: string
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-6">
      <div>
        <h1 className="text-base font-semibold">{title}</h1>
        {subtitle && <p className="text-sm text-[hsl(var(--muted))]">{subtitle}</p>}
      </div>
    </header>
  )
}
