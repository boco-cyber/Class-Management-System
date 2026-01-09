import { useAuth } from './AuthContext.jsx';

/**
 * Component that conditionally renders children based on user permissions
 * @param {string} permission - The permission to check
 * @param {React.ReactNode} children - Content to render if permission is granted
 * @param {React.ReactNode} fallback - Optional content to render if permission is denied
 */
export default function RequirePermission({ permission, children, fallback = null }) {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return fallback;
  }

  return children;
}

/**
 * Component that renders children only for admin users
 */
export function AdminOnly({ children, fallback = null }) {
  const { isAdmin } = useAuth();

  if (!isAdmin()) {
    return fallback;
  }

  return children;
}

/**
 * Component that shows read-only banner for users without write permission
 */
export function ReadOnlyBanner({ permission = 'canManageStudents' }) {
  const { hasPermission } = useAuth();

  if (hasPermission(permission)) {
    return null;
  }

  return (
    <div className="read-only-banner">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>You have read-only access to this page</span>
    </div>
  );
}
