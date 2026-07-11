export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt?: Date
  citations?: VaultCitation[]
}

export interface VaultCitation {
  path: string
  title: string
  excerpt: string
}
