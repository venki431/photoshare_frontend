/**
 * Project Service — public API for all project operations.
 *
 * This is the ONLY file that knows whether we're using mock or real data.
 * Everything above (stores, components) stays completely unaware.
 *
 * Flow:
 *   Component → Store action → projectService.method() → mock or real API
 */

import { apiClient, USE_MOCK, buildError } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import * as projectMock from '@/mocks/projects.mock'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Wrap every real API call so network errors are normalised into the
 * same { success, data, message } shape that mocks already return.
 */
async function safeCall(fn) {
  try {
    return await fn()
  } catch (err) {
    // If it's already our normalised error shape, re-throw as-is
    if (err && 'success' in err) throw err
    throw buildError(err?.message || 'Network error. Please try again.')
  }
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const projectService = {

  /**
   * Fetch a paginated list of projects.
   * @param {{ page?, perPage?, status?, search? }} params
   * @returns Promise<{ success, data: Project[], message, meta }>
   */
  async getProjects(params = {}) {
    if (USE_MOCK) return projectMock.getProjects(params)
    return safeCall(() => apiClient.get(ENDPOINTS.PROJECTS.LIST, { params }))
  },

  /**
   * Fetch a single project by its ID.
   * @param {string} id
   * @returns Promise<{ success, data: Project, message }>
   */
  async getProject(id) {
    if (USE_MOCK) return projectMock.getProject(id)
    return safeCall(() => apiClient.get(ENDPOINTS.PROJECTS.DETAIL(id)))
  },

  /**
   * Fetch a project using a public share link ID (no auth required).
   * @param {string} shareId
   * @returns Promise<{ success, data: Project, message }>
   */
  async getProjectByShareId(shareId) {
    if (USE_MOCK) return projectMock.getProjectByShareId(shareId)
    return safeCall(() => apiClient.get(ENDPOINTS.PROJECTS.BY_SHARE_ID(shareId)))
  },

  /**
   * Create a new project.
   * @param {{ name, eventType, password?, clientEmail?, notes?, imageCount? }} data
   * @returns Promise<{ success, data: Project, message }>
   */
  async createProject(data) {
    if (USE_MOCK) return projectMock.createProject(data)
    return safeCall(() => apiClient.post(ENDPOINTS.PROJECTS.CREATE, data))
  },

  /**
   * Update an existing project's fields.
   * @param {string} id
   * @param {Partial<Project>} data
   * @returns Promise<{ success, data: Project, message }>
   */
  async updateProject(id, data) {
    if (USE_MOCK) return projectMock.updateProject(id, data)
    return safeCall(() => apiClient.put(ENDPOINTS.PROJECTS.UPDATE(id), data))
  },

  /**
   * Permanently delete a project and all its photos.
   * @param {string} id
   * @returns Promise<{ success, data: null, message }>
   */
  async deleteProject(id) {
    if (USE_MOCK) return projectMock.deleteProject(id)
    return safeCall(() => apiClient.delete(ENDPOINTS.PROJECTS.DELETE(id)))
  },
}
