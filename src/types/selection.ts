export interface Selection {
  shareId: string
  projectId: string
  selectedIds: string[]
  comments: Record<string, string>
  status: 'draft' | 'submitted'
  submittedAt: string | null
}

export interface ToggleResponse {
  selectedIds: string[]
}

export interface CommentResponse {
  comments: Record<string, string>
}

export interface SubmitResponse {
  shareId: string
  selectedCount: number
  submittedAt: string
}
