import { apiClient, USE_MOCK, buildError } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse, PaginationParams } from '@/types'
import type { Photo, PhotoUploadMeta, BulkDeleteResponse, SelectedPhotosResponse } from '@/types'
import * as photoMock from '@/mocks/photos.mock'

async function safeCall<T>(fn: () => Promise<ApiResponse<T>>): Promise<ApiResponse<T>> {
  try {
    return await fn()
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'success' in err) throw err
    const message = err instanceof Error ? err.message : (err as { message?: string })?.message ?? 'Network error. Please try again.'
    throw buildError(message)
  }
}

interface UploadOptions {
  signal?: AbortSignal
  onProgress?: (pct: number) => void
}

export const photoService = {
  async getPhotosByProject(projectId: string, params: PaginationParams = {}): Promise<ApiResponse<Photo[]>> {
    if (USE_MOCK) return photoMock.getPhotosByProject(projectId, params)
    return safeCall(() =>
      apiClient.get<Photo[]>(ENDPOINTS.PHOTOS.LIST_BY_PROJECT(projectId), { params: params as Record<string, number> })
    )
  },

  async getPhoto(id: string): Promise<ApiResponse<Photo>> {
    if (USE_MOCK) return photoMock.getPhoto(id)
    return safeCall(() => apiClient.get<Photo>(ENDPOINTS.PHOTOS.DETAIL(id)))
  },

  async uploadPhoto(
    projectId: string,
    file: File | Blob,
    meta: PhotoUploadMeta = {},
    { signal, onProgress }: UploadOptions = {}
  ): Promise<ApiResponse<Photo>> {
    if (USE_MOCK) return photoMock.uploadPhoto(projectId, file as File, meta)

    return safeCall(async () => {
      const form = new FormData()
      form.append('photo', file)

      const token = localStorage.getItem('ps_auth_token')
      const url = `${import.meta.env.VITE_API_BASE_URL}/projects/${projectId}/photos`

      if (onProgress) {
        return new Promise<ApiResponse<Photo>>((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.open('POST', url)

          if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)
          if (meta.originalName) xhr.setRequestHeader('X-Original-Filename', meta.originalName)
          if (meta.originalSize) xhr.setRequestHeader('X-Original-Size', String(meta.originalSize))

          xhr.upload.onprogress = (e: ProgressEvent) => {
            if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
          }

          xhr.onload = () => {
            try {
              const json = JSON.parse(xhr.responseText) as ApiResponse<Photo>
              if (xhr.status >= 200 && xhr.status < 300) resolve(json)
              else reject({ message: (json as unknown as { message?: string })?.message ?? `HTTP ${xhr.status}` })
            } catch {
              reject({ message: `HTTP ${xhr.status}` })
            }
          }

          xhr.onerror = () => reject({ message: 'Network error' })
          xhr.onabort = () => reject({ message: 'Upload cancelled', cancelled: true })

          if (signal) {
            if (signal.aborted) { xhr.abort(); return }
            signal.addEventListener('abort', () => xhr.abort(), { once: true })
          }

          xhr.send(form)
        })
      }

      const headers: Record<string, string> = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }
      if (meta.originalName) headers['X-Original-Filename'] = meta.originalName
      if (meta.originalSize) headers['X-Original-Size'] = String(meta.originalSize)

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: form,
        signal,
      })
      const json = await response.json()
      if (!response.ok) throw { message: json?.message ?? `HTTP ${response.status}` }
      return json as ApiResponse<Photo>
    })
  },

  async deletePhoto(id: string): Promise<ApiResponse<null>> {
    if (USE_MOCK) return photoMock.deletePhoto(id)
    return safeCall(() => apiClient.delete<null>(ENDPOINTS.PHOTOS.DELETE(id)))
  },

  async bulkDeletePhotos(ids: string[]): Promise<ApiResponse<BulkDeleteResponse>> {
    if (USE_MOCK) return photoMock.bulkDeletePhotos(ids)
    return safeCall(() => apiClient.post<BulkDeleteResponse>(ENDPOINTS.PHOTOS.BULK_DELETE, { ids }))
  },

  async downloadSelectedNames(projectId: string): Promise<void> {
    const token = localStorage.getItem('ps_auth_token')
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.photoshare.app/v1'
    const url = `${baseUrl}${ENDPOINTS.PHOTOS.SELECTED_DOWNLOAD(projectId)}`
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (!res.ok) throw new Error('Failed to download selected image names')
    const text = await res.text()
    const blob = new Blob([text], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'selected_images.txt'
    a.click()
    URL.revokeObjectURL(a.href)
  },

  async getSelectedPhotos(projectId: string): Promise<ApiResponse<SelectedPhotosResponse>> {
    if (USE_MOCK) return photoMock.getSelectedPhotos(projectId)
    return safeCall(() =>
      apiClient.get<SelectedPhotosResponse>(ENDPOINTS.PHOTOS.SELECTED(projectId))
    )
  },
}
