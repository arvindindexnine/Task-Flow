import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTaskStore } from '@/utils/store';
import api from '@/utils/api';
import type { Task } from '@/utils/types';

// Reset the store between tests using the built-in reset mechanism
const resetStore = () => {
    useTaskStore.setState({
        tasks: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
        filters: { status: '', priority: '', page: 1, limit: 10, sortOrder: 'ASC' },
        loading: false,
        error: null,
    });
};

const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'A description',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '2026-03-01T00:00:00.000Z',
    userId: 1,
};

// Shape the store actually expects from the backend
const mockApiResponse = {
    tasks: [mockTask],
    pager: { totalItems: 1, currentPage: 1, limit: 10, totalPages: 1 },
};

describe('useTaskStore', () => {
    beforeEach(() => {
        resetStore();
        vi.resetAllMocks();
    });

    // ─── fetchTasks ──────────────────────────────────────────────────────────────
    describe('fetchTasks', () => {
        it('sets loading true while fetching, then false after', async () => {
            vi.spyOn(api, 'get').mockResolvedValue({ data: mockApiResponse });

            const fetchPromise = useTaskStore.getState().fetchTasks();
            expect(useTaskStore.getState().loading).toBe(true);

            await fetchPromise;
            expect(useTaskStore.getState().loading).toBe(false);
        });

        it('populates tasks and meta on success', async () => {
            vi.spyOn(api, 'get').mockResolvedValue({ data: mockApiResponse });

            await useTaskStore.getState().fetchTasks();

            const state = useTaskStore.getState();
            expect(state.tasks).toHaveLength(1);
            expect(state.tasks[0].title).toBe('Test Task');
            expect(state.meta.total).toBe(1);
            expect(state.meta.totalPages).toBe(1);
        });

        it('sets error on API failure', async () => {
            vi.spyOn(api, 'get').mockRejectedValue(new Error('Network failure'));

            await useTaskStore.getState().fetchTasks();

            const state = useTaskStore.getState();
            expect(state.loading).toBe(false);
            expect(state.error).toBe('Network failure');
            expect(state.tasks).toHaveLength(0);
        });

        it('sends status and priority params when filters are set', async () => {
            const getSpy = vi.spyOn(api, 'get').mockResolvedValue({ data: mockApiResponse });

            useTaskStore.getState().setFilters({ status: 'TODO', priority: 'HIGH' });
            await useTaskStore.getState().fetchTasks();

            expect(getSpy).toHaveBeenCalledWith('/tasks', {
                params: expect.objectContaining({ status: 'TODO', priority: 'HIGH' }),
            });
        });

        it('omits status/priority params when filters are empty strings', async () => {
            const getSpy = vi.spyOn(api, 'get').mockResolvedValue({ data: mockApiResponse });

            await useTaskStore.getState().fetchTasks();

            const callParams = getSpy.mock.calls[0][1] as { params: Record<string, unknown> };
            expect(callParams.params).not.toHaveProperty('status');
            expect(callParams.params).not.toHaveProperty('priority');
        });
    });

    // ─── createTask ──────────────────────────────────────────────────────────────
    describe('createTask', () => {
        it('calls api.post and then refetches tasks', async () => {
            const postSpy = vi.spyOn(api, 'post').mockResolvedValue({ data: mockTask });
            vi.spyOn(api, 'get').mockResolvedValue({ data: mockApiResponse });

            await useTaskStore.getState().createTask({
                title: 'New Task',
                status: 'TODO',
                priority: 'MEDIUM',
            });

            expect(postSpy).toHaveBeenCalledWith('/tasks', expect.objectContaining({ title: 'New Task' }));
            expect(useTaskStore.getState().tasks).toHaveLength(1);
        });

        it('sets error and rethrows on API failure', async () => {
            vi.spyOn(api, 'post').mockRejectedValue(new Error('Create failed'));

            await expect(
                useTaskStore.getState().createTask({ title: 'Bad', status: 'TODO', priority: 'LOW' })
            ).rejects.toThrow('Create failed');

            expect(useTaskStore.getState().error).toBe('Create failed');
        });
    });

    // ─── updateTask ──────────────────────────────────────────────────────────────
    describe('updateTask', () => {
        it('calls api.patch and then refetches tasks', async () => {
            const patchSpy = vi.spyOn(api, 'patch').mockResolvedValue({ data: mockTask });
            vi.spyOn(api, 'get').mockResolvedValue({ data: mockApiResponse });

            await useTaskStore.getState().updateTask(1, { title: 'Updated' });

            expect(patchSpy).toHaveBeenCalledWith('/tasks/1', { title: 'Updated' });
            expect(useTaskStore.getState().loading).toBe(false);
        });
    });

    // ─── deleteTask ──────────────────────────────────────────────────────────────
    describe('deleteTask', () => {
        it('calls api.delete and then refetches tasks', async () => {
            const deleteSpy = vi.spyOn(api, 'delete').mockResolvedValue({ data: {} });
            vi.spyOn(api, 'get').mockResolvedValue({ data: { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } } });

            await useTaskStore.getState().deleteTask(1);

            expect(deleteSpy).toHaveBeenCalledWith('/tasks/1');
            expect(useTaskStore.getState().tasks).toHaveLength(0);
        });
    });

    // ─── setFilters ───────────────────────────────────────────────────────────────
    describe('setFilters', () => {
        it('merges partial filters into existing state', () => {
            useTaskStore.getState().setFilters({ status: 'COMPLETED' });
            expect(useTaskStore.getState().filters.status).toBe('COMPLETED');
            // Other filters remain unchanged
            expect(useTaskStore.getState().filters.limit).toBe(10);
        });

        it('always resets page to 1 when not explicitly provided', () => {
            useTaskStore.setState({ filters: { status: '', priority: '', page: 3, limit: 10, sortOrder: 'ASC' } });
            useTaskStore.getState().setFilters({ status: 'TODO' });
            expect(useTaskStore.getState().filters.page).toBe(1);
        });

        it('keeps explicit page value when provided', () => {
            useTaskStore.getState().setFilters({ page: 5 });
            expect(useTaskStore.getState().filters.page).toBe(5);
        });
    });
});
