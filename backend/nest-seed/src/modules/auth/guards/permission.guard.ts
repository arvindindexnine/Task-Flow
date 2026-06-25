import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { logger } from '@snap/core';
import { IPermission } from '../decorators';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const skipAuth = this.reflector.get<boolean>('skipAuth', context.getHandler());
    if (skipAuth) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      logger.debug('[PermissionGuard] No user found in request');
      return false;
    }

    const { email, roles: userRoles, role: userRole } = user;
    let roles: string[] = [];
    if (Array.isArray(userRoles)) {
      roles = userRoles;
    } else if (userRole) {
      roles = [userRole];
    }
    logger.debug(`[PermissionGuard] User: ${email}, Roles identified: ${JSON.stringify(roles)}`);

    // SUPER_ADMIN bypass - check this BEFORE requiring decorator permissions
    if (roles.includes('SUPER_ADMIN')) {
      logger.debug('[PermissionGuard] SUPER_ADMIN bypass granted');
      return true;
    }

    const permissions = this.reflector.get<IPermission[]>('permissions', context.getHandler());
    if (!permissions) {
      logger.debug(`[PermissionGuard] No permissions decorator found for ${context.getHandler().name}`);
      return false;
    }

    logger.debug(`[PermissionGuard] Required Permissions: ${JSON.stringify(permissions)}`);

    try {
      const hasPermission = this.roleHasPermission(roles, permissions);
      logger.debug(`[PermissionGuard] Has Permission Result: ${hasPermission}`);
      return hasPermission;
    } catch (error) {
      logger.error(`[PermissionGuard] Error during authorization:`, error);
      return false;
    }
  }

  roleHasPermission(UserRoles: string[], permissions: IPermission[]): boolean {
    const rbac = this.config.get('roleBasedAccess', []);

    return permissions.some((permission) => {
      const { resource, action } = permission;
      return UserRoles.some((role) => {
        const rolePermissions = rbac.find((r) => r.role === role);
        if (!rolePermissions) {
          return false;
        }
        return rolePermissions.permissions.some((p) => (p.resource === resource || p.resource === '*') && (p.action === action || p.action === '*'));
      });
    });
  }
}
