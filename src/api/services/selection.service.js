/**
 * Selection Service — client photo selection flow.
 *
 * Used exclusively by the public gallery views (no auth required).
 * The shareId acts as the session identifier.
 */

import { apiClient, USE_MOCK, buildError } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import * as selectionMock from '@/mocks/selection.mock'

async function safeCall(fn) {
  try {
    return await fn()
  } catch (err) {
    if (err && 'success' in err) throw err
    throw buildError(err?.message || 'Network error. Please try again.')
  }
}

export const selectionService = {

  /**
   * Load the current selection state for a gallery.
   * Called when a client opens a gallery link.
   * @param {string} shareId
   * @returns Promise<{ success, data: Selection, message }>
   */
  async getSelection(shareId) {
    if (USE_MOCK) return selectionMock.getSelection(shareId)
    return safeCall(() => apiClient.get(ENDPOINTS.SELECTIONS.GET_BY_SHARE(shareId)))
  },

  /**
   * Toggle a photo's selected state (add if not selected, remove if selected).
   * @param {string} shareId
   * @param {string} photoId
   * @returns Promise<{ success, data: { selectedIds }, message }>
   */
  async togglePhoto(shareId, photoId) {
    if (USE_MOCK) return selectionMock.togglePhoto(shareId, photoId)
    return safeCall(() =>
      apiClient.post(ENDPOINTS.SELECTIONS.TOGGLE_PHOTO(shareId), { photoId })
    )
  },

  /**
   * Save or clear a comment on a selected photo.
   * @param {string} shareId
   * @param {string} photoId
   * @param {string} comment  — empty string clears the comment
   * @returns Promise<{ success, data: { comments }, message }>
   */
  async setComment(shareId, photoId, comment) {
    if (USE_MOCK) return selectionMock.setComment(shareId, photoId, comment)
    return safeCall(() =>
      apiClient.post(ENDPOINTS.SELECTIONS.SET_COMMENT(shareId), { photoId, comment })
    )
  },

  /**
   * Finalise and submit the client's selection.
   * This action is irreversible.
   * @param {string} shareId
   * @returns Promise<{ success, data: { shareId, selectedCount, submittedAt }, message }>
   */
  async submitSelection(shareId) {
    if (USE_MOCK) return selectionMock.submitSelection(shareId)
    return safeCall(() => apiClient.post(ENDPOINTS.SELECTIONS.SUBMIT(shareId), {}))
  },
}
