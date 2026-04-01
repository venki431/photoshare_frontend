export type ProjectStatus = 'pending' | 'in_review' | 'completed'

export type EventType =
  | 'wedding'
  | 'birthday'
  | 'corporate'
  | 'engagement'
  | 'portrait'
  | 'event'
  | 'other'

export interface Project {
  id: string
  name: string
  eventType: EventType | string
  status: ProjectStatus
  imageCount: number
  selectedCount: number
  shareId: string
  password: string
  coverImage: string
  clientName: string
  clientEmail: string
  clientMobile: string
  notes: string
  allowComments: boolean
  selectionLimit: number | null
  createdAt: string
}

/** Project shape returned by the public share endpoint */
export interface SharedProject extends Omit<Project, 'password'> {
  hasPassword: boolean
}

export interface CreateProjectPayload {
  name: string
  eventType: string
  password?: string
  clientName?: string
  clientEmail?: string
  clientMobile?: string
  notes?: string
}

export interface ProjectListParams {
  page?: number
  perPage?: number
  status?: ProjectStatus
  search?: string
}

/** Extended project with images for detail views */
export interface ProjectWithImages extends Project {
  images: ProjectImage[]
}

export interface ProjectImage {
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
  selected: boolean
  comment: string
}
