/**
 * Selection Mock — client photo selection state per gallery share link.
 *
 * A "selection" tracks which photos a client has picked and any comments
 * they've added before submitting their final choices.
 */

import { buildSuccess, buildError } from '@/api/client'

const delay = (ms = 700) => new Promise(r => setTimeout(r, ms))
const jitter = () => Math.floor(Math.random() * 400) + 500

// ─── Seed data ────────────────────────────────────────────────────────────────
// One selection document per shareId.

const _selections = {
  share_jkl012: {
    shareId:     'share_jkl012',
    projectId:   'proj_4',
    selectedIds: ['photo_proj_4_1', 'photo_proj_4_3', 'photo_proj_4_7'],
    comments:    {
      photo_proj_4_3: 'Please brighten this one',
      photo_proj_4_7: 'Favourite shot of the evening!',
    },
    status:      'draft',   // 'draft' | 'submitted'
    submittedAt: null,
  },
}

function _getOrCreate(shareId) {
  if (!_selections[shareId]) {
    _selections[shareId] = {
      shareId,
      projectId:   null,
      selectedIds: [],
      comments:    {},
      status:      'draft',
      submittedAt: null,
    }
  }
  return _selections[shareId]
}

// ─── Mock handlers ────────────────────────────────────────────────────────────

/**
 * GET /selections/:shareId
 */
export async function getSelection(shareId) {
  await delay(jitter())

  const sel = _getOrCreate(shareId)
  return buildSuccess({ ...sel, comments: { ...sel.comments } }, 'Selection fetched')
}

/**
 * POST /selections/:shareId/toggle
 * Body: { photoId }
 * Adds the photo if not selected; removes it if already selected.
 */
export async function togglePhoto(shareId, photoId) {
  await delay(300) // fast toggle — feels interactive

  const sel = _getOrCreate(shareId)

  if (sel.status === 'submitted') {
    throw buildError('This gallery has already been submitted and cannot be changed')
  }

  const idx = sel.selectedIds.indexOf(photoId)
  if (idx === -1) {
    sel.selectedIds.push(photoId)
  } else {
    sel.selectedIds.splice(idx, 1)
    delete sel.comments[photoId] // remove comment when deselecting
  }

  return buildSuccess(
    { selectedIds: [...sel.selectedIds] },
    idx === -1 ? 'Photo added to selection' : 'Photo removed from selection'
  )
}

/**
 * POST /selections/:shareId/comment
 * Body: { photoId, comment }
 */
export async function setComment(shareId, photoId, comment) {
  await delay(400)

  const sel = _getOrCreate(shareId)

  if (sel.status === 'submitted') {
    throw buildError('This gallery has already been submitted')
  }

  if (!sel.selectedIds.includes(photoId)) {
    throw buildError('Cannot comment on a photo that is not selected')
  }

  if (comment?.trim()) {
    sel.comments[photoId] = comment.trim()
  } else {
    delete sel.comments[photoId]
  }

  return buildSuccess({ comments: { ...sel.comments } }, 'Comment saved')
}

/**
 * POST /selections/:shareId/submit
 * Finalises the selection — cannot be undone.
 */
export async function submitSelection(shareId) {
  await delay(1800) // submission takes longer — build suspense

  const sel = _getOrCreate(shareId)

  if (sel.status === 'submitted') {
    throw buildError('This gallery has already been submitted')
  }

  if (sel.selectedIds.length === 0) {
    throw buildError('Please select at least one photo before submitting')
  }

  sel.status = 'submitted'
  sel.submittedAt = new Date().toISOString()

  return buildSuccess(
    {
      shareId,
      selectedCount: sel.selectedIds.length,
      submittedAt: sel.submittedAt,
    },
    'Your selection has been submitted successfully!'
  )
}
