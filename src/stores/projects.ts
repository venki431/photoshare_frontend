import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { projectService } from '@/api/services/project.service'
import { photoService } from '@/api/services/photo.service'
import { selectionService } from '@/api/services/selection.service'
import type { PaginationMeta } from '@/types'
import type {
  Project,
  CreateProjectPayload,
  ProjectListParams,
  ProjectWithImages,
  ProjectImage,
} from '@/types'
import type { Photo } from '@/types'

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const loadingMore = ref(false)
  const error = ref<string | null>(null)
  const currentProject = ref<ProjectWithImages | null>(null)
  const pagination = ref<PaginationMeta>({
    total: 0,
    page: 1,
    perPage: 10,
    totalPages: 1,
  })
  const photoPagination = ref<PaginationMeta>({
    total: 0,
    page: 1,
    perPage: 10,
    totalPages: 1,
  })

  const hasMoreProjects = computed(() => pagination.value.page < pagination.value.totalPages)
  const hasMorePhotos = computed(() => photoPagination.value.page < photoPagination.value.totalPages)

  const totalProjects = computed(() => pagination.value.total || projects.value.length)
  const pendingCount = computed(() => projects.value.filter(p => p.status === 'pending').length)
  const completedCount = computed(() => projects.value.filter(p => p.status === 'completed').length)
  const inReviewCount = computed(() => projects.value.filter(p => p.status === 'in_review').length)
  const totalImages = computed(() =>
    projects.value.reduce((sum, p) => sum + (p.imageCount ?? 0), 0)
  )

  function _begin(): void {
    loading.value = true
    error.value = null
  }
  function _end(): void {
    loading.value = false
  }

  function photoToProjectImage(p: Photo): ProjectImage {
    return {
      ...p,
      selected: p.selectedByClient ?? false,
      comment: '',
    }
  }

  async function fetchProjects(params: ProjectListParams = {}): Promise<void> {
    _begin()
    try {
      const res = await projectService.getProjects(params)
      projects.value = res.data ?? []
      if (res.meta) pagination.value = res.meta
    } catch (err: unknown) {
      error.value = (err as { message?: string })?.message ?? 'Failed to load projects'
      throw err
    } finally {
      _end()
    }
  }

  async function fetchMoreProjects(params: ProjectListParams = {}): Promise<void> {
    if (!hasMoreProjects.value || loadingMore.value) return
    loadingMore.value = true
    try {
      const nextPage = pagination.value.page + 1
      const res = await projectService.getProjects({ ...params, page: nextPage, perPage: pagination.value.perPage })
      projects.value = [...projects.value, ...(res.data ?? [])]
      if (res.meta) pagination.value = res.meta
    } catch (err: unknown) {
      error.value = (err as { message?: string })?.message ?? 'Failed to load more projects'
      throw err
    } finally {
      loadingMore.value = false
    }
  }

  async function fetchProject(id: string): Promise<ProjectWithImages> {
    _begin()
    try {
      const [projectRes, photosRes] = await Promise.all([
        projectService.getProject(id),
        photoService.getPhotosByProject(id, { page: 1, perPage: 10 }),
      ])
      if (photosRes.meta) photoPagination.value = photosRes.meta
      const project: ProjectWithImages = {
        ...(projectRes.data as Project),
        images: (photosRes.data ?? []).map(photoToProjectImage),
      }
      currentProject.value = project
      const idx = projects.value.findIndex(p => p.id === id)
      if (idx !== -1) projects.value[idx] = { ...projects.value[idx], ...projectRes.data }
      return project
    } catch (err: unknown) {
      error.value = (err as { message?: string })?.message ?? 'Failed to load project'
      throw err
    } finally {
      _end()
    }
  }

  async function fetchProjectByShareId(shareId: string): Promise<ProjectWithImages> {
    _begin()
    try {
      const [projectRes, selRes] = await Promise.all([
        projectService.getProjectByShareId(shareId),
        selectionService.getSelection(shareId).catch(() => ({
          success: true as const,
          data: { shareId, projectId: '', selectedIds: [] as string[], comments: {} as Record<string, string>, status: 'draft' as const, submittedAt: null },
          message: '',
        })),
      ])

      const projectData = projectRes.data
      const selection = selRes.data ?? { selectedIds: [], comments: {} }
      const selectedIds = new Set(selection.selectedIds ?? [])
      const comments = selection.comments ?? {}

      const photosRes = await photoService.getPhotosByProject(projectData.id, { perPage: 10 })

      const project: ProjectWithImages = {
        ...(projectData as unknown as Project),
        images: (photosRes.data ?? []).map(p => ({
          ...p,
          selected: selectedIds.has(p.id),
          comment: comments[p.id] ?? '',
        })) as ProjectImage[],
      }
      currentProject.value = project
      return project
    } catch (err: unknown) {
      error.value = (err as { message?: string })?.message ?? 'Failed to load gallery'
      throw err
    } finally {
      _end()
    }
  }

  async function fetchMorePhotos(projectId: string): Promise<void> {
    if (!hasMorePhotos.value || loadingMore.value) return
    loadingMore.value = true
    try {
      const nextPage = photoPagination.value.page + 1
      const res = await photoService.getPhotosByProject(projectId, { page: nextPage, perPage: photoPagination.value.perPage })
      if (res.meta) photoPagination.value = res.meta
      if (currentProject.value?.id === projectId && currentProject.value.images) {
        currentProject.value.images = [...currentProject.value.images, ...(res.data ?? []).map(photoToProjectImage)]
      }
    } catch (err: unknown) {
      error.value = (err as { message?: string })?.message ?? 'Failed to load more photos'
      throw err
    } finally {
      loadingMore.value = false
    }
  }

  async function fetchMorePhotosForGallery(projectId: string, shareId: string): Promise<void> {
    if (!hasMorePhotos.value || loadingMore.value) return
    loadingMore.value = true
    try {
      const [photosRes, selRes] = await Promise.all([
        photoService.getPhotosByProject(projectId, {
          page: photoPagination.value.page + 1,
          perPage: photoPagination.value.perPage,
        }),
        selectionService.getSelection(shareId).catch(() => ({
          success: true as const,
          data: { shareId, projectId: '', selectedIds: [] as string[], comments: {} as Record<string, string>, status: 'draft' as const, submittedAt: null },
          message: '',
        })),
      ])
      if (photosRes.meta) photoPagination.value = photosRes.meta
      if (currentProject.value?.id === projectId && currentProject.value.images) {
        const selectedIds = new Set(selRes.data?.selectedIds ?? [])
        const comments = selRes.data?.comments ?? {}
        const newImages = (photosRes.data ?? []).map(p => ({
          ...p,
          selected: selectedIds.has(p.id),
          comment: comments[p.id] ?? '',
        })) as ProjectImage[]
        currentProject.value.images = [...currentProject.value.images, ...newImages]
      }
    } catch (err: unknown) {
      error.value = (err as { message?: string })?.message ?? 'Failed to load more photos'
      throw err
    } finally {
      loadingMore.value = false
    }
  }

  function getProject(id: string): ProjectWithImages | Project | null {
    if (currentProject.value?.id === id) return currentProject.value
    return projects.value.find(p => p.id === id) ?? null
  }

  function getProjectByShareId(shareId: string): ProjectWithImages | null {
    if (currentProject.value?.shareId === shareId) return currentProject.value
    return null
  }

  async function createProject(data: CreateProjectPayload): Promise<Project> {
    _begin()
    try {
      const res = await projectService.createProject(data)
      const project = res.data
      projects.value.unshift(project)
      pagination.value.total += 1
      return project
    } catch (err: unknown) {
      error.value = (err as { message?: string })?.message ?? 'Failed to create project'
      throw err
    } finally {
      _end()
    }
  }

  async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
    _begin()
    try {
      const res = await projectService.updateProject(id, data)
      const idx = projects.value.findIndex(p => p.id === id)
      if (idx !== -1) projects.value[idx] = res.data
      if (currentProject.value?.id === id) {
        currentProject.value = { ...currentProject.value, ...res.data }
      }
      return res.data
    } catch (err: unknown) {
      error.value = (err as { message?: string })?.message ?? 'Failed to update project'
      throw err
    } finally {
      _end()
    }
  }

  async function deleteProject(id: string): Promise<void> {
    _begin()
    try {
      await projectService.deleteProject(id)
      projects.value = projects.value.filter(p => p.id !== id)
      if (currentProject.value?.id === id) currentProject.value = null
      pagination.value.total = Math.max(0, pagination.value.total - 1)
    } catch (err: unknown) {
      error.value = (err as { message?: string })?.message ?? 'Failed to delete project'
      throw err
    } finally {
      _end()
    }
  }

  async function uploadPhoto(projectId: string, file: File | Blob): Promise<Photo> {
    const res = await photoService.uploadPhoto(projectId, file)
    if (currentProject.value?.id === projectId && currentProject.value.images) {
      currentProject.value.images.push(photoToProjectImage(res.data))
      currentProject.value.imageCount = (currentProject.value.imageCount ?? 0) + 1
    }
    return res.data
  }

  async function deletePhoto(photoId: string, projectId: string): Promise<void> {
    await photoService.deletePhoto(photoId)
    if (currentProject.value?.id === projectId && currentProject.value.images) {
      currentProject.value.images = currentProject.value.images.filter(i => i.id !== photoId)
      currentProject.value.imageCount = Math.max(0, (currentProject.value.imageCount ?? 1) - 1)
    }
  }

  async function bulkDeletePhotos(ids: string[], projectId: string): Promise<void> {
    await photoService.bulkDeletePhotos(ids)
    if (currentProject.value?.id === projectId && currentProject.value.images) {
      const idSet = new Set(ids)
      currentProject.value.images = currentProject.value.images.filter(i => !idSet.has(i.id))
      currentProject.value.imageCount = Math.max(0, (currentProject.value.imageCount ?? ids.length) - ids.length)
    }
  }

  async function toggleImageSelection(_shareId: string, imageId: string): Promise<void> {
    const project = currentProject.value
    if (!project) return

    const image = project.images?.find(img => img.id === imageId)
    if (!image) return

    image.selected = !image.selected
    if (!image.selected) image.comment = ''
    project.selectedCount = project.images?.filter(img => img.selected)?.length ?? 0

    try {
      await selectionService.togglePhoto(project.shareId, imageId)
    } catch {
      image.selected = !image.selected
      project.selectedCount = project.images?.filter(img => img.selected)?.length ?? 0
    }
  }

  async function setImageComment(_shareId: string, imageId: string, comment: string): Promise<void> {
    const project = currentProject.value
    if (!project) return

    const image = project.images?.find(img => img.id === imageId)
    if (!image) return

    const oldComment = image.comment
    image.comment = comment

    try {
      await selectionService.setComment(project.shareId, imageId, comment)
    } catch {
      image.comment = oldComment
    }
  }

  async function submitSelections(shareId: string): Promise<void> {
    _begin()
    try {
      await selectionService.submitSelection(shareId)
      if (currentProject.value?.shareId === shareId) {
        currentProject.value.status = 'completed'
      }
    } catch (err: unknown) {
      error.value = (err as { message?: string })?.message ?? 'Failed to submit selection'
      throw err
    } finally {
      _end()
    }
  }

  return {
    projects, loading, loadingMore, error, currentProject, pagination, photoPagination,
    totalProjects, pendingCount, completedCount, inReviewCount, totalImages,
    hasMoreProjects, hasMorePhotos,
    fetchProjects, fetchMoreProjects, fetchProject, fetchMorePhotos, fetchMorePhotosForGallery, fetchProjectByShareId,
    getProject, getProjectByShareId,
    createProject, updateProject, deleteProject,
    uploadPhoto, deletePhoto, bulkDeletePhotos,
    toggleImageSelection, setImageComment, submitSelections,
  }
})
