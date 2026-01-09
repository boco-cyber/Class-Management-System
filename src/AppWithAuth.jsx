import React, { useEffect, useState } from 'react';
import { useAuth } from './auth/AuthContext.jsx';
import { needsSetup } from './auth/service.js';
import { needsMigration, migrateAllUsers } from './auth/migration.js';
import SetupWizard from './auth/SetupWizard.jsx';
import LoginScreen from './auth/LoginScreen.jsx';
import ActivityTracker from './auth/ActivityTracker.jsx';

/**
 * AppWithAuth - Wrapper component that handles authentication flow
 * Shows Setup/Login screens when needed, otherwise renders the main app
 */
export default function AppWithAuth({ children }) {
  const { currentUser, login, loading, initialized } = useAuth();
  const [migrationNeeded, setMigrationNeeded] = useState(false);
  const [migrationInProgress, setMigrationInProgress] = useState(false);
  const [setupNeeded, setSetupNeeded] = useState(false);

  // Check if setup or migration is needed
  useEffect(() => {
    if (!initialized) return;

    // Check if we need to run password migration
    if (needsMigration()) {
      setMigrationNeeded(true);
      setMigrationInProgress(true);

      // Auto-migrate with default temporary password
      // In production, you might want to show a UI for this
      migrateAllUsers('ChangeMe123!')
        .then(result => {
          console.log('Migration complete:', result);
          alert(
            `Password migration complete!\n\n` +
            `${result.migratedCount} user(s) migrated.\n` +
            `Temporary password: ${result.temporaryPassword}\n\n` +
            `Please login with this password and change it immediately.`
          );
          setMigrationInProgress(false);
          setMigrationNeeded(false);
        })
        .catch(err => {
          console.error('Migration failed:', err);
          alert('Password migration failed. Please contact support.');
          setMigrationInProgress(false);
        });
    }

    // Check if initial setup is needed
    setSetupNeeded(needsSetup());
  }, [initialized]);

  // Show loading state
  if (loading || !initialized || migrationInProgress) {
    return (
      <div className="auth-shell">
        <div className="auth-loading">
          <div className="spinner"></div>
          <p>{migrationInProgress ? 'Migrating passwords...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  // Show setup wizard if no admin exists
  if (setupNeeded && !currentUser) {
    return (
      <SetupWizard
        onSetupComplete={() => {
          setSetupNeeded(false);
          // After setup, they still need to login
        }}
      />
    );
  }

  // Show login screen if not authenticated
  if (!currentUser) {
    return <LoginScreen onLoginSuccess={login} />;
  }

  // User is authenticated - render the main app with activity tracking
  return (
    <>
      <ActivityTracker timeoutMinutes={30} />
      {children}
    </>
  );
}
