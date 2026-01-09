import React, { createContext, useContext, useState, useEffect } from 'react';
import { validateSession, logout as logoutService } from './service.js';
import { hasPermission } from './permissions.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem('yms_session_token');

      if (token) {
        const sessionData = validateSession(token);

        if (sessionData) {
          setCurrentUser(sessionData.user);
          setSessionToken(token);
        } else {
          // Invalid or expired session
          localStorage.removeItem('yms_session_token');
        }
      }

      setLoading(false);
      setInitialized(true);
    };

    checkSession();
  }, []);

  const login = (user, token) => {
    setCurrentUser(user);
    setSessionToken(token);
    localStorage.setItem('yms_session_token', token);
  };

  const logout = () => {
    if (sessionToken) {
      logoutService(sessionToken);
    }
    setCurrentUser(null);
    setSessionToken(null);
    localStorage.removeItem('yms_session_token');
  };

  const hasUserPermission = (permission) => {
    if (!currentUser) return false;
    return hasPermission(currentUser.role, permission);
  };

  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  const value = {
    currentUser,
    sessionToken,
    loading,
    initialized,
    login,
    logout,
    hasPermission: hasUserPermission,
    isAdmin,
    isAuthenticated: !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for checking permissions
export function usePermission(permission) {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
}

// Hook for checking if user is admin
export function useIsAdmin() {
  const { isAdmin } = useAuth();
  return isAdmin();
}
