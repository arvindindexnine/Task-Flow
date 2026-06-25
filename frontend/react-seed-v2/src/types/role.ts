/**
 * Canonical role definitions — must mirror backend UserRole enum exactly.
 * Backend: enum UserRole { SUPER_ADMIN = 'SUPER_ADMIN', ADMIN = 'ADMIN', MEMBER = 'MEMBER' }
 */
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MEMBER';

/** Ordered list of all roles for iteration / validation */
export const ALL_ROLES: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'MEMBER'];

/** Role capability map — single source of truth for permission checks */
export const ROLE_PERMISSIONS = {
    SUPER_ADMIN: {
        canViewAllUsers: true,
        canModifyUsers: true,
        canChangeRoles: true,
        canDisableUsers: true,
        canAccessAdminDashboard: true,
        canDeleteAnyTask: true,
        canViewAllTasks: true,
        canApproveAdmins: true,
    },
    ADMIN: {
        canViewAllUsers: true,
        canModifyUsers: true,
        canChangeRoles: true,
        canDisableUsers: true,
        canAccessAdminDashboard: true,
        canDeleteAnyTask: true,
        canViewAllTasks: true,
        canApproveAdmins: false,
    },
    MEMBER: {
        canViewAllUsers: false,
        canModifyUsers: false,
        canChangeRoles: false,
        canDisableUsers: false,
        canAccessAdminDashboard: false,
        canDeleteAnyTask: false,
        canViewAllTasks: false,
        canApproveAdmins: false,
    },
} as const satisfies Record<UserRole, Record<string, boolean>>;

export type Permission = keyof (typeof ROLE_PERMISSIONS)['SUPER_ADMIN'];

/** Returns true if the given role has the specified permission */
export const hasPermission = (role: UserRole | undefined, permission: Permission): boolean => {
    if (!role) return false;
    return ROLE_PERMISSIONS[role][permission];
};
