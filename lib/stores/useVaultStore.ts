'use client'
import { create } from 'zustand'
import { VaultResult } from '@/lib/types/vault'
import { mockVaultResults } from '@/lib/mock/vaultResults'

interface VaultState {
  results: VaultResult[]
  updateResult: (path: string, updates: Partial<VaultResult>) => void
}

export const useVaultStore = create<VaultState>()((set) => ({
  results: mockVaultResults,
  updateResult: (path, updates) =>
    set((s) => ({
      results: s.results.map((r) => (r.path === path ? { ...r, ...updates } : r)),
    })),
}))
