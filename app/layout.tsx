import type { Metadata } from 'next'
import './globals.css'
import { GateProvider } from '@/components/providers/GateProvider'

export const metadata: Metadata = {
  title: 'Career Command Center',
  description: 'AI-powered job search assistant',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="flex h-screen overflow-hidden">
        <GateProvider>{children}</GateProvider>
      </body>
    </html>
  )
}
