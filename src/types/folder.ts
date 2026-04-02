export interface Folder {
  id: string
  name: string
  userId: string
  projectCount: number
  shareId: string | null
  sharedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateFolderPayload {
  name: string
}

export interface UpdateFolderPayload {
  name: string
}
