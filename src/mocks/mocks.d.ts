declare module '@/mocks/projects.mock' {
  import type { ApiResponse } from '@/types/api'
  import type { Project, SharedProject, CreateProjectPayload, ProjectListParams } from '@/types/project'
  export function getProjects(params?: ProjectListParams): Promise<ApiResponse<Project[]>>
  export function getProject(id: string): Promise<ApiResponse<Project>>
  export function getProjectByShareId(shareId: string): Promise<ApiResponse<SharedProject>>
  export function createProject(data: CreateProjectPayload): Promise<ApiResponse<Project>>
  export function updateProject(id: string, data: Partial<Project>): Promise<ApiResponse<Project>>
  export function deleteProject(id: string): Promise<ApiResponse<null>>
}

declare module '@/mocks/photos.mock' {
  import type { ApiResponse, PaginationParams } from '@/types/api'
  import type { Photo, PhotoUploadMeta, BulkDeleteResponse, SelectedPhotosResponse } from '@/types/photo'
  export function getPhotosByProject(projectId: string, params?: PaginationParams): Promise<ApiResponse<Photo[]>>
  export function getPhoto(id: string): Promise<ApiResponse<Photo>>
  export function uploadPhoto(projectId: string, file: File, meta?: PhotoUploadMeta): Promise<ApiResponse<Photo>>
  export function deletePhoto(id: string): Promise<ApiResponse<null>>
  export function bulkDeletePhotos(ids: string[]): Promise<ApiResponse<BulkDeleteResponse>>
  export function getSelectedPhotos(projectId: string): Promise<ApiResponse<SelectedPhotosResponse>>
}

declare module '@/mocks/selection.mock' {
  import type { ApiResponse } from '@/types/api'
  import type { Selection, ToggleResponse, CommentResponse, SubmitResponse } from '@/types/selection'
  export function getSelection(shareId: string): Promise<ApiResponse<Selection>>
  export function togglePhoto(shareId: string, photoId: string): Promise<ApiResponse<ToggleResponse>>
  export function setComment(shareId: string, photoId: string, comment: string): Promise<ApiResponse<CommentResponse>>
  export function submitSelection(shareId: string): Promise<ApiResponse<SubmitResponse>>
}
