'use client'
import { create } from 'zustand'
import { Application, ApplicationStage } from '@/lib/types/application'
import { mockApplications } from '@/lib/mock/applications'

interface ApplicationsState {
  applications: Application[]
  pendingSelectId: string | null
  moveApplication: (id: string, stage: ApplicationStage) => void
  addApplication: (app: Application) => void
  updateApplication: (id: string, updates: Partial<Application>) => void
  setPendingSelectId: (id: string | null) => void
}

export const useApplicationsStore = create<ApplicationsState>()((set) => ({
  applications: mockApplications,
  pendingSelectId: null,
  moveApplication: (id, stage) =>
    set((s) => ({
      applications: s.applications.map((a) => (a.id === id ? { ...a, stage } : a)),
    })),
  addApplication: (app) =>
    set((s) => ({ applications: [...s.applications, app] })),
  updateApplication: (id, updates) =>
    set((s) => ({
      applications: s.applications.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),
  setPendingSelectId: (id) => set({ pendingSelectId: id }),
}))
