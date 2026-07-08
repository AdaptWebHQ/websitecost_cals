import type { UserRole } from '@/types';

export const PERMISSIONS = {
  accessPublicDashboard: ['public', 'admin', 'super_admin'] as UserRole[],
  accessAdminDashboard: ['admin', 'super_admin'] as UserRole[],
  manageUsers: ['super_admin'] as UserRole[],
  managePricing: ['admin', 'super_admin'] as UserRole[],
  deleteData: ['super_admin'] as UserRole[],
} as const;

/** Check if a user role has a specific permission */
export function hasPermission(
  role: UserRole,
  permission: keyof typeof PERMISSIONS
): boolean {
  return PERMISSIONS[permission].includes(role);
}

/** Check if role has administrative access */
export function isAdmin(role: UserRole): boolean {
  return role === 'admin' || role === 'super_admin';
}

/** Check if role is super admin */
export function isSuperAdmin(role: UserRole): boolean {
  return role === 'super_admin';
}
