import { apiClient, USE_MOCK, buildError } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse } from '@/types'
import type { Project, SharedProject, CreateProjectPayload, ProjectListParams } from '@/types'
import * as projectMock from '@/mocks/projects.mock'

async function safeCall<T>(fn: () => Promise<ApiResponse<T>>): Promise<ApiResponse<T>> {
  try {
    return await fn()
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'success' in err) throw err
    const message = err instanceof Error ? err.message : (err as { message?: string })?.message ?? 'Network error. Please try again.'
    throw buildError(message)
  }
}

export const projectService = {
  async getProjects(params: ProjectListParams = {}): Promise<ApiResponse<Project[]>> {
    if (USE_MOCK) return projectMock.getProjects(params)
    return safeCall(() => apiClient.get<Project[]>(ENDPOINTS.PROJECTS.LIST, { params: params as Record<string, string | number> }))
  },

  async getProjectsByFolder(folderId: string, params: ProjectListParams = {}): Promise<ApiResponse<Project[]>> {
    return safeCall(() => apiClient.get<Project[]>(ENDPOINTS.PROJECTS.BY_FOLDER(folderId), { params: params as Record<string, string | number> }))
  },

  async getProject(id: string): Promise<ApiResponse<Project>> {
    if (USE_MOCK) return projectMock.getProject(id)
    return safeCall(() => apiClient.get<Project>(ENDPOINTS.PROJECTS.DETAIL(id)))
  },

  async getProjectByShareId(shareId: string): Promise<ApiResponse<SharedProject>> {
    if (USE_MOCK) return projectMock.getProjectByShareId(shareId)
    return safeCall(() => apiClient.get<SharedProject>(ENDPOINTS.PROJECTS.BY_SHARE_ID(shareId)))
  },

  async createProject(data: CreateProjectPayload): Promise<ApiResponse<Project>> {
    if (USE_MOCK) return projectMock.createProject(data)
    return safeCall(() => apiClient.post<Project>(ENDPOINTS.PROJECTS.CREATE, data))
  },

  async updateProject(id: string, data: Partial<Project>): Promise<ApiResponse<Project>> {
    if (USE_MOCK) return projectMock.updateProject(id, data)
    return safeCall(() => apiClient.put<Project>(ENDPOINTS.PROJECTS.UPDATE(id), data))
  },

  async deleteProject(id: string): Promise<ApiResponse<null>> {
    if (USE_MOCK) return projectMock.deleteProject(id)
    return safeCall(() => apiClient.delete<null>(ENDPOINTS.PROJECTS.DELETE(id)))
  },
}
