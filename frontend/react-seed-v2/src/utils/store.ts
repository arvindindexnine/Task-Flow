import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Task, TaskFilters, PaginationMeta } from './types';
import api from './api';

// ─── Auth Store ────────────────────────────────────────────────────────────────
export interface AuthState {
  token: string | null;
  user: User | null;
  /** Unix timestamp (ms) when the token expires */
  expiresAt: number | null;
  isLoggedIn: boolean;
  isAuthenticated: boolean; // alias kept for compatibility
  loading: boolean;
  error: string | null;
  setAuth: (token: string, user: User, expiresInSeconds?: number) => void;
  logout: () => void;
  checkExpiry: () => void;
}

/** Token TTL in ms: 5 hours */
const TOKEN_TTL_MS = 5 * 60 * 60 * 1000;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      expiresAt: null,
      isLoggedIn: false,
      isAuthenticated: false,
      loading: false,
      error: null,

      setAuth: (token, user, expiresInSeconds) => {
        const ttl = expiresInSeconds ? expiresInSeconds * 1000 : TOKEN_TTL_MS;
        const expiresAt = Date.now() + ttl;
        set({ token, user, expiresAt, isLoggedIn: true, isAuthenticated: true, error: null });
      },

      logout: () =>
        set({ token: null, user: null, expiresAt: null, isLoggedIn: false, isAuthenticated: false }),

      /** Call once on app mount to clear stale sessions */
      checkExpiry: () => {
        const { expiresAt, isLoggedIn } = get();
        if (isLoggedIn && expiresAt && Date.now() > expiresAt) {
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      // Migrate old sessions — copy through any user/token that already exists
      migrate: (persisted: unknown) => persisted as AuthState,
      // Only persist auth data — not UI states like loading/error
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        expiresAt: state.expiresAt,
        isLoggedIn: state.isLoggedIn,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ─── Task Store ────────────────────────────────────────────────────────────────
interface TaskState {
  tasks: Task[];
  meta: PaginationMeta;
  filters: TaskFilters;
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (data: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: number, data: Partial<Omit<Task, 'id' | 'userId'>>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  setFilters: (filters: Partial<TaskFilters>) => void;
}

const DEFAULT_FILTERS: TaskFilters = {
  status: '',
  priority: '',
  page: 1,
  limit: 5,
  sortOrder: 'ASC',
};

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: [],
  meta: { total: 0, page: 1, limit: 5, totalPages: 0 },
  filters: DEFAULT_FILTERS,
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const params: Record<string, string | number> = {
        page: filters.page,
        limit: filters.limit ?? 5,
      };
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.sortOrder) params.sortOrder = filters.sortOrder;
      if (filters.search) params.search = filters.search;

      // Backend returns { tasks: Task[], pager: Pager }
      const response = await api.get<{ tasks: Task[]; pager: { totalItems: number; currentPage: number; limit: number; totalPages: number } }>('/tasks', { params });
      const { tasks, pager } = response.data;
      set({
        tasks: tasks ?? [],
        meta: {
          total: pager?.totalItems ?? 0,
          page: pager?.currentPage ?? 1,
          limit: pager?.limit ?? 5,
          totalPages: pager?.totalPages ?? 0,
        },
        loading: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
      set({ loading: false, error: message });
    }
  },

  createTask: async (data) => {
    set({ loading: true, error: null });
    try {
      await api.post<Task>('/tasks', data);
      await get().fetchTasks();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      set({ loading: false, error: message });
      throw err;
    }
  },

  updateTask: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await api.patch<Task>(`/tasks/${id}`, data);
      await get().fetchTasks();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      set({ loading: false, error: message });
      throw err;
    }
  },

  deleteTask: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/tasks/${id}`);
      await get().fetchTasks();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      set({ loading: false, error: message });
      throw err;
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: newFilters.page ?? 1 },
    }));
  },
}));

// ─── Admin Store ───────────────────────────────────────────────────────────────
interface AdminState {
  users: User[];
  pendingAdmins: User[];
  stats: {
    totalUsers: number;
    totalTasks: number;
    activeMembers: number;
  };
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  fetchPendingAdmins: () => Promise<void>;
  updateUserStatus: (userId: number, status: 'APPROVED' | 'REJECTED') => Promise<void>;
  createUser: (data: any) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
}

export const useAdminStore = create<AdminState>()((set, get) => ({
  users: [],
  pendingAdmins: [],
  stats: { totalUsers: 0, totalTasks: 0, activeMembers: 0 },
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<{ users: User[], totalUsers: number, totalTasks: number, activeMembers: number }>('/users/list');
      set({
        users: response.data.users,
        stats: {
          totalUsers: response.data.totalUsers,
          totalTasks: response.data.totalTasks,
          activeMembers: response.data.activeMembers,
        },
        loading: false
      });
    } catch (err: any) {
      set({ loading: false, error: err.response?.data?.message || 'Failed to fetch users' });
    }
  },

  fetchPendingAdmins: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<User[]>('/users/pending-admins');
      set({ pendingAdmins: response.data, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err.response?.data?.message || 'Failed to fetch pending admins' });
    }
  },

  updateUserStatus: async (userId, status) => {
    set({ loading: true, error: null });
    try {
      await api.patch(`/users/${userId}/status`, { status, userId });
      // Refresh both lists
      await get().fetchUsers();
      await get().fetchPendingAdmins();
    } catch (err: any) {
      set({ loading: false, error: err.response?.data?.message || 'Failed to update user status' });
      throw err;
    }
  },

  createUser: async (data) => {
    set({ loading: true, error: null });
    try {
      await api.post('/users', data);
      await get().fetchUsers();
    } catch (err: any) {
      set({ loading: false, error: err.response?.data?.message || 'Failed to create user' });
      throw err;
    }
  },

  deleteUser: async (userId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/users/${userId}`);
      await get().fetchUsers();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete user';
      set({ loading: false, error: message });
      throw new Error(message);
    }
  }
}));
