import { useEffect, useRef } from 'react';
import { useAuth } from './AuthContext.jsx';

/**
 * ActivityTracker component - Monitors user activity and logs out after inactivity
 * @param {number} timeoutMinutes - Minutes of inactivity before auto-logout (default: 30)
 * @param {function} onTimeout - Optional callback when timeout occurs
 */
export default function ActivityTracker({ timeoutMinutes = 30, onTimeout }) {
  const { logout, isAuthenticated } = useAuth();
  const timerIdRef = useRef(null);
  const timeoutRef = useRef(timeoutMinutes * 60 * 1000); // Convert to milliseconds

  useEffect(() => {
    if (!isAuthenticated) {
      return; // Don't track if not logged in
    }

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];

    const handleTimeout = () => {
      console.log('Auto-logout due to inactivity');

      // Call optional callback
      if (onTimeout) {
        onTimeout();
      }

      // Logout user
      logout();

      // Show alert after logout
      alert('You have been logged out due to inactivity.');
    };

    const resetTimer = () => {
      // Clear existing timer
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }

      // Set new timer
      timerIdRef.current = setTimeout(handleTimeout, timeoutRef.current);
    };

    // Start tracking
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    // Initialize timer
    resetTimer();

    // Cleanup on unmount
    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
    };
  }, [isAuthenticated, logout, onTimeout]);

  return null; // This component doesn't render anything
}
