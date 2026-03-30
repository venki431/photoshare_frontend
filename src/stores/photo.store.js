/**
 * Photo Store — per-project photo library state.
 *
 * Photos are loaded lazily — only when the project detail view
 * or gallery view asks for them. The store caches by projectId
 * so navigating back doesn't trigger a second fetch.
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { photoService } from "@/api/services/photo.service";

export const usePhotoStore = defineStore("photo", () => {
  // ─── State ──────────────────────────────────────────────────────────────────
  // photos is a Map: projectId → Photo[]
  // Using a plain reactive object for Vue reactivity compatibility
  const photosByProject = ref({});
  const loading = ref(false);
  const uploading = ref(false);
  const error = ref(null);
  const pagination = ref({}); // projectId → meta

  // ─── Computed ────────────────────────────────────────────────────────────────
  const getPhotos = computed(
    () => (projectId) => photosByProject.value[projectId] || []
  );

  const getPhotoCount = computed(
    () => (projectId) =>
      pagination.value[projectId]?.total ??
      (photosByProject.value[projectId]?.length || 0)
  );

  // ─── Private helpers ─────────────────────────────────────────────────────────
  function _begin() {
    loading.value = true;
    error.value = null;
  }
  function _end() {
    loading.value = false;
  }
  function _fail(err) {
    error.value = err?.message || "Something went wrong";
    _end();
  }

  // ─── Actions ──────────────────────────────────────────────────────────────────

  async function fetchPhotos(projectId, params = {}) {
    _begin();
    try {
      const res = await photoService.getPhotosByProject(projectId, params);
      // Append on page > 1 (infinite scroll), replace on page 1
      if (!params.page || params.page === 1) {
        photosByProject.value[projectId] = res.data;
      } else {
        photosByProject.value[projectId] = [
          ...(photosByProject.value[projectId] || []),
          ...res.data,
        ];
      }
      if (res.meta) pagination.value[projectId] = res.meta;
    } catch (err) {
      _fail(err);
      throw err;
    } finally {
      _end();
    }
  }

  async function uploadPhoto(projectId, file) {
    uploading.value = true;
    error.value = null;
    try {
      const res = await photoService.uploadPhoto(projectId, file);
      const photos = photosByProject.value[projectId];
      if (photos) photos.push(res.data);
      // Bump counter
      if (pagination.value[projectId]) pagination.value[projectId].total += 1;
      return res.data;
    } catch (err) {
      _fail(err);
      throw err;
    } finally {
      uploading.value = false;
    }
  }

  async function deletePhoto(id, projectId) {
    _begin();
    try {
      await photoService.deletePhoto(id);
      if (photosByProject.value[projectId]) {
        photosByProject.value[projectId] = photosByProject.value[
          projectId
        ].filter((p) => p.id !== id);
        if (pagination.value[projectId]) pagination.value[projectId].total -= 1;
      }
    } catch (err) {
      _fail(err);
      throw err;
    } finally {
      _end();
    }
  }

  async function bulkDeletePhotos(ids, projectId) {
    _begin();
    try {
      const res = await photoService.bulkDeletePhotos(ids);
      if (photosByProject.value[projectId]) {
        photosByProject.value[projectId] = photosByProject.value[
          projectId
        ].filter((p) => !ids.includes(p.id));
        if (pagination.value[projectId]) {
          pagination.value[projectId].total -= res.data.deletedCount;
        }
      }
    } catch (err) {
      _fail(err);
      throw err;
    } finally {
      _end();
    }
  }

  function clearProject(projectId) {
    delete photosByProject.value[projectId];
    delete pagination.value[projectId];
  }

  return {
    // state
    photosByProject,
    loading,
    uploading,
    error,
    pagination,
    // computed
    getPhotos,
    getPhotoCount,
    // actions
    fetchPhotos,
    uploadPhoto,
    deletePhoto,
    bulkDeletePhotos,
    clearProject,
  };
});
