# Indexnine Task Flow

A full-stack task management application built with **NestJS** (backend) and **React** (frontend). It supports multi-role user authentication, full task CRUD with filtering and pagination, an admin dashboard for user management, and password recovery flows.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [User Roles](#user-roles)
- [API Reference](#api-reference)
- [Frontend Pages & Components](#frontend-pages--components)
- [State Management](#state-management)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Running Both Together](#running-both-together)
- [Environment Variables](#environment-variables)
- [Database & Migrations](#database--migrations)
- [Testing](#testing)
- [Code Quality](#code-quality)

---

## Project Overview

Indexnine Task Flow is a productivity tool where users can create, manage, and track tasks. It supports multiple roles (Member, Admin, Super Admin) with role-based access control throughout the application.

The app includes:
- JWT-based authentication with token expiry
- Full task lifecycle management (create, read, update, delete)
- Filtering, sorting, and pagination on task lists
- Admin dashboard with user management and statistics
- Super Admin approval flow for admin registrations
- Forgot password / reset password flows
- Multi-language support (i18n)
- Responsive UI for both desktop and mobile

---

## Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| NestJS 11 | Backend framework (MVC pattern) |
| TypeORM | ORM for database interaction |
| PostgreSQL | Relational database |
| JWT + Passport | Authentication & authorization |
| bcrypt | Password hashing |
| Swagger | Auto-generated API documentation |
| Winston | Logging |
| Jest | Unit & E2E testing |
| SonarQube | Static code analysis |
| Helmet | HTTP security headers |
| Throttler | Rate limiting |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Zustand | Global state management |
| Axios | HTTP client |
| React Router v7 | Client-side routing |
| Tailwind CSS v4 | Utility-first styling |
| Shadcn UI | Component library |
| React Hook Form + Zod | Form handling & validation |
| i18next | Internationalization |
| Vitest | Unit testing |
| Storybook | Component documentation |
| SonarQube | Code quality monitoring |

---

## Project Structure

```
To Do Task/
├── backend/
│   └── nest-seed/
│       ├── src/
│       │   ├── constants/          # Enums, task constants
│       │   ├── controllers/        # Route controllers (auth, task, user, role)
│       │   ├── dto/                # Data Transfer Objects (pager, metadata, message)
│       │   ├── migration/          # TypeORM migrations & seed data
│       │   └── modules/
│       │       ├── auth/           # Authentication logic (JWT, login, register)
│       │       ├── database-audit/ # Audit trail module
│       │       ├── role/           # Role management
│       │       ├── task/           # Task CRUD, filters, pagination
│       │       └── user/           # User management
│       ├── config/                 # App configuration files
│       ├── .env.example            # Environment variable template
│       └── package.json
│
├── frontend/
│   └── react-seed-v2/
│       ├── src/
│       │   ├── __tests__/          # Unit tests (components, pages, utils)
│       │   ├── components/
│       │   │   ├── ui/             # Shadcn base components
│       │   │   ├── layouts/        # Layout wrappers
│       │   │   ├── header.tsx      # App header with nav
│       │   │   ├── protected-route.tsx  # Auth guard
│       │   │   ├── admin-route.tsx      # Admin-only guard
│       │   │   └── role-guard.tsx       # Role-based rendering
│       │   ├── features/
│       │   │   ├── admin/          # Admin dashboard, approval panel, user tasks
│       │   │   └── dashboard/      # Dashboard stats
│       │   ├── i18n/               # Translation config & locale files
│       │   ├── pages/
│       │   │   ├── auth/           # Sign in, sign up, forgot/reset password
│       │   │   ├── tasks/          # Task page, list, item, form, filters, pagination
│       │   │   ├── users/          # Add user page
│       │   │   ├── change-password.tsx
│       │   │   └── dashboard.tsx
│       │   ├── routes/             # Route definitions & constants
│       │   ├── stories/            # Storybook component stories
│       │   ├── utils/
│       │   │   ├── api.ts          # Axios instance with interceptors
│       │   │   ├── store.ts        # Zustand stores (auth, task, admin)
│       │   │   ├── types.ts        # TypeScript type definitions
│       │   │   ├── form.ts         # Zod schemas & form types
│       │   │   └── utils.ts        # Helper utilities
│       │   └── App.tsx             # Root component with routing
│       ├── index.html              # Entry HTML (site title: Indexnine Task Flow)
│       └── package.json
│
└── README.md                       # This file
```

---

## Features

### Authentication
- User registration (Member or Admin role)
- User login with JWT token (5-hour expiry)
- Auto-logout on token expiry or 401 response
- Forgot password → email code → verify → reset flow
- Change password for logged-in users

### Task Management
- Create tasks with title, description, status, priority, due date
- Edit and delete tasks (owner or admin only)
- Quick status toggle via checkbox (TODO ↔ COMPLETED)
- Bulk delete with multi-select checkboxes
- Filter tasks by status, priority, and search term
- Sort tasks by creation date (ASC/DESC)
- Paginated task list (5 tasks per page by default)

### Admin Dashboard
- View all users with total tasks count and status
- Stats overview: total users, total tasks, active members
- Expand any user row to see their tasks inline (with filters)
- Delete users (admins can delete members; super admins can delete anyone)
- Create new users directly from the admin panel

### Super Admin
- Approve or reject pending admin registration requests
- Full user management access

### UI/UX
- Responsive design — table view on desktop, card view on mobile
- Dark theme with gradient accents
- Toast notifications for all actions
- Loading spinners during API calls
- Multi-language support (i18n ready)

---

## User Roles

| Role | Permissions |
|------|------------|
| `MEMBER` | Create, edit, delete their own tasks |
| `ADMIN` | All member permissions + view all users + delete members + view any user's tasks |
| `SUPER_ADMIN` | All admin permissions + approve/reject admin requests + delete admins |

---

## API Reference

All API endpoints are prefixed with `/api/v1`.

### Authentication Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|---------|---------------|-------------|
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Login and receive JWT token |
| POST | `/auth/forgot-password` | No | Request password reset code |
| POST | `/auth/verify-reset-code` | No | Verify the reset code |
| POST | `/auth/reset-password` | No | Reset password using the code |
| POST | `/auth/change-password` | Yes | Change password (logged-in user) |

### Task Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|---------|---------------|-------------|
| GET | `/tasks` | Yes | Get paginated task list with filters |
| POST | `/tasks` | Yes | Create a new task |
| PATCH | `/tasks/:id` | Yes | Update a task |
| DELETE | `/tasks/:id` | Yes | Delete a task |
| GET | `/tasks/user/:userId` | Yes (Admin) | Get tasks for a specific user |

#### GET /tasks Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 5 | Items per page |
| `sortOrder` | string | ASC | Sort order (ASC/DESC) |
| `status` | string | — | Filter by status (TODO/IN_PROGRESS/COMPLETED) |
| `priority` | string | — | Filter by priority (LOW/MEDIUM/HIGH) |
| `search` | string | — | Search by title |

### User/Admin Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|---------|---------------|-------------|
| GET | `/users/list` | Yes (Admin) | Get all users with stats |
| GET | `/users/pending-admins` | Yes (Super Admin) | Get pending admin approvals |
| PATCH | `/users/:userId/status` | Yes (Super Admin) | Approve or reject admin |
| DELETE | `/users/:userId` | Yes (Admin) | Delete a user |

### Swagger Documentation

Once the backend is running, full interactive API docs are available at:
```
http://localhost:3000/api/docs
```

---

## Frontend Pages & Components

### Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/auth/sign-in` | `sign-in.tsx` | Login page |
| `/auth/sign-up` | `sign-up.tsx` | Registration page |
| `/auth/forgot-password` | `forgot-password.tsx` | Forgot password flow (3 steps) |
| `/auth/reset-password` | `reset-password.tsx` | Reset password with token |
| `/tasks` | `task-page.tsx` | Main task management page |
| `/change-password` | `change-password.tsx` | Change password for logged-in user |
| `/admin` | `AdminDashboard.tsx` | Admin user management |
| `/dashboard` | `dashboard.tsx` | Dashboard overview |

### Key Components

| Component | Location | Description |
|-----------|----------|-------------|
| `TaskPage` | `pages/tasks/task-page.tsx` | Orchestrates all task operations |
| `TaskList` | `pages/tasks/task-list.tsx` | Table (desktop) and cards (mobile) |
| `TaskItem` | `pages/tasks/task-item.tsx` | Single task row with actions |
| `TaskForm` | `pages/tasks/task-form.tsx` | Create/edit task dialog form |
| `TaskFiltersBar` | `pages/tasks/task-filters.tsx` | Filter controls |
| `Pagination` | `pages/tasks/pagination.tsx` | Page navigation |
| `AdminDashboard` | `features/admin/AdminDashboard.tsx` | Full admin panel |
| `AdminApprovalPanel` | `features/admin/AdminApprovalPanel.tsx` | Pending admin approvals |
| `CreateUserModal` | `features/admin/CreateUserModal.tsx` | Admin create user dialog |
| `UserTasksPanel` | `features/admin/UserTasksPanel.tsx` | Inline user task viewer |
| `ProtectedRoute` | `components/protected-route.tsx` | Redirects unauthenticated users |
| `AdminRoute` | `components/admin-route.tsx` | Restricts non-admin access |

---

## State Management

The app uses three Zustand stores in `src/utils/store.ts`:

### `useAuthStore`
Persisted to `localStorage` under key `auth-storage`.

| State | Type | Description |
|-------|------|-------------|
| `token` | string | JWT token |
| `user` | User | Logged-in user object |
| `expiresAt` | number | Token expiry timestamp |
| `isLoggedIn` | boolean | Login status |

Key actions: `setAuth()`, `logout()`, `checkExpiry()`

### `useTaskStore`
| State | Type | Description |
|-------|------|-------------|
| `tasks` | Task[] | Current page of tasks |
| `meta` | PaginationMeta | Pagination info |
| `filters` | TaskFilters | Active filters |
| `loading` | boolean | Loading state |

Key actions: `fetchTasks()`, `createTask()`, `updateTask()`, `deleteTask()`, `setFilters()`

Default filters: `{ page: 1, limit: 5, sortOrder: 'ASC', status: '', priority: '' }`

### `useAdminStore`
| State | Type | Description |
|-------|------|-------------|
| `users` | User[] | All users list |
| `pendingAdmins` | User[] | Pending admin approvals |
| `stats` | object | totalUsers, totalTasks, activeMembers |

Key actions: `fetchUsers()`, `fetchPendingAdmins()`, `updateUserStatus()`, `createUser()`, `deleteUser()`

### API Client (`src/utils/api.ts`)
- Axios instance with `baseURL` from `VITE_API_BASE_URL`
- **Request interceptor**: Automatically attaches `Authorization: Bearer <token>` header to every request
- **Response interceptor**: On 401 response, clears auth store and redirects to sign-in page

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **PostgreSQL** v14 or higher
- **Git**

---

### Backend Setup

```bash
# Navigate to backend
cd backend/nest-seed

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials (see Environment Variables section)

# Run database migrations
npm run migration:run

# (Optional) Seed initial data
npm run migration:seed-run

# Start in development mode
npm run start:local
```

Backend runs at: `http://localhost:3000`  
Swagger docs at: `http://localhost:3000/api/docs`

---

### Frontend Setup

```bash
# Navigate to frontend
cd frontend/react-seed-v2

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env — set the API base URL
# VITE_API_BASE_URL=http://localhost:3000/api/v1

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### Running Both Together

The root folder contains `start.ps1` and `stop.ps1` scripts for Windows:

```powershell
# Start both backend and frontend
./start.ps1

# Stop both
./stop.ps1
```

---

## Environment Variables

### Backend (`backend/nest-seed/.env`)

```env
APP_NAME='NestJS seed'
PORT=3000

# PostgreSQL credentials
DB_HOST='localhost'
DB_USERNAME='postgres'
DB_PASSWORD='your-db-password'
DB_DATABASE='nest_seed'

# Health check thresholds
HC_STORAGE_THRESHOLD=0.60
HC_STORAGE_PATH='C:\\'
HC_HEAP_MEM_THRESHOLD=100        # MB
HC_PROCESS_RAM_MEM_THRESHOLD=150 # MB
```

### Frontend (`frontend/react-seed-v2/.env`)

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

> **Note:** The Vite dev server proxies requests from `localhost:5173/api/v1` to the backend. The `VITE_API_BASE_URL` is what Axios uses as its base URL.

---

## Database & Migrations

The backend uses TypeORM with PostgreSQL.

```bash
# Run all pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Generate a new migration from entity changes
npm run migration:generate -- src/migration/changesets/MigrationName

# Run seed data
npm run migration:seed-run

# Revert seed data
npm run migration:seed-revert
```

---

## Testing

### Backend Tests

```bash
cd backend/nest-seed

# Run all unit tests
npm run test

# Run with coverage report
npm run test:cov

# Run in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

### Frontend Tests

```bash
cd frontend/react-seed-v2

# Run all tests (single run)
npm run test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Open Vitest UI
npm run test:ui
```

Test files are located in `src/__tests__/` covering:
- `components/` — UI component tests
- `pages/` — Page-level integration tests
- `utils/` — Store and utility function tests

---

## Code Quality

Both the frontend and backend are integrated with **SonarQube** for static analysis.

### Run SonarQube Analysis

```bash
# Backend
cd backend/nest-seed
npm run sonar

# Frontend
cd frontend/react-seed-v2
npm run sonar
```

For local SonarQube instance:
```bash
npm run sonar:local
```

### Linting & Formatting

```bash
# Backend
npm run lint          # Check for lint errors
npm run lint:fix      # Auto-fix lint errors
npm run format        # Prettier format

# Frontend
npm run lint          # ESLint check
npm run format        # Prettier format
```

### Storybook (Frontend Component Docs)

```bash
cd frontend/react-seed-v2

# Start Storybook dev server
npm run storybook

# Build static Storybook
npm run build-storybook
```

Storybook runs at: `http://localhost:6006`

---

## Acknowledgements

- Backend seed based on **NestJS Seed** framework
- Frontend seed based on **snap.MVP v2** (React + Vite + Tailwind + Shadcn)
