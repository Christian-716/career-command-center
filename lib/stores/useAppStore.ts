'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TargetRole } from '@/lib/types/profile'

interface AppState {
  sidebarCollapsed: boolean
  targetRole: TargetRole
  dismissedInsights: string[]
  setSidebarCollapsed: (v: boolean) => void
  toggleSidebar: () => void
  setTargetRole: (role: TargetRole) => void
  dismissInsight: (id: string) => void
  resetInsights: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      targetRole: 'new-grad-swe',
      dismissedInsights: [],
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setTargetRole: (role) => set({ targetRole: role }),
      dismissInsight: (id) => set((s) => ({ dismissedInsights: [...s.dismissedInsights, id] })),
      resetInsights: () => set({ dismissedInsights: [] }),
    }),
    { name: 'app-store' }
  )
)
