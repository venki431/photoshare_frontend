import { apiClient, buildError } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse } from '@/types'
import type { Folder, CreateFolderPayload, UpdateFolderPayload } from '@/types'

async function safeCall<T>(fn: () => Promise<ApiResponse<T>>): Promise<ApiResponse<T>> {
  try {
    return await fn()
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'success' in err) throw err
    const message = err instanceof Error ? err.message : (err as { message?: string })?.message ?? 'Network error. Please try again.'
    throw buildError(message)
  }
}

export const folderService = {
  async getFolders(): Promise<ApiResponse<Folder[]>> {
    return safeCall(() => apiClient.get<Folder[]>(ENDPOINTS.FOLDERS.LIST))
  },

  async getFolder(id: string): Promise<ApiResponse<Folder>> {
    return safeCall(() => apiClient.get<Folder>(ENDPOINTS.FOLDERS.DETAIL(id)))
  },

  async createFolder(data: CreateFolderPayload): Promise<ApiResponse<Folder>> {
    return safeCall(() => apiClient.post<Folder>(ENDPOINTS.FOLDERS.CREATE, data))
  },

  async updateFolder(id: string, data: UpdateFolderPayload): Promise<ApiResponse<Folder>> {
    return safeCall(() => apiClient.put<Folder>(ENDPOINTS.FOLDERS.UPDATE(id), data))
  },

  async deleteFolder(id: string): Promise<ApiResponse<null>> {
    return safeCall(() => apiClient.delete<null>(ENDPOINTS.FOLDERS.DELETE(id)))
  },
}
