import { apiClient, USE_MOCK, buildError } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse } from '@/types'
import type { Selection, ToggleResponse, CommentResponse, SubmitResponse } from '@/types'
import * as selectionMock from '@/mocks/selection.mock'

async function safeCall<T>(fn: () => Promise<ApiResponse<T>>): Promise<ApiResponse<T>> {
  try {
    return await fn()
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'success' in err) throw err
    const message = err instanceof Error ? err.message : (err as { message?: string })?.message ?? 'Network error. Please try again.'
    throw buildError(message)
  }
}

export const selectionService = {
  async getSelection(shareId: string): Promise<ApiResponse<Selection>> {
    if (USE_MOCK) return selectionMock.getSelection(shareId)
    return safeCall(() => apiClient.get<Selection>(ENDPOINTS.SELECTIONS.GET_BY_SHARE(shareId)))
  },

  async togglePhoto(shareId: string, photoId: string): Promise<ApiResponse<ToggleResponse>> {
    if (USE_MOCK) return selectionMock.togglePhoto(shareId, photoId)
    return safeCall(() =>
      apiClient.post<ToggleResponse>(ENDPOINTS.SELECTIONS.TOGGLE_PHOTO(shareId), { photoId })
    )
  },

  async setComment(shareId: string, photoId: string, comment: string): Promise<ApiResponse<CommentResponse>> {
    if (USE_MOCK) return selectionMock.setComment(shareId, photoId, comment)
    return safeCall(() =>
      apiClient.post<CommentResponse>(ENDPOINTS.SELECTIONS.SET_COMMENT(shareId), { photoId, comment })
    )
  },

  async submitSelection(shareId: string): Promise<ApiResponse<SubmitResponse>> {
    if (USE_MOCK) return selectionMock.submitSelection(shareId)
    return safeCall(() => apiClient.post<SubmitResponse>(ENDPOINTS.SELECTIONS.SUBMIT(shareId), {}))
  },
}
