export type UploadPhase = 'idle' | 'compressing' | 'ready' | 'uploading' | 'done'

export type FileEntryStatus = 'compressing' | 'ready' | 'uploading' | 'done' | 'failed' | 'cancelled'

export interface FileEntry {
  id: number
  name: string
  original: File
  fileKey: string
  compressed: Blob | null
  status: FileEntryStatus
  retries: number
}

export interface PreviewImage {
  id: number
  url: string
  thumbUrl: string
  filename: string
  fileKey: string
}

export interface FileInputItem {
  file: File
  fileKey: string
}

export type UploadFn = (
  blob: Blob,
  filename: string,
  meta: { fileKey: string },
  options: { signal: AbortSignal; onProgress: (pct: number) => void }
) => Promise<void>

export interface UploadManagerOptions {
  uploadConcurrency?: number
  maxRetries?: number
}

export interface CompressionResult {
  blob: Blob
  width: number
  height: number
}

export interface CompressionWorkerMessage {
  file: File
  id: number
  maxDimension?: number
  quality?: number
}

export interface CompressionWorkerResult {
  id: number
  blob?: Blob
  width?: number
  height?: number
  error?: string
}
