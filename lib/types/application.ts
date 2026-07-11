export type ApplicationStage =
  | 'interested'
  | 'applying'
  | 'applied'
  | 'oa'
  | 'interview'
  | 'final'
  | 'offer'
  | 'rejected'

export interface Application {
  id: string
  company: string
  role: string
  location: string
  salary?: string
  stage: ApplicationStage
  appliedDate?: string
  notes?: string
  resumeVersion?: string
  url?: string
}

export const STAGE_LABELS: Record<ApplicationStage, string> = {
  interested: 'Interested',
  applying: 'Applying',
  applied: 'Applied',
  oa: 'Online Assessment',
  interview: 'Interview',
  final: 'Final Round',
  offer: 'Offer',
  rejected: 'Rejected',
}

export const STAGE_ORDER: ApplicationStage[] = [
  'interested', 'applying', 'applied', 'oa', 'interview', 'final', 'offer', 'rejected',
]
