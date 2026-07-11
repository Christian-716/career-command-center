export type TargetRole = 'backend' | 'fullstack' | 'java-backend' | 'new-grad-swe'

export interface StarStory {
  title: string
  situation: string
  task: string
  action: string
  result: string
}

export interface UserProfile {
  name: string
  email?: string
  background: string
  education: string
  topSkills: string[]
  projects: string[]
  starStories: StarStory[]
  workingStyle: string
  coreValues: string[]
  targetRole: TargetRole
  targetLocations: string[]
  salaryExpectation?: string
  dealbreakers: string[]
  completedAt: string
  avatarUrl?: string
}
