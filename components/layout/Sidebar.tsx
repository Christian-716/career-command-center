'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, MessageSquare, Briefcase,
  Search, ChevronLeft, ChevronRight, Zap, User, Lightbulb,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/stores/useAppStore'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/applications', label: 'Applications', icon: Briefcase },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/insights', label: 'Insights', icon: Lightbulb },
  { href: '/vault', label: 'Vault', icon: Search },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useAppStore()

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 64 : 220 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="relative flex h-screen flex-col border-r border-[hsl(var(--border))] bg-[hsl(var(--surface))]"
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-4 border-b border-[hsl(var(--border))]">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[hsl(var(--primary))]">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-sm font-semibold whitespace-nowrap overflow-hidden"
            >
              Career Hub
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <ul className="flex flex-col gap-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-[var(--radius)] px-3 py-2.5 text-sm transition-colors',
                    active
                      ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]'
                      : 'text-[hsl(var(--muted))] hover:bg-[hsl(var(--surface-2))] hover:text-[hsl(var(--foreground))]'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-[4rem] z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors"
      >
        {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </motion.aside>
  )
}
