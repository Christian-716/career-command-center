'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { OnboardingChat, INITIAL_MESSAGE } from '@/components/onboarding/OnboardingChat'
import { OnboardingReview } from '@/components/onboarding/OnboardingReview'
import { OnboardingConfirm } from '@/components/onboarding/OnboardingConfirm'
import { useProfileStore } from '@/lib/stores/useProfileStore'
import { Message } from '@/lib/types/message'
import { UserProfile } from '@/lib/types/profile'

type Step = 'chat' | 'review' | 'confirm'

const STEP_LABELS = ['Interview', 'Review', 'Confirm']

const PROFILE_ITEMS = [
  'Background & education',
  'Skills & projects',
  'Target roles & locations',
  'STAR interview stories',
  'Work preferences & values',
]

function StepIndicator({ current }: { current: Step }) {
  const steps: Step[] = ['chat', 'review', 'confirm']
  const currentIndex = steps.indexOf(current)
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-colors ${
            i <= currentIndex
              ? 'bg-[hsl(var(--primary))] text-white'
              : 'bg-[hsl(var(--surface-2))] text-[hsl(var(--muted))]'
          }`}>
            {i < currentIndex ? '✓' : i + 1}
          </div>
          <span className={`text-sm ${i === currentIndex ? 'text-[hsl(var(--foreground))] font-medium' : 'text-[hsl(var(--muted))]'}`}>
            {STEP_LABELS[i]}
          </span>
          {i < steps.length - 1 && (
            <div className={`w-8 h-px mx-1 ${i < currentIndex ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--border))]'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const { setProfile } = useProfileStore()
  const [step, setStep] = useState<Step>('chat')
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [draft, setDraft] = useState<UserProfile | null>(null)

  function handleFinishChat(msgs: Message[]) {
    const firstUserMsg = msgs.find((m) => m.role === 'user')?.content ?? ''
    const guessedName = firstUserMsg.split(/[\s,]/)[0] ?? ''

    setDraft({
      name: guessedName,
      email: '',
      background: '',
      education: '',
      topSkills: [],
      projects: [],
      starStories: [],
      workingStyle: '',
      coreValues: [],
      targetRole: 'new-grad-swe',
      targetLocations: [],
      salaryExpectation: '',
      dealbreakers: [],
      completedAt: '',
    })
    setStep('review')
  }

  function patchDraft(updates: Partial<UserProfile>) {
    setDraft((prev) => (prev ? { ...prev, ...updates } : prev))
  }

  function handleConfirm() {
    if (!draft) return
    setProfile({ ...draft, completedAt: new Date().toISOString() })
    router.replace('/dashboard')
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[hsl(var(--background))]">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-[hsl(var(--border))] shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[hsl(var(--primary))]">
            <span className="text-white text-sm font-bold">C</span>
          </div>
          <span className="font-semibold text-sm">Career Command Center</span>
        </div>
        <StepIndicator current={step} />
        <div className="w-48" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {step === 'chat' ? (
          <div className="flex h-full">
            {/* Left info panel */}
            <div className="w-72 shrink-0 border-r border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-8 flex flex-col">
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-1.5">Build your profile</h2>
                <p className="text-sm text-[hsl(var(--muted))] leading-relaxed">
                  Answer a few questions so your AI assistant knows who you are and what you're looking for.
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {PROFILE_ITEMS.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-[hsl(var(--muted))]">
                    <CheckCircle2 className="h-4 w-4 text-[hsl(var(--primary))] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <p className="text-xs text-[hsl(var(--muted))]">
                  Takes about 5-10 minutes. You can edit everything after.
                </p>
              </div>
            </div>

            {/* Chat */}
            <div className="flex-1 overflow-hidden">
              <OnboardingChat
                messages={messages}
                setMessages={setMessages}
                onFinish={handleFinishChat}
              />
            </div>
          </div>
        ) : step === 'review' && draft ? (
          <div className="h-full overflow-hidden max-w-2xl w-full mx-auto">
            <OnboardingReview
              draft={draft}
              onChange={patchDraft}
              onConfirm={() => setStep('confirm')}
              onBack={() => setStep('chat')}
            />
          </div>
        ) : step === 'confirm' && draft ? (
          <OnboardingConfirm
            profile={draft}
            onConfirm={handleConfirm}
            onBack={() => setStep('review')}
          />
        ) : null}
      </div>
    </div>
  )
}
