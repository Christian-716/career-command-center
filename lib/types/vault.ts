export interface VaultResult {
  path: string
  title: string
  excerpt: string
  content?: string
  type: 'note' | 'resume' | 'application' | 'company' | 'project'
  modifiedAt?: string
}
