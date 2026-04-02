export interface Folder {
  id: string
  name: string
  userId: string
  projectCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateFolderPayload {
  name: string
}

export interface UpdateFolderPayload {
  name: string
}
