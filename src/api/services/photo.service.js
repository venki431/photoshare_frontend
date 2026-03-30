/**
 * Photo Service — public API for photo library operations.
 *
 * Photos are always scoped to a project. Fetching, uploading, and
 * deleting all go through here.
 */

import { apiClient, USE_MOCK, buildError } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import * as photoMock from '@/mocks/photos.mock'

async function safeCall(fn) {
  try {
    return await fn()
  } catch (err) {
    if (err && 'success' in err) throw err
    throw buildError(err?.message || 'Network error. Please try again.')
  }
}

export const photoService = {

  /**
   * Fetch all photos for a project (paginated).
   * @param {string} projectId
   * @param {{ page?, perPage? }} params
   * @returns Promise<{ success, data: Photo[], message, meta }>
   */
  async getPhotosByProject(projectId, params = {}) {
    if (USE_MOCK) return photoMock.getPhotosByProject(projectId, params)
    return safeCall(() =>
      apiClient.get(ENDPOINTS.PHOTOS.LIST_BY_PROJECT(projectId), { params })
    )
  },

  /**
   * Fetch a single photo by ID.
   * @param {string} id
   * @returns Promise<{ success, data: Photo, message }>
   */
  async getPhoto(id) {
    if (USE_MOCK) return photoMock.getPhoto(id)
    return safeCall(() => apiClient.get(ENDPOINTS.PHOTOS.DETAIL(id)))
  },

  /**
   * Upload a photo to a project.
   * In production this sends multipart/form-data with metadata headers.
   * The mock accepts a File object and generates a placeholder.
   * @param {string} projectId
   * @param {File} file
   * @param {{ originalName?, originalSize?, compressedSize? }} meta
   * @returns Promise<{ success, data: Photo, message }>
   */
  async uploadPhoto(projectId, file, meta = {}) {
    if (USE_MOCK) return photoMock.uploadPhoto(projectId, file, meta)

    // Real upload uses FormData, not JSON
    return safeCall(async () => {
      const form = new FormData()
      form.append('photo', file)

      const token = localStorage.getItem('ps_auth_token')
      const headers = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }

      // Send original file metadata as headers for backend to store
      if (meta.originalName) headers['X-Original-Filename'] = meta.originalName
      if (meta.originalSize) headers['X-Original-Size'] = String(meta.originalSize)

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/projects/${projectId}/photos`,
        {
          method: 'POST',
          headers,
          body: form,
        }
      )
      const json = await response.json()
      if (!response.ok) throw { message: json?.message || `HTTP ${response.status}` }
      return json
    })
  },

  /**
   * Delete a single photo.
   * @param {string} id
   * @returns Promise<{ success, data: null, message }>
   */
  async deletePhoto(id) {
    if (USE_MOCK) return photoMock.deletePhoto(id)
    return safeCall(() => apiClient.delete(ENDPOINTS.PHOTOS.DELETE(id)))
  },

  /**
   * Delete multiple photos in one request.
   * @param {string[]} ids
   * @returns Promise<{ success, data: { deletedCount }, message }>
   */
  async bulkDeletePhotos(ids) {
    if (USE_MOCK) return photoMock.bulkDeletePhotos(ids)
    return safeCall(() => apiClient.post(ENDPOINTS.PHOTOS.BULK_DELETE, { ids }))
  },

  /**
   * Get selected photos for a project (photographer export).
   * Returns photos with original file names and comments.
   * @param {string} projectId
   * @returns Promise<{ success, data: { photos, selection }, message }>
   */
  async getSelectedPhotos(projectId) {
    if (USE_MOCK) return photoMock.getSelectedPhotos(projectId)
    return safeCall(() =>
      apiClient.get(ENDPOINTS.PHOTOS.SELECTED(projectId))
    )
  },
}
