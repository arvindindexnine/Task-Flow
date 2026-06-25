import { defineMock } from 'vite-plugin-mock-dev-server'

// In-memory task store
const tasks = new Map<number, {
    id: number
    title: string
    description?: string
    status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
    priority: 'LOW' | 'MEDIUM' | 'HIGH'
    dueDate?: string
    userId: number
}>()

// Seed with some sample tasks
tasks.set(1, { id: 1, title: 'Set up project', description: 'Initial project setup', status: 'COMPLETED', priority: 'HIGH', userId: 1 })
tasks.set(2, { id: 2, title: 'Build task list UI', description: 'Create the task list component', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2026-03-01T00:00:00.000Z', userId: 1 })
tasks.set(3, { id: 3, title: 'Write unit tests', description: 'Add vitest tests for all components', status: 'TODO', priority: 'MEDIUM', dueDate: '2026-03-10T00:00:00.000Z', userId: 1 })
tasks.set(4, { id: 4, title: 'Code review', description: undefined, status: 'TODO', priority: 'LOW', userId: 1 })

export default defineMock([
    // GET /api/v1/tasks — list with filters + pagination
    {
        url: '/api/v1/tasks',
        method: 'GET',
        body: ({ query }) => {
            let list = Array.from(tasks.values())

            // Apply filters
            if (query.status) list = list.filter(t => t.status === query.status)
            if (query.priority) list = list.filter(t => t.priority === query.priority)

            // Sort by dueDate
            const order = query.sortOrder === 'DESC' ? -1 : 1
            list.sort((a, b) => {
                if (!a.dueDate && !b.dueDate) return 0
                if (!a.dueDate) return 1
                if (!b.dueDate) return -1
                return order * (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            })

            // Paginate
            const page = Number(query.page) || 1
            const limit = Number(query.limit) || 10
            const totalItems = list.length
            const totalPages = Math.max(1, Math.ceil(totalItems / limit))
            const startIndex = (page - 1) * limit
            const pagedList = list.slice(startIndex, startIndex + limit)

            return {
                tasks: pagedList,
                pager: {
                    totalItems,
                    currentPage: page,
                    limit,
                    totalPages,
                    startPage: 1,
                    endPage: totalPages,
                    startIndex,
                    endIndex: startIndex + pagedList.length - 1,
                    pages: Array.from({ length: totalPages }, (_, i) => i + 1),
                },
            }
        },
    },

    // POST /api/v1/tasks — create
    {
        url: '/api/v1/tasks',
        method: 'POST',
        body: ({ body }) => {
            const data = body as { title: string; description?: string; status: string; priority: string; dueDate?: string }
            const id = tasks.size + 1
            const task = { id, userId: 1, ...data } as typeof tasks extends Map<number, infer V> ? V : never
            tasks.set(id, task)
            return task
        },
    },

    // PATCH /api/v1/tasks/:id — update
    {
        url: '/api/v1/tasks/:id',
        method: 'PATCH',
        body: ({ params, body }) => {
            const id = Number(params.id)
            const existing = tasks.get(id)
            if (!existing) return { status: 404, body: { error: 'Task not found' } }
            const updated = { ...existing, ...(body as object) }
            tasks.set(id, updated)
            return updated
        },
    },

    // DELETE /api/v1/tasks/:id — delete
    {
        url: '/api/v1/tasks/:id',
        method: 'DELETE',
        body: ({ params }) => {
            const id = Number(params.id)
            tasks.delete(id)
            return { message: 'Task deleted' }
        },
    },
])
