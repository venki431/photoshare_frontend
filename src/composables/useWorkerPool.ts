import { onUnmounted } from 'vue'
import type { CompressionResult } from '@/types'

interface PendingTask {
  resolve: (value: CompressionResult) => void
  reject: (reason: Error) => void
}

interface QueuedTask {
  file: File
  id: number
  taskId: number
}

export function useWorkerPool(size: number = navigator.hardwareConcurrency || 4) {
  const workers: Worker[] = []
  const freeWorkers = new Set<number>()
  const taskQueue: QueuedTask[] = []
  const pendingTasks = new Map<number, PendingTask>()
  let taskIdCounter = 0
  let terminated = false

  for (let i = 0; i < size; i++) {
    const worker = new Worker(
      new URL('../workers/compression.worker.js', import.meta.url),
      { type: 'module' }
    )

    worker.onmessage = (e: MessageEvent<{ id: number; error?: string; blob?: Blob; width?: number; height?: number }>) => {
      const { id, error, ...result } = e.data
      const task = pendingTasks.get(id)
      if (!task) return

      pendingTasks.delete(id)
      freeWorkers.add(i)

      if (error) {
        task.reject(new Error(error))
      } else {
        task.resolve(result as CompressionResult)
      }

      drainQueue()
    }

    worker.onerror = (err: ErrorEvent) => {
      freeWorkers.add(i)
      err.preventDefault()
    }

    freeWorkers.add(i)
    workers.push(worker)
  }

  function runTask(file: File, id: number): Promise<CompressionResult> {
    if (terminated) return Promise.reject(new Error('Worker pool terminated'))

    return new Promise<CompressionResult>((resolve, reject) => {
      const taskId = taskIdCounter++
      pendingTasks.set(taskId, { resolve, reject })
      taskQueue.push({ file, id, taskId })
      drainQueue()
    })
  }

  function drainQueue(): void {
    while (taskQueue.length > 0 && freeWorkers.size > 0) {
      const workerIndex = freeWorkers.values().next().value as number
      freeWorkers.delete(workerIndex)

      const task = taskQueue.shift()!
      workers[workerIndex].postMessage({
        file: task.file,
        id: task.taskId,
      })
    }
  }

  function terminate(): void {
    terminated = true
    workers.forEach(w => w.terminate())
    for (const [, task] of pendingTasks) {
      task.reject(new Error('Worker pool terminated'))
    }
    pendingTasks.clear()
    taskQueue.length = 0
  }

  onUnmounted(terminate)

  return { runTask, terminate }
}
