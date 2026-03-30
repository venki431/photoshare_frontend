/**
 * Projects Mock — behaves exactly like a real REST API would.
 *
 * Every exported function:
 *  - Returns a Promise (real network feel)
 *  - Adds artificial latency (500–900 ms)
 *  - Returns the standard { success, data, message } envelope
 *  - Throws on deliberate error cases so services can catch them
 */

import { buildSuccess, buildError } from '@/api/client'

// ─── Artificial latency ───────────────────────────────────────────────────────
const delay = (ms = 700) => new Promise(r => setTimeout(r, ms))
const jitter = () => Math.floor(Math.random() * 400) + 500  // 500–900 ms

// ─── Seed data ────────────────────────────────────────────────────────────────
// Kept in a module-level array so mutations (create/delete) persist for the
// lifetime of the browser session — exactly like a server would.

const _projects = [
  {
    id: 'proj_1',
    name: 'Sarah & James Wedding',
    eventType: 'wedding',
    status: 'pending',
    createdAt: '2026-03-15T09:00:00Z',
    imageCount: 248,
    selectedCount: 0,
    shareId: 'share_abc123',
    password: '',
    coverImage: 'https://picsum.photos/seed/wedding1/600/400',
    clientName: 'Sarah Johnson',
    clientEmail: 'sarah@example.com',
    clientMobile: '+1 555-0101',
    notes: 'Beach ceremony, golden hour shoot',
  },
  {
    id: 'proj_2',
    name: "Emma's 5th Birthday",
    eventType: 'birthday',
    status: 'completed',
    createdAt: '2026-03-10T11:30:00Z',
    imageCount: 156,
    selectedCount: 42,
    shareId: 'share_def456',
    password: '1234',
    coverImage: 'https://picsum.photos/seed/birthday1/600/400',
    clientName: 'Lisa Thompson',
    clientEmail: 'emma.mom@example.com',
    clientMobile: '+1 555-0202',
    notes: 'Indoor party with balloon decor',
  },
  {
    id: 'proj_3',
    name: 'TechCorp Annual Summit',
    eventType: 'corporate',
    status: 'pending',
    createdAt: '2026-03-22T08:00:00Z',
    imageCount: 312,
    selectedCount: 0,
    shareId: 'share_ghi789',
    password: '',
    coverImage: 'https://picsum.photos/seed/corporate1/600/400',
    clientName: 'Mark Davis',
    clientEmail: 'hr@techcorp.com',
    clientMobile: '+1 555-0303',
    notes: 'Keynote + team headshots',
  },
  {
    id: 'proj_4',
    name: 'Priya & Raj Engagement',
    eventType: 'engagement',
    status: 'in_review',
    createdAt: '2026-03-18T15:00:00Z',
    imageCount: 89,
    selectedCount: 15,
    shareId: 'share_jkl012',
    password: '',
    coverImage: 'https://picsum.photos/seed/engagement1/600/400',
    clientName: 'Priya Sharma',
    clientEmail: 'priya@example.com',
    clientMobile: '+91 98765-43210',
    notes: 'Sunrise rooftop session',
  },
]

// ─── Mock handlers ────────────────────────────────────────────────────────────

/**
 * GET /projects
 * Supports: page, perPage, status, search query params.
 */
export async function getProjects({ page = 1, perPage = 10, status, search } = {}) {
  await delay(jitter())

  let list = [..._projects]

  if (status) list = list.filter(p => p.status === status)
  if (search) {
    const q = search.toLowerCase()
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.eventType.toLowerCase().includes(q)
    )
  }

  const total = list.length
  const totalPages = Math.ceil(total / perPage)
  const start = (page - 1) * perPage
  const data = list.slice(start, start + perPage)

  return buildSuccess(data, 'Projects fetched successfully', {
    total,
    page: Number(page),
    perPage: Number(perPage),
    totalPages,
  })
}

/**
 * GET /projects/:id
 */
export async function getProject(id) {
  await delay(jitter())

  const project = _projects.find(p => p.id === id)
  if (!project) throw buildError(`Project '${id}' not found`)

  return buildSuccess({ ...project }, 'Project fetched successfully')
}

/**
 * GET /projects/share/:shareId
 */
export async function getProjectByShareId(shareId) {
  await delay(jitter())

  const project = _projects.find(p => p.shareId === shareId)
  if (!project) throw buildError(`Gallery link is invalid or has expired`)

  return buildSuccess({ ...project }, 'Gallery loaded successfully')
}

/**
 * POST /projects
 */
export async function createProject(data) {
  await delay(900)

  if (!data.name?.trim()) throw buildError('Project name is required')
  if (!data.eventType)    throw buildError('Event type is required')

  const newProject = {
    id: `proj_${Date.now()}`,
    name: data.name.trim(),
    eventType: data.eventType,
    status: 'pending',
    createdAt: new Date().toISOString(),
    imageCount: data.imageCount ?? 0,
    selectedCount: 0,
    shareId: `share_${Math.random().toString(36).slice(2, 10)}`,
    password: data.password || '',
    coverImage: `https://picsum.photos/seed/${Date.now()}/600/400`,
    clientName: data.clientName || '',
    clientEmail: data.clientEmail || '',
    clientMobile: data.clientMobile || '',
    notes: data.notes || '',
  }

  _projects.unshift(newProject)

  return buildSuccess({ ...newProject }, 'Project created successfully')
}

/**
 * PUT /projects/:id
 */
export async function updateProject(id, data) {
  await delay(jitter())

  const idx = _projects.findIndex(p => p.id === id)
  if (idx === -1) throw buildError(`Project '${id}' not found`)

  const allowed = ['name', 'eventType', 'status', 'password', 'clientName', 'clientEmail', 'clientMobile', 'notes']
  allowed.forEach(field => {
    if (data[field] !== undefined) _projects[idx][field] = data[field]
  })

  return buildSuccess({ ..._projects[idx] }, 'Project updated successfully')
}

/**
 * DELETE /projects/:id
 */
export async function deleteProject(id) {
  await delay(jitter())

  const idx = _projects.findIndex(p => p.id === id)
  if (idx === -1) throw buildError(`Project '${id}' not found`)

  _projects.splice(idx, 1)

  return buildSuccess(null, 'Project deleted successfully')
}
