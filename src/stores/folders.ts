import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { folderService } from '@/api/services/folder.service'
import { projectService } from '@/api/services/project.service'
import type { Folder, CreateFolderPayload, UpdateFolderPayload } from '@/types'
import type { Project, ProjectListParams, PaginationMeta } from '@/types'

export const useFolderStore = defineStore('folders', () => {
  const folders = ref<Folder[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedFolderId = ref<string | null>(null)

  // Projects within selected folder
  const folderProjects = ref<Project[]>([])
  const folderProjectsLoading = ref(false)
  const folderProjectsPagination = ref<PaginationMeta>({
    total: 0,
    page: 1,
    perPage: 10,
    totalPages: 1,
  })

  const selectedFolder = computed(() =>
    folders.value.find(f => f.id === selectedFolderId.value) ?? null
  )

  const totalFolders = computed(() => folders.value.length)

  const hasMoreFolderProjects = computed(() =>
    folderProjectsPagination.value.page < folderProjectsPagination.value.totalPages
  )

  async function fetchFolders(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const res = await folderService.getFolders()
      folders.value = res.data ?? []
    } catch (err: unknown) {
      error.value = (err as { message?: string })?.message ?? 'Failed to load folders'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createFolder(data: CreateFolderPayload): Promise<Folder> {
    loading.value = true
    error.value = null
    try {
      const res = await folderService.createFolder(data)
      const folder = res.data
      folders.value.push(folder)
      return folder
    } catch (err: unknown) {
      error.value = (err as { message?: string })?.message ?? 'Failed to create folder'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateFolder(id: string, data: UpdateFolderPayload): Promise<Folder> {
    error.value = null
    try {
      const res = await folderService.updateFolder(id, data)
      const idx = folders.value.findIndex(f => f.id === id)
      if (idx !== -1) folders.value[idx] = res.data
      return res.data
    } catch (err: unknown) {
      error.value = (err as { message?: string })?.message ?? 'Failed to update folder'
      throw err
    }
  }

  async function deleteFolder(id: string): Promise<void> {
    error.value = null
    try {
      await folderService.deleteFolder(id)
      folders.value = folders.value.filter(f => f.id !== id)
      if (selectedFolderId.value === id) {
        selectedFolderId.value = folders.value[0]?.id ?? null
        folderProjects.value = []
      }
    } catch (err: unknown) {
      error.value = (err as { message?: string })?.message ?? 'Failed to delete folder'
      throw err
    }
  }

  function selectFolder(id: string): void {
    selectedFolderId.value = id
  }

  async function fetchFolderProjects(folderId: string, params: ProjectListParams = {}): Promise<void> {
    folderProjectsLoading.value = true
    error.value = null
    try {
      const res = await projectService.getProjectsByFolder(folderId, params)
      folderProjects.value = res.data ?? []
      if (res.meta) folderProjectsPagination.value = res.meta
    } catch (err: unknown) {
      error.value = (err as { message?: string })?.message ?? 'Failed to load projects'
      throw err
    } finally {
      folderProjectsLoading.value = false
    }
  }

  async function fetchMoreFolderProjects(folderId: string, params: ProjectListParams = {}): Promise<void> {
    if (!hasMoreFolderProjects.value || folderProjectsLoading.value) return
    folderProjectsLoading.value = true
    try {
      const nextPage = folderProjectsPagination.value.page + 1
      const res = await projectService.getProjectsByFolder(folderId, { ...params, page: nextPage, perPage: folderProjectsPagination.value.perPage })
      folderProjects.value = [...folderProjects.value, ...(res.data ?? [])]
      if (res.meta) folderProjectsPagination.value = res.meta
    } catch (err: unknown) {
      error.value = (err as { message?: string })?.message ?? 'Failed to load more projects'
      throw err
    } finally {
      folderProjectsLoading.value = false
    }
  }

  // Update project count locally when a project is created/deleted in a folder
  function incrementFolderProjectCount(folderId: string): void {
    const folder = folders.value.find(f => f.id === folderId)
    if (folder) folder.projectCount++
  }

  function decrementFolderProjectCount(folderId: string): void {
    const folder = folders.value.find(f => f.id === folderId)
    if (folder) folder.projectCount = Math.max(0, folder.projectCount - 1)
  }

  async function shareFolder(id: string): Promise<Folder> {
    error.value = null
    try {
      const res = await folderService.shareFolder(id)
      const idx = folders.value.findIndex(f => f.id === id)
      if (idx !== -1) folders.value[idx] = res.data
      return res.data
    } catch (err: unknown) {
      error.value = (err as { message?: string })?.message ?? 'Failed to share folder'
      throw err
    }
  }

  async function unshareFolder(id: string): Promise<Folder> {
    error.value = null
    try {
      const res = await folderService.unshareFolder(id)
      const idx = folders.value.findIndex(f => f.id === id)
      if (idx !== -1) folders.value[idx] = res.data
      return res.data
    } catch (err: unknown) {
      error.value = (err as { message?: string })?.message ?? 'Failed to unshare folder'
      throw err
    }
  }

  return {
    folders, loading, error, selectedFolderId, selectedFolder, totalFolders,
    folderProjects, folderProjectsLoading, folderProjectsPagination, hasMoreFolderProjects,
    fetchFolders, createFolder, updateFolder, deleteFolder, selectFolder,
    fetchFolderProjects, fetchMoreFolderProjects,
    incrementFolderProjectCount, decrementFolderProjectCount,
    shareFolder, unshareFolder,
  }
})
