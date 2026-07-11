'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useProfileStore } from '@/lib/stores/useProfileStore'
import { Sidebar } from '@/components/layout/Sidebar'

export function GateProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const { isComplete } = useProfileStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (!isComplete && pathname !== '/onboarding') {
      router.replace('/onboarding')
    } else if (isComplete && pathname === '/onboarding') {
      router.replace('/dashboard')
    }
  }, [mounted, isComplete, pathname, router])

  if (!mounted) return null
  if (!isComplete && pathname !== '/onboarding') return null
  if (isComplete && pathname === '/onboarding') return null

  if (pathname === '/onboarding') {
    return <>{children}</>
  }

  return (
    <>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </>
  )
}
