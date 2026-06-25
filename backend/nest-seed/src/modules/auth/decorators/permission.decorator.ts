import { SetMetadata } from '@nestjs/common';

export type Resource = 'user' | 'role' | 'task' | 'admin-approval' | '*';

export interface IPermission {
  resource: Resource;
  action: string;
  scope?: string;
}

export const Permissions = (...permissions: IPermission[]): any => SetMetadata('permissions', permissions);
