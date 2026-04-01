export interface Photo {
  id: string
  projectId: string
  filename: string
  originalFileName: string
  compressedFileName: string
  url: string
  thumbUrl: string
  cloudinaryId: string
  width: number
  height: number
  size: number
  sizeOriginal: number
  sizeCompressed: number
  mimeType: string
  uploadStatus: string
  takenAt: string | null
  createdAt: string
  selectedByClient: boolean
}

export interface PhotoUploadMeta {
  originalName?: string
  originalSize?: number
  compressedSize?: number
  fileKey?: string
}

export interface BulkDeleteResponse {
  deletedCount: number
}

export interface SelectedPhotosResponse {
  photos: SelectedPhoto[]
  totalSelected: number
}

export interface SelectedPhoto {
  photoId: string
  originalFileName: string
  compressedFileName: string
  storageUrl: string
  thumbnailUrl: string
  sizeOriginal: number
  sizeCompressed: number
  mimeType: string
  width: number
  height: number
  uploadedAt: string
}
