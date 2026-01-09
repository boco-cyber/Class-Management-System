/**
 * Migration utility for converting SHA-256 passwords to bcryptjs
 * This should be run once when upgrading from the old auth system
 */

import { readUsers, writeUsers } from './db.js';
import { hashPassword } from './service.js';

/**
 * Check if a user has been migrated to bcryptjs
 */
export function isUserMigrated(user) {
  // bcryptjs hashes start with $2a$, $2b$, or $2y$ and are 60 chars long
  return user.passwordHash && user.passwordHash.startsWith('$2') && user.passwordHash.length === 60;
}

/**
 * Migrate a single user's password from SHA-256 to bcryptjs
 * This creates a temporary password that the user must change on first login
 */
export async function migrateUser(user, temporaryPassword = 'TempPass123') {
  if (isUserMigrated(user)) {
    console.log(`User ${user.username} already migrated`);
    return { success: true, alreadyMigrated: true };
  }

  // Hash the temporary password with bcryptjs
  const newPasswordHash = await hashPassword(temporaryPassword);

  user.passwordHash = newPasswordHash;
  user.requirePasswordChange = true; // Flag to force password change
  user.updatedAt = new Date().toISOString();

  console.log(`Migrated user ${user.username} - temporary password set`);

  return { success: true, temporaryPassword, requirePasswordChange: true };
}

/**
 * Migrate all users from SHA-256 to bcryptjs
 * WARNING: This will reset all passwords to temporary passwords
 */
export async function migrateAllUsers(temporaryPassword = 'TempPass123') {
  const users = readUsers();

  if (users.length === 0) {
    return { success: true, message: 'No users to migrate' };
  }

  let migratedCount = 0;
  let alreadyMigratedCount = 0;

  for (const user of users) {
    const result = await migrateUser(user, temporaryPassword);
    if (result.alreadyMigrated) {
      alreadyMigratedCount++;
    } else if (result.success) {
      migratedCount++;
    }
  }

  writeUsers(users);

  return {
    success: true,
    migratedCount,
    alreadyMigratedCount,
    totalUsers: users.length,
    temporaryPassword
  };
}

/**
 * Check if migration is needed
 */
export function needsMigration() {
  const users = readUsers();
  return users.some(user => !isUserMigrated(user));
}

/**
 * Get migration status
 */
export function getMigrationStatus() {
  const users = readUsers();
  const total = users.length;
  const migrated = users.filter(isUserMigrated).length;
  const needsMigration = total - migrated;

  return {
    total,
    migrated,
    needsMigration,
    isComplete: needsMigration === 0
  };
}
