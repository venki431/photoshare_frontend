<template>
  <div class="projects-page">
    <!-- Header -->
    <div class="page-header ps-animate-in">
      <div class="page-header__text">
        <h1 class="page-title">Projects</h1>
        <p class="page-subtitle">
          {{ projectStore.totalProjects }} total project{{ projectStore.totalProjects !== 1 ? "s" : "" }}
          <span v-if="projectStore.pendingCount" class="subtitle-badge">
            &middot; {{ projectStore.pendingCount }} pending review
          </span>
        </p>
      </div>

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        class="text-none ps-btn-glow"
        elevation="0"
        size="large"
        rounded="lg"
        @click="createDialog = true"
      >
        New Project
      </v-btn>
    </div>

    <!-- Create Project Dialog -->
    <v-dialog v-model="createDialog" max-width="580" persistent>
      <v-card class="create-dialog">
        <!-- Dialog Header -->
        <div class="dialog-header">
          <div class="dialog-header__icon">
            <v-icon size="24" color="white">mdi-folder-plus-outline</v-icon>
          </div>
          <div>
            <h3 class="dialog-title">Create New Project</h3>
            <p class="dialog-subtitle">Set up a new gallery for your client</p>
          </div>
          <v-btn
            icon="mdi-close"
            size="small"
            variant="text"
            class="dialog-close"
            @click="resetAndClose"
          />
        </div>

        <v-form
          ref="createFormRef"
          @submit.prevent="handleCreate"
          v-model="formValid"
          class="dialog-body"
        >
          <!-- Client Image Upload -->
          <div class="avatar-upload">
            <div class="avatar-upload__preview" @click="triggerFileInput">
              <v-avatar v-if="createForm.clientImagePreview" size="100">
                <v-img :src="createForm.clientImagePreview" cover />
              </v-avatar>
              <div v-else class="avatar-upload__placeholder">
                <v-icon size="36" color="grey-lighten-1">mdi-account-circle-outline</v-icon>
              </div>
              <div class="avatar-upload__overlay">
                <v-icon size="20" color="white">mdi-camera</v-icon>
              </div>
            </div>
            <button type="button" class="avatar-upload__btn" @click="triggerFileInput">
              {{ createForm.clientImagePreview ? "Change Photo" : "Add Client Photo" }}
            </button>
            <input
              ref="fileInput"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              @change="handleImageUpload"
            />
          </div>

          <!-- Form Fields -->
          <div class="form-grid">
            <div class="ps-field">
              <v-text-field
                v-model="createForm.name"
                placeholder="Project Name"
                :rules="nameRules"
                required
                variant="outlined"
                class="ps-input"
              />
            </div>

            <div class="ps-field">
              <v-select
                v-model="createForm.eventType"
                placeholder="Event Type"
                :items="eventTypes"
                item-title="text"
                item-value="value"
                :rules="eventTypeRules"
                required
                variant="outlined"
                class="ps-input"
              />
            </div>

            <div class="ps-field">
              <v-text-field
                v-model="createForm.clientName"
                placeholder="Customer Name"
                :rules="clientNameRules"
                required
                variant="outlined"
                class="ps-input"
              />
            </div>

            <div class="form-row">
              <div class="ps-field">
                <v-text-field
                  v-model="createForm.clientEmail"
                  placeholder="Customer Email"
                  type="email"
                  :rules="emailRules"
                  hint="Optional"
                  persistent-hint
                  variant="outlined"
                  class="ps-input"
                />
              </div>

              <div class="ps-field">
                <v-text-field
                  v-model="createForm.clientMobile"
                  placeholder="Customer Mobile"
                  type="tel"
                  :rules="mobileRules"
                  required
                  variant="outlined"
                  class="ps-input"
                />
              </div>
            </div>
          </div>

          <v-btn
            block
            color="primary"
            type="submit"
            class="text-none ps-btn-glow dialog-submit"
            elevation="0"
            size="x-large"
            rounded="lg"
            :loading="creating"
            :disabled="!formValid"
          >
            <v-icon start>mdi-rocket-launch-outline</v-icon>
            Create Project
          </v-btn>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Filters & View Toggle -->
    <div class="toolbar ps-animate-in ps-animate-in-delay-1">
      <div class="toolbar__main">
        <div class="search-wrapper">
          <v-icon size="18" class="search-icon">mdi-magnify</v-icon>
          <input
            v-model="search"
            type="text"
            placeholder="Search projects..."
            class="search-input"
          />
          <button v-if="search" class="search-clear" @click="search = ''">
            <v-icon size="16">mdi-close</v-icon>
          </button>
        </div>

        <div class="filter-chips">
          <button
            v-for="f in filterOptions"
            :key="f.value"
            class="filter-chip"
            :class="{ 'filter-chip--active': statusFilter === f.value }"
            @click="statusFilter = f.value"
          >
            <span v-if="f.dot" class="filter-dot" :class="`filter-dot--${f.value}`" />
            {{ f.label }}
            <span v-if="f.count !== undefined" class="filter-count">{{ f.count }}</span>
          </button>
        </div>
      </div>

      <div class="view-toggle">
        <button
          class="toggle-btn"
          :class="{ 'toggle-btn--active': viewMode === 'grid' }"
          @click="viewMode = 'grid'"
        >
          <v-icon size="18">mdi-view-grid-outline</v-icon>
        </button>
        <button
          class="toggle-btn"
          :class="{ 'toggle-btn--active': viewMode === 'list' }"
          @click="viewMode = 'list'"
        >
          <v-icon size="18">mdi-view-list-outline</v-icon>
        </button>
      </div>
    </div>

    <!-- Grid View -->
    <div
      v-if="viewMode === 'grid' && filteredProjects.length > 0"
      class="projects-grid ps-stagger"
    >
      <ProjectCard
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
      />
    </div>

    <!-- List View -->
    <div
      v-else-if="viewMode === 'list' && filteredProjects.length > 0"
      class="project-list"
    >
      <router-link
        v-for="project in filteredProjects"
        :key="project.id"
        :to="`/projects/${project.id}`"
        class="list-item"
      >
        <v-avatar size="52" rounded="lg" class="list-item__avatar">
          <v-img :src="project.coverImage" cover />
        </v-avatar>
        <div class="list-item__info">
          <div class="list-item__name">{{ project.name }}</div>
          <div class="list-item__meta">
            {{ project.imageCount }} photos &middot; {{ project.selectedCount }} selected
            &middot; {{ formatDate(project.createdAt) }}
          </div>
        </div>
        <StatusBadge :status="project.status" />
        <v-icon size="16" class="list-item__arrow">mdi-chevron-right</v-icon>
      </router-link>
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else
      icon="mdi-magnify"
      title="No projects found"
      description="Try adjusting your search or filters to find what you're looking for."
      compact
    >
      <template #action>
        <v-btn
          variant="outlined"
          color="primary"
          size="small"
          class="text-none"
          @click="clearFilters"
        >
          Clear Filters
        </v-btn>
      </template>
    </EmptyState>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useProjectStore } from "@/stores/projects";
import type { Project, ProjectStatus } from "@/types";
import ProjectCard from "@/components/ui/ProjectCard.vue";
import StatusBadge from "@/components/ui/StatusBadge.vue";
import EmptyState from "@/components/ui/EmptyState.vue";

interface VFormInstance {
  validate: () => Promise<{ valid: boolean }>;
}

interface FilterOption {
  label: string;
  value: string;
  dot?: boolean;
  count: number;
}

interface CreateFormState {
  name: string;
  eventType: string;
  clientName: string;
  clientEmail: string;
  clientMobile: string;
  clientImage: string | null;
  clientImagePreview: string | null;
}

const router = useRouter();
const projectStore = useProjectStore();

const search = ref<string>("");
const statusFilter = ref<string>("all");
const viewMode = ref<"grid" | "list">("grid");

const filterOptions = computed<FilterOption[]>(() => [
  { label: "All", value: "all", count: projectStore.totalProjects },
  { label: "Pending", value: "pending", dot: true, count: projectStore.pendingCount },
  { label: "In Review", value: "in_review", dot: true, count: projectStore.inReviewCount },
  { label: "Completed", value: "completed", dot: true, count: projectStore.completedCount },
]);

// Create Project Dialog
const createDialog = ref<boolean>(false);
const creating = ref<boolean>(false);
const createFormRef = ref<VFormInstance | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const formValid = ref<boolean>(false);

const createForm = reactive<CreateFormState>({
  name: "",
  eventType: "",
  clientName: "",
  clientEmail: "",
  clientMobile: "",
  clientImage: null,
  clientImagePreview: null,
});

const eventTypes: Array<{ text: string; value: string }> = [
  { text: "Wedding", value: "wedding" },
  { text: "Birthday", value: "birthday" },
  { text: "Corporate", value: "corporate" },
  { text: "Engagement", value: "engagement" },
  { text: "Portrait", value: "portrait" },
  { text: "Other", value: "other" },
];

const nameRules: Array<(v: string) => boolean | string> = [
  (v: string) => !!v?.trim() || "Project name is required",
  (v: string) => (v?.trim().length ?? 0) >= 3 || "Project name must be at least 3 characters",
];
const eventTypeRules: Array<(v: string) => boolean | string> = [(v: string) => !!v || "Please select an event type"];
const clientNameRules: Array<(v: string) => boolean | string> = [
  (v: string) => !!v?.trim() || "Customer name is required",
  (v: string) => (v?.trim().length ?? 0) >= 2 || "Please enter a valid name",
];
const emailRules: Array<(v: string) => boolean | string> = [
  (v: string) => !v || /.+@.+\..+/.test(v) || "Please enter a valid email address",
];
const mobileRules: Array<(v: string) => boolean | string> = [
  (v: string) => !!v?.trim() || "Customer mobile number is required",
  (v: string) =>
    /^[\d+\s-]{10,15}$/.test(v?.replace(/\s/g, "") ?? "") ||
    "Please enter a valid mobile number",
];

function triggerFileInput(): void {
  fileInput.value?.click();
}

function compressImage(file: File, maxWidth: number = 512, quality: number = 0.7): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxWidth / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = url;
  });
}

async function handleImageUpload(e: Event): Promise<void> {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file || !file.type.startsWith("image/")) return;

  const base64 = await compressImage(file);
  createForm.clientImage = base64;
  createForm.clientImagePreview = base64;
}

async function handleCreate(): Promise<void> {
  const { valid } = await createFormRef.value!.validate();
  if (!valid) return;

  creating.value = true;
  try {
    const payload: Record<string, string | undefined> = {
      name: createForm.name.trim(),
      eventType: createForm.eventType,
      clientName: createForm.clientName.trim(),
      clientMobile: createForm.clientMobile.trim(),
      clientEmail: createForm.clientEmail?.trim() || undefined,
    };

    const project = await projectStore.createProject(payload as { name: string; eventType: string; [key: string]: string | undefined });
    resetAndClose();
    router.push(`/projects/${project.id}`);
  } catch {
    // handled by store error state
  } finally {
    creating.value = false;
  }
}

function resetAndClose(): void {
  createDialog.value = false;
  Object.assign(createForm, {
    name: "",
    eventType: "",
    clientName: "",
    clientEmail: "",
    clientMobile: "",
    clientImage: null,
    clientImagePreview: null,
  });
  if (fileInput.value) fileInput.value.value = "";
}

function clearFilters(): void {
  search.value = "";
  statusFilter.value = "all";
}

onMounted(() => {
  projectStore.fetchProjects().catch(() => {});
});

const filteredProjects = computed<Project[]>(() => {
  let list = projectStore.projects;

  if (statusFilter.value !== "all") {
    list = list.filter((p) => p.status === statusFilter.value);
  }

  if (search.value) {
    const q = search.value.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q));
  }

  return list;
});

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
</script>

<style scoped>
/* ====================== LAYOUT ====================== */
.projects-page {
  display: flex;
  flex-direction: column;
  gap: var(--ps-section-gap);
  min-width: 0;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.page-title {
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 14px;
  color: #94a3b8;
  margin: 4px 0 0;
}

.subtitle-badge {
  color: #f59e0b;
  font-weight: 600;
}

/* ====================== CREATE DIALOG ====================== */
.create-dialog {
  border-radius: var(--ps-radius-2xl) !important;
  box-shadow: var(--ps-shadow-xl) !important;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 28px 32px 0;
}

.dialog-header__icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: var(--ps-gradient-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dialog-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.dialog-subtitle {
  font-size: 13px;
  color: #94a3b8;
  margin: 2px 0 0;
}

.dialog-close {
  margin-left: auto;
}

.dialog-body {
  padding: 24px 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Avatar Upload */
.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.avatar-upload__preview {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid #f1f5f9;
  transition: border-color 0.2s ease;
}

.avatar-upload__preview:hover {
  border-color: var(--ps-primary-light);
}

.avatar-upload__placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-upload__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.avatar-upload__preview:hover .avatar-upload__overlay {
  opacity: 1;
}

.avatar-upload__btn {
  font-size: 13px;
  font-weight: 600;
  color: var(--ps-primary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--ps-radius-sm);
}

.avatar-upload__btn:hover {
  background: rgba(79, 70, 229, 0.06);
}

/* Form */
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row > * {
  flex: 1;
}

/* ====================== TOOLBAR ====================== */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.toolbar__main {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
  flex-wrap: wrap;
}

.search-wrapper {
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 320px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 42px;
  padding: 0 36px 0 42px;
  border: 1px solid var(--ps-border);
  border-radius: var(--ps-radius-lg);
  background: white;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: var(--ps-primary-light);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.search-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: #f1f5f9;
  cursor: pointer;
  color: #64748b;
}

/* Filter Chips */
.filter-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 9999px;
  border: 1px solid var(--ps-border);
  background: white;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.filter-chip:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.filter-chip--active {
  background: rgba(79, 70, 229, 0.06);
  border-color: rgba(79, 70, 229, 0.2);
  color: var(--ps-primary);
  font-weight: 600;
}

.filter-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.filter-dot--pending { background: #f59e0b; }
.filter-dot--in_review { background: #3b82f6; }
.filter-dot--completed { background: #10b981; }

.filter-count {
  font-size: 11px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.04);
}

.filter-chip--active .filter-count {
  background: rgba(79, 70, 229, 0.1);
  color: var(--ps-primary);
}

/* View Toggle */
.view-toggle {
  display: flex;
  border: 1px solid var(--ps-border);
  border-radius: var(--ps-radius-md);
  overflow: hidden;
  flex-shrink: 0;
}

.toggle-btn {
  width: 38px;
  height: 38px;
  border: none;
  background: white;
  cursor: pointer;
  color: #94a3b8;
  transition: all 0.2s ease;
}

.toggle-btn + .toggle-btn {
  border-left: 1px solid var(--ps-border);
}

.toggle-btn--active {
  background: rgba(79, 70, 229, 0.06);
  color: var(--ps-primary);
}

/* ====================== PROJECT VIEWS ====================== */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.project-list {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: var(--ps-radius-xl);
  border: 1px solid var(--ps-border);
  overflow: hidden;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  text-decoration: none;
  color: inherit;
  transition: background 0.2s ease;
}

.list-item + .list-item {
  border-top: 1px solid #f1f5f9;
}

.list-item:hover {
  background: #fafbfc;
}

.list-item__name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}

.list-item__meta {
  font-size: 13px;
  color: #94a3b8;
}

.list-item__arrow {
  color: #cbd5e1;
  flex-shrink: 0;
}

/* ====================== PREMIUM FORM STYLING ====================== */
:deep(.ps-input .v-field) {
  border-radius: 12px;
  transition: all 0.25s ease;
  background: #ffffff;
  min-height: 48px;
}

:deep(.ps-input .v-field--variant-outlined) {
  border-color: #e2e8f0;
}

:deep(.ps-input .v-field:hover) {
  border-color: #cbd5e1;
  background: #fafbff;
}

:deep(.ps-input .v-field--active) {
  border-color: var(--ps-primary);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
}

:deep(.ps-input .v-label) {
  font-size: 14px;
  color: #94a3b8;
  transition: all 0.2s ease;
}

:deep(.ps-input .v-field--active .v-label),
:deep(.ps-input .v-field--dirty .v-label) {
  color: var(--ps-primary);
  font-weight: 600;
  transform: translateY(-10px) scale(0.85);
}

:deep(.ps-input .v-field--error) {
  border-color: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
}

:deep(.v-messages) {
  min-height: 16px;
  margin-top: 4px;
}

/* ====================== RESPONSIVE ====================== */
@media (max-width: 960px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .page-header,
  .toolbar__main {
    flex-direction: column;
    align-items: stretch;
  }

  .search-wrapper {
    max-width: none;
    min-width: 0;
  }

  .filter-chips {
    overflow-x: auto;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
  }

  .form-row {
    flex-direction: column;
    gap: 14px;
  }

  .dialog-header,
  .dialog-body {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>