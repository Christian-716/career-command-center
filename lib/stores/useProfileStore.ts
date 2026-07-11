'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserProfile } from '@/lib/types/profile'

interface ProfileState {
  profile: UserProfile | null
  isComplete: boolean
  setProfile: (profile: UserProfile) => void
  clearProfile: () => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      isComplete: false,
      setProfile: (profile) => set({ profile, isComplete: true }),
      clearProfile: () => set({ profile: null, isComplete: false }),
    }),
    { name: 'profile-store' }
  )
)
