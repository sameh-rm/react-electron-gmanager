import type { Permission } from '@prisma/client';
import { IPrismaService } from './IPrismaService';

export interface IPermissionService<Permission>
  extends IPrismaService<Permission> {}

export type PermissionPayload = Omit<
  Permission,
  'createdAt' | 'updatedAt' | 'id'
>;
