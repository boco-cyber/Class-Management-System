/**
 * Role-Based Access Control (RBAC) Permissions
 * Defines what each role can and cannot do in the application
 */

export const PERMISSIONS = {
  admin: {
    canViewDashboard: true,
    canManageStudents: true,
    canMarkAttendance: true,
    canManageCourses: true,
    canScheduleServices: true,
    canManageVisitations: true,
    canViewReports: true,
    canExportData: true,
    canImportData: true,
    canManageUsers: true,
    canChangeSettings: true,
    canDeleteRecords: true,
    canViewAuditLog: true
  },
  servant: {
    canViewDashboard: true,
    canManageStudents: true,
    canMarkAttendance: true,
    canManageCourses: true,
    canScheduleServices: true,
    canManageVisitations: true,
    canViewReports: true,
    canExportData: true,
    canImportData: true,
    canManageUsers: false,
    canChangeSettings: false,
    canDeleteRecords: false,
    canViewAuditLog: false
  },
  viewer: {
    canViewDashboard: true,
    canManageStudents: false,
    canMarkAttendance: false,
    canManageCourses: false,
    canScheduleServices: false,
    canManageVisitations: false,
    canViewReports: true,
    canExportData: false,
    canImportData: false,
    canManageUsers: false,
    canChangeSettings: false,
    canDeleteRecords: false,
    canViewAuditLog: false
  }
};

/**
 * Check if a user role has a specific permission
 * @param {string} role - User role (admin, servant, viewer)
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export function hasPermission(role, permission) {
  if (!role || !PERMISSIONS[role]) {
    return false;
  }
  return PERMISSIONS[role][permission] === true;
}

/**
 * Get all permissions for a role
 * @param {string} role - User role
 * @returns {object}
 */
export function getRolePermissions(role) {
  return PERMISSIONS[role] || {};
}

/**
 * Check if role can perform any write operations
 * @param {string} role - User role
 * @returns {boolean}
 */
export function canWrite(role) {
  return hasPermission(role, 'canManageStudents') ||
         hasPermission(role, 'canMarkAttendance') ||
         hasPermission(role, 'canManageCourses');
}

/**
 * Check if role is admin
 * @param {string} role - User role
 * @returns {boolean}
 */
export function isAdmin(role) {
  return role === 'admin';
}

/**
 * Get role display name
 * @param {string} role - User role
 * @returns {string}
 */
export function getRoleDisplayName(role) {
  const roleNames = {
    admin: 'Administrator',
    servant: 'Servant',
    viewer: 'Viewer'
  };
  return roleNames[role] || role;
}

/**
 * Get role description
 * @param {string} role - User role
 * @returns {string}
 */
export function getRoleDescription(role) {
  const descriptions = {
    admin: 'Full access to all features including user management and settings',
    servant: 'Can view and edit data but cannot delete records or manage users',
    viewer: 'Read-only access to dashboard and reports'
  };
  return descriptions[role] || '';
}
