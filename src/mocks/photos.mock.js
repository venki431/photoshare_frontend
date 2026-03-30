/**
 * Photos Mock — photo library per project.
 *
 * Photos are stored separately from projects (normalised).
 * Each photo belongs to one project via projectId.
 * Now includes image_assets metadata (original/compressed file info).
 */

import { buildSuccess, buildError } from '@/api/client'

const delay = (ms = 700) => new Promise(r => setTimeout(r, ms))
const jitter = () => Math.floor(Math.random() * 400) + 500

// ─── Generate seed photos ─────────────────────────────────────────────────────

function makePhotos(projectId, seedOffset, count) {
  return Array.from({ length: count }, (_, i) => {
    const seed = seedOffset + i
    const originalSize = 3_400_000 + seed * 11_000
    const compressedSize = Math.round(originalSize * 0.35)
    return {
      id: `photo_${projectId}_${i + 1}`,
      projectId,
      url:      `https://picsum.photos/seed/ps${seed}/800/600`,
      thumbUrl: `https://picsum.photos/seed/ps${seed}/400/300`,
      filename: `IMG_${String(seed).padStart(4, '0')}.jpg`,
      originalFileName: `IMG_${String(seed).padStart(4, '0')}.jpg`,
      compressedFileName: `IMG_${String(seed).padStart(4, '0')}_compressed.jpg`,
      width:  800 + (seed % 5) * 80,
      height: 600 + (seed % 4) * 60,
      takenAt: new Date(2026, 2, 15, 10 + (i % 8), (i * 7) % 60).toISOString(),
      size: originalSize,
      sizeOriginal: originalSize,
      sizeCompressed: compressedSize,
      mimeType: 'image/jpeg',
      uploadStatus: 'uploaded',
    }
  })
}

// Module-level photo store (keyed by projectId)
const _photos = {
  proj_1: makePhotos('proj_1',  1, 24),
  proj_2: makePhotos('proj_2',  9, 24),
  proj_3: makePhotos('proj_3',  5, 24),
  proj_4: makePhotos('proj_4', 13, 24),
}

function _getOrCreate(projectId) {
  if (!_photos[projectId]) _photos[projectId] = []
  return _photos[projectId]
}

// ─── Mock handlers ────────────────────────────────────────────────────────────

/**
 * GET /projects/:projectId/photos
 * Supports pagination.
 */
export async function getPhotosByProject(projectId, { page = 1, perPage = 24 } = {}) {
  await delay(jitter())

  const all = _getOrCreate(projectId)
  const total = all.length
  const totalPages = Math.ceil(total / perPage) || 1
  const start = (page - 1) * perPage
  const data = all.slice(start, start + perPage)

  return buildSuccess(data, 'Photos fetched successfully', {
    total,
    page: Number(page),
    perPage: Number(perPage),
    totalPages,
  })
}

/**
 * GET /photos/:id
 */
export async function getPhoto(id) {
  await delay(jitter())

  for (const list of Object.values(_photos)) {
    const photo = list.find(p => p.id === id)
    if (photo) return buildSuccess({ ...photo }, 'Photo fetched successfully')
  }

  throw buildError(`Photo '${id}' not found`)
}

/**
 * POST /projects/:projectId/photos  (simulates upload)
 * Now accepts metadata from the upload manager.
 */
export async function uploadPhoto(projectId, file, meta = {}) {
  await delay(1200) // uploads are slower

  const photos = _getOrCreate(projectId)
  const seed = Date.now() % 10000
  const originalName = meta.originalName || file?.name || `IMG_${seed}.jpg`
  const originalSize = meta.originalSize || file?.size || 3_500_000
  const compressedSize = meta.compressedSize || file?.size || Math.round(originalSize * 0.35)

  const newPhoto = {
    id: `photo_${projectId}_${Date.now()}`,
    projectId,
    url:      `https://picsum.photos/seed/${seed}/800/600`,
    thumbUrl: `https://picsum.photos/seed/${seed}/400/300`,
    filename: originalName,
    originalFileName: originalName,
    compressedFileName: file?.name || `${seed}_compressed.jpg`,
    width:  800,
    height: 600,
    takenAt: new Date().toISOString(),
    size: originalSize,
    sizeOriginal: originalSize,
    sizeCompressed: compressedSize,
    mimeType: file?.type || 'image/jpeg',
    uploadStatus: 'uploaded',
  }

  photos.push(newPhoto)

  return buildSuccess({ ...newPhoto }, 'Photo uploaded successfully')
}

/**
 * DELETE /photos/:id
 */
export async function deletePhoto(id) {
  await delay(jitter())

  for (const [projectId, list] of Object.entries(_photos)) {
    const idx = list.findIndex(p => p.id === id)
    if (idx !== -1) {
      _photos[projectId].splice(idx, 1)
      return buildSuccess(null, 'Photo deleted successfully')
    }
  }

  throw buildError(`Photo '${id}' not found`)
}

/**
 * DELETE /photos/bulk-delete
 * Accepts an array of photo IDs.
 */
export async function bulkDeletePhotos(ids = []) {
  await delay(jitter())

  let deletedCount = 0
  for (const [projectId, list] of Object.entries(_photos)) {
    const before = list.length
    _photos[projectId] = list.filter(p => !ids.includes(p.id))
    deletedCount += before - _photos[projectId].length
  }

  return buildSuccess({ deletedCount }, `${deletedCount} photo(s) deleted`)
}

/**
 * GET /projects/:projectId/photos/selected
 * Mock for photographer export — returns selected photos with original names.
 */
export async function getSelectedPhotos(projectId) {
  await delay(jitter())

  // In mock mode, we don't have real selection state here.
  // Return an empty result; the real data comes from the selection mock.
  return buildSuccess({
    photos: [],
    selection: null,
  }, 'Selected photos fetched')
}
