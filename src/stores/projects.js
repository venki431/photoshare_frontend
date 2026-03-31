/**
 * Projects Store — central store used by all views.
 *
 * Coordinates project, photo, and selection services to provide
 * a unified interface. Projects loaded into the list are lightweight;
 * individual project detail includes full photo data.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { projectService } from '@/api/services/project.service'
import { photoService } from '@/api/services/photo.service'
import { selectionService } from '@/api/services/selection.service'

export const useProjectStore = defineStore('projects', () => {
  // ─── State ───────────────────────────────────────────────────────────────────
  const projects = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentProject = ref(null)
  const pagination = ref({ total: 0, page: 1, perPage: 10, totalPages: 1 })

  // ─── Computed ────────────────────────────────────────────────────────────────
  const totalProjects = computed(() => pagination.value.total || projects.value.length)
  const pendingCount = computed(() => projects.value.filter(p => p.status === 'pending').length)
  const completedCount = computed(() => projects.value.filter(p => p.status === 'completed').length)
  const inReviewCount = computed(() => projects.value.filter(p => p.status === 'in_review').length)
  const totalImages = computed(() => projects.value.reduce((sum, p) => sum + (p.imageCount || 0), 0))

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  function _begin() { loading.value = true; error.value = null }
  function _end() { loading.value = false }

  // ─── List / Fetch ────────────────────────────────────────────────────────────

  async function fetchProjects(params = {}) {
    _begin()
    try {
      const res = await projectService.getProjects(params)
      projects.value = res.data
      if (res.meta) pagination.value = res.meta
    } catch (err) {
      error.value = err?.message || 'Failed to load projects'
      throw err
    } finally {
      _end()
    }
  }

  async function fetchProject(id) {
    _begin()
    try {
      const [projectRes, photosRes] = await Promise.all([
        projectService.getProject(id),
        photoService.getPhotosByProject(id, { perPage: 500 }),
      ])
      const project = {
        ...projectRes.data,
        images: (photosRes.data || []).map(p => ({
          ...p,
          selected: p.selectedByClient || false,
          comment: '',
        })),
      }
      currentProject.value = project
      const idx = projects.value.findIndex(p => p.id === id)
      if (idx !== -1) projects.value[idx] = { ...projects.value[idx], ...projectRes.data }
      return project
    } catch (err) {
      error.value = err?.message || 'Failed to load project'
      throw err
    } finally {
      _end()
    }
  }

  async function fetchProjectByShareId(shareId) {
    _begin()
    try {
      const [projectRes, selRes] = await Promise.all([
        projectService.getProjectByShareId(shareId),
        selectionService.getSelection(shareId).catch(() => ({
          data: { selectedIds: [], comments: {} },
        })),
      ])

      const projectData = projectRes.data
      const selection = selRes.data || { selectedIds: [], comments: {} }
      const selectedIds = new Set(selection.selectedIds || [])
      const comments = selection.comments || {}

      const photosRes = await photoService.getPhotosByProject(projectData.id, { perPage: 500 })

      const project = {
        ...projectData,
        images: (photosRes.data || []).map(p => ({
          ...p,
          selected: selectedIds.has(p.id),
          comment: comments[p.id] || '',
        })),
      }
      currentProject.value = project
      return project
    } catch (err) {
      error.value = err?.message || 'Failed to load gallery'
      throw err
    } finally {
      _end()
    }
  }

  // ─── Sync Getters (for template reactivity) ─────────────────────────────────

  function getProject(id) {
    if (currentProject.value?.id === id) return currentProject.value
    return projects.value.find(p => p.id === id) || null
  }

  function getProjectByShareId(shareId) {
    if (currentProject.value?.shareId === shareId) return currentProject.value
    return null
  }

  // ─── Create ──────────────────────────────────────────────────────────────────

  async function createProject(data) {
    _begin()
    try {
      const res = await projectService.createProject(data)
      const project = res.data

      projects.value.unshift(project)
      pagination.value.total += 1
      return project
    } catch (err) {
      error.value = err?.message || 'Failed to create project'
      throw err
    } finally {
      _end()
    }
  }

  // ─── Update / Delete ─────────────────────────────────────────────────────────

  async function updateProject(id, data) {
    _begin()
    try {
      const res = await projectService.updateProject(id, data)
      const idx = projects.value.findIndex(p => p.id === id)
      if (idx !== -1) projects.value[idx] = res.data
      if (currentProject.value?.id === id) {
        currentProject.value = { ...currentProject.value, ...res.data }
      }
      return res.data
    } catch (err) {
      error.value = err?.message || 'Failed to update project'
      throw err
    } finally {
      _end()
    }
  }

  async function deleteProject(id) {
    _begin()
    try {
      await projectService.deleteProject(id)
      projects.value = projects.value.filter(p => p.id !== id)
      if (currentProject.value?.id === id) currentProject.value = null
      pagination.value.total = Math.max(0, pagination.value.total - 1)
    } catch (err) {
      error.value = err?.message || 'Failed to delete project'
      throw err
    } finally {
      _end()
    }
  }

  // ─── Photo Operations ────────────────────────────────────────────────────────

  async function uploadPhoto(projectId, file) {
    try {
      const res = await photoService.uploadPhoto(projectId, file)
      if (currentProject.value?.id === projectId && currentProject.value.images) {
        currentProject.value.images.push({ ...res.data, selected: false, comment: '' })
        currentProject.value.imageCount = (currentProject.value.imageCount || 0) + 1
      }
      return res.data
    } catch (err) {
      // error propagated to caller
      throw err
    }
  }

  async function deletePhoto(photoId, projectId) {
    try {
      await photoService.deletePhoto(photoId)
      if (currentProject.value?.id === projectId && currentProject.value.images) {
        currentProject.value.images = currentProject.value.images.filter(i => i.id !== photoId)
        currentProject.value.imageCount = Math.max(0, (currentProject.value.imageCount || 1) - 1)
      }
    } catch (err) {
      // error propagated to caller
      throw err
    }
  }

  async function bulkDeletePhotos(ids, projectId) {
    try {
      await photoService.bulkDeletePhotos(ids)
      if (currentProject.value?.id === projectId && currentProject.value.images) {
        const idSet = new Set(ids)
        currentProject.value.images = currentProject.value.images.filter(i => !idSet.has(i.id))
        currentProject.value.imageCount = Math.max(0, (currentProject.value.imageCount || ids.length) - ids.length)
      }
    } catch (err) {
      // error propagated to caller
      throw err
    }
  }

  // ─── Selection Operations (Client Gallery) ──────────────────────────────────

  async function toggleImageSelection(_shareId, imageId) {
    const project = currentProject.value
    if (!project) return

    const image = project.images?.find(img => img.id === imageId)
    if (!image) return

    // Optimistic update
    image.selected = !image.selected
    if (!image.selected) image.comment = ''
    project.selectedCount = project.images?.filter(img => img.selected)?.length ?? 0

    try {
      await selectionService.togglePhoto(project.shareId, imageId)
    } catch (err) {
      // Rollback
      image.selected = !image.selected
      project.selectedCount = project.images?.filter(img => img.selected)?.length ?? 0
      // error propagated to caller
    }
  }

  async function setImageComment(_shareId, imageId, comment) {
    const project = currentProject.value
    if (!project) return

    const image = project.images?.find(img => img.id === imageId)
    if (!image) return

    const oldComment = image.comment
    image.comment = comment

    try {
      await selectionService.setComment(project.shareId, imageId, comment)
    } catch (err) {
      image.comment = oldComment
      // error propagated to caller
    }
  }

  async function submitSelections(shareId) {
    _begin()
    try {
      await selectionService.submitSelection(shareId)
      if (currentProject.value?.shareId === shareId) {
        currentProject.value.status = 'completed'
      }
    } catch (err) {
      error.value = err?.message || 'Failed to submit selection'
      throw err
    } finally {
      _end()
    }
  }

  return {
    // state
    projects, loading, error, currentProject, pagination,
    // computed
    totalProjects, pendingCount, completedCount, inReviewCount, totalImages,
    // list actions
    fetchProjects, fetchProject, fetchProjectByShareId,
    // sync getters
    getProject, getProjectByShareId,
    // CRUD
    createProject, updateProject, deleteProject,
    // photo ops
    uploadPhoto, deletePhoto, bulkDeletePhotos,
    // selection ops
    toggleImageSelection, setImageComment, submitSelections,
  }
})
