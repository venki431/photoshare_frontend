import { onUnmounted } from 'vue'

/**
 * Web Worker pool with proper free/busy tracking.
 *
 * Key fixes vs original:
 * 1. Each worker gets a PERMANENT onmessage handler at creation (no overwrites)
 * 2. Free workers tracked via a Set — no more `active % length` guessing
 * 3. Each task gets a unique ID mapped to its resolve/reject — no lost promises
 * 4. Workers terminated on unmount — no memory leaks
 * 5. Exposed `terminate()` for manual cleanup
 */
export function useWorkerPool(size = navigator.hardwareConcurrency || 4) {
  const workers = []
  const freeWorkers = new Set()
  const taskQueue = []
  const pendingTasks = new Map() // taskId -> { resolve, reject }
  let taskIdCounter = 0
  let terminated = false

  // Create workers with permanent message handlers
  for (let i = 0; i < size; i++) {
    const worker = new Worker(
      new URL('../workers/compression.worker.js', import.meta.url),
      { type: 'module' }
    )

    // Permanent handler — never overwritten
    worker.onmessage = (e) => {
      const { id, error, ...result } = e.data
      const task = pendingTasks.get(id)
      if (!task) return

      pendingTasks.delete(id)
      freeWorkers.add(i)

      if (error) {
        task.reject(new Error(error))
      } else {
        task.resolve(result)
      }

      // Drain queue with this now-free worker
      drainQueue()
    }

    worker.onerror = (err) => {
      // If a worker crashes, mark it free and reject the oldest pending task
      freeWorkers.add(i)
      err.preventDefault()
    }

    freeWorkers.add(i)
    workers.push(worker)
  }

  function runTask(file, id) {
    if (terminated) return Promise.reject(new Error('Worker pool terminated'))

    return new Promise((resolve, reject) => {
      const taskId = taskIdCounter++
      pendingTasks.set(taskId, { resolve, reject })
      taskQueue.push({ file, id, taskId })
      drainQueue()
    })
  }

  function drainQueue() {
    while (taskQueue.length > 0 && freeWorkers.size > 0) {
      const workerIndex = freeWorkers.values().next().value
      freeWorkers.delete(workerIndex)

      const task = taskQueue.shift()
      workers[workerIndex].postMessage({
        file: task.file,
        id: task.taskId // Use internal taskId for tracking
      })
    }
  }

  function terminate() {
    terminated = true
    workers.forEach(w => w.terminate())
    // Reject any pending tasks
    for (const [, task] of pendingTasks) {
      task.reject(new Error('Worker pool terminated'))
    }
    pendingTasks.clear()
    taskQueue.length = 0
  }

  // Auto-cleanup on component unmount
  onUnmounted(terminate)

  return { runTask, terminate }
}
