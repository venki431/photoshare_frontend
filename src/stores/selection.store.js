/**
 * Selection Store — client-side photo selection state for gallery views.
 *
 * Covers the full client journey:
 *   1. Load existing selection when gallery opens
 *   2. Toggle photos in/out of the selection
 *   3. Add/update comments on selected photos
 *   4. Submit the final selection
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { selectionService } from '@/api/services/selection.service'

export const useSelectionStore = defineStore('selection', () => {

  // ─── State ──────────────────────────────────────────────────────────────────
  const shareId      = ref(null)
  const selectedIds  = ref([])      // array of photo IDs the client has picked
  const comments     = ref({})      // { [photoId]: string }
  const status       = ref('draft') // 'draft' | 'submitted'
  const submittedAt  = ref(null)

  const loading      = ref(false)
  const submitting   = ref(false)   // separate flag — submit is a heavier action
  const error        = ref(null)

  // ─── Computed ────────────────────────────────────────────────────────────────
  const selectedCount  = computed(() => selectedIds.value.length)
  const isSubmitted    = computed(() => status.value === 'submitted')
  const isSelected     = computed(() => (photoId) => selectedIds.value.includes(photoId))
  const commentFor     = computed(() => (photoId) => comments.value[photoId] || '')

  // ─── Private helpers ─────────────────────────────────────────────────────────
  function _begin()   { loading.value = true;  error.value = null }
  function _end()     { loading.value = false }
  function _fail(err) { error.value = err?.message || 'Something went wrong'; _end() }

  function _applySelection(data) {
    if (data.selectedIds) selectedIds.value = data.selectedIds
    if (data.comments)    comments.value    = { ...data.comments }
    if (data.status)      status.value      = data.status
    if (data.submittedAt) submittedAt.value = data.submittedAt
    if (data.shareId)     shareId.value     = data.shareId
  }

  // ─── Actions ──────────────────────────────────────────────────────────────────

  async function loadSelection(sid) {
    _begin()
    try {
      const res = await selectionService.getSelection(sid)
      shareId.value = sid
      _applySelection(res.data)
    } catch (err) {
      _fail(err)
      throw err
    } finally {
      _end()
    }
  }

  /**
   * Optimistically toggle a photo, then confirm with the server.
   * If the server rejects, we roll back the local state.
   */
  async function togglePhoto(photoId) {
    if (isSubmitted.value) return

    // Optimistic update
    const wasSelected = isSelected.value(photoId)
    if (wasSelected) {
      selectedIds.value = selectedIds.value.filter(id => id !== photoId)
      delete comments.value[photoId]
    } else {
      selectedIds.value = [...selectedIds.value, photoId]
    }

    try {
      const res = await selectionService.togglePhoto(shareId.value, photoId)
      // Reconcile with server truth
      selectedIds.value = res.data.selectedIds
    } catch (err) {
      // Roll back on failure
      if (wasSelected) {
        selectedIds.value = [...selectedIds.value, photoId]
      } else {
        selectedIds.value = selectedIds.value.filter(id => id !== photoId)
      }
      error.value = err?.message || 'Failed to update selection'
    }
  }

  async function setComment(photoId, comment) {
    if (isSubmitted.value) return

    // Optimistic update
    const previous = comments.value[photoId]
    if (comment?.trim()) {
      comments.value = { ...comments.value, [photoId]: comment.trim() }
    } else {
      const updated = { ...comments.value }
      delete updated[photoId]
      comments.value = updated
    }

    try {
      const res = await selectionService.setComment(shareId.value, photoId, comment)
      comments.value = { ...res.data.comments }
    } catch (err) {
      // Roll back
      if (previous) {
        comments.value = { ...comments.value, [photoId]: previous }
      } else {
        const updated = { ...comments.value }
        delete updated[photoId]
        comments.value = updated
      }
      error.value = err?.message || 'Failed to save comment'
    }
  }

  async function submitSelection() {
    if (isSubmitted.value) return
    if (selectedCount.value === 0) {
      error.value = 'Please select at least one photo before submitting'
      return
    }

    submitting.value = true
    error.value      = null
    try {
      const res         = await selectionService.submitSelection(shareId.value)
      status.value      = 'submitted'
      submittedAt.value = res.data.submittedAt
      return res.data
    } catch (err) {
      error.value = err?.message || 'Failed to submit. Please try again.'
      throw err
    } finally {
      submitting.value = false
    }
  }

  function reset() {
    shareId.value     = null
    selectedIds.value = []
    comments.value    = {}
    status.value      = 'draft'
    submittedAt.value = null
    loading.value     = false
    submitting.value  = false
    error.value       = null
  }

  return {
    // state
    shareId, selectedIds, comments, status, submittedAt,
    loading, submitting, error,
    // computed
    selectedCount, isSubmitted, isSelected, commentFor,
    // actions
    loadSelection, togglePhoto, setComment, submitSelection, reset,
  }
})
