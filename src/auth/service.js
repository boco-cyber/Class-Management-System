import bcrypt from 'bcryptjs';
import {
  initAuthStorage,
  readUsers,
  writeUsers,
  readSessions,
  writeSessions,
  appendAudit,
  buildAuthIndexes
} from './db.js';

// Initialize auth storage on module load
initAuthStorage();

// Constants
const SALT_ROUNDS = 10;
const SESSION_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes
const SESSION_EXPIRY_REMEMBER_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// Helper: Generate random session token
function generateSessionToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Helper: Generate user ID
function generateUserId(users) {
  return users.length > 0 ? Math.max(...users.map(u => u.id || 0)) + 1 : 1;
}

// Helper: Generate session ID
function generateSessionId(sessions) {
  return sessions.length > 0 ? Math.max(...sessions.map(s => s.id || 0)) + 1 : 1;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(plainPassword) {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Check if setup is needed (no admin users exist)
 */
export function needsSetup() {
  const users = readUsers();
  return !users.some(u => u.role === 'admin' && u.isActive);
}

/**
 * Create initial admin account
 */
export async function setupInitialAdmin({ username, password, fullName, email }) {
  // Validation
  if (!username || username.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters' };
  }

  if (!password || password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters' };
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return {
      success: false,
      error: 'Password must contain uppercase, lowercase, and numbers'
    };
  }

  if (!fullName || fullName.trim().length === 0) {
    return { success: false, error: 'Full name is required' };
  }

  // Check if admin already exists
  if (!needsSetup()) {
    return { success: false, error: 'Admin account already exists' };
  }

  // Check if username is taken
  const users = readUsers();
  const { usersByUsername } = buildAuthIndexes(users, []);
  if (usersByUsername.has(username.toLowerCase())) {
    return { success: false, error: 'Username already taken' };
  }

  // Create admin user
  const passwordHash = await hashPassword(password);
  const now = new Date().toISOString();

  const newUser = {
    id: generateUserId(users),
    username: username.toLowerCase(),
    passwordHash,
    fullName: fullName.trim(),
    email: email?.trim() || null,
    role: 'admin',
    isActive: true,
    failedLoginAttempts: 0,
    lockedUntil: null,
    lastLogin: null,
    createdAt: now,
    updatedAt: now
  };

  users.push(newUser);
  writeUsers(users);

  // Log audit event
  appendAudit({
    timestamp: now,
    action: 'SETUP_ADMIN',
    userId: newUser.id,
    username: newUser.username,
    details: 'Initial admin account created',
    ipAddress: null
  });

  return { success: true, userId: newUser.id };
}

/**
 * Authenticate user and create session
 */
export async function login({ username, password, rememberMe = false }) {
  const users = readUsers();
  const sessions = readSessions();
  const { usersByUsername } = buildAuthIndexes(users, sessions);

  // Find user
  const user = usersByUsername.get(username.toLowerCase());

  if (!user || !user.isActive) {
    appendAudit({
      timestamp: new Date().toISOString(),
      action: 'LOGIN_FAILED',
      userId: null,
      username: username.toLowerCase(),
      details: 'User not found or inactive',
      ipAddress: null
    });
    return { success: false, error: 'Invalid username or password' };
  }

  // Check if account is locked
  if (user.lockedUntil) {
    const lockTime = new Date(user.lockedUntil);
    if (lockTime > new Date()) {
      const minutesLeft = Math.ceil((lockTime - new Date()) / 60000);
      return {
        success: false,
        error: `Account locked. Try again in ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}.`
      };
    } else {
      // Unlock account
      user.failedLoginAttempts = 0;
      user.lockedUntil = null;
    }
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, user.passwordHash);

  if (!isValidPassword) {
    // Increment failed attempts
    const attempts = (user.failedLoginAttempts || 0) + 1;

    if (attempts >= MAX_FAILED_ATTEMPTS) {
      // Lock account
      const lockUntil = new Date(Date.now() + LOCKOUT_DURATION_MS).toISOString();
      user.failedLoginAttempts = attempts;
      user.lockedUntil = lockUntil;
      writeUsers(users);

      appendAudit({
        timestamp: new Date().toISOString(),
        action: 'ACCOUNT_LOCKED',
        userId: user.id,
        username: user.username,
        details: `Account locked after ${attempts} failed attempts`,
        ipAddress: null
      });

      return {
        success: false,
        error: 'Too many failed attempts. Account locked for 15 minutes.'
      };
    }

    user.failedLoginAttempts = attempts;
    writeUsers(users);

    appendAudit({
      timestamp: new Date().toISOString(),
      action: 'LOGIN_FAILED',
      userId: user.id,
      username: user.username,
      details: `Invalid password (attempt ${attempts}/${MAX_FAILED_ATTEMPTS})`,
      ipAddress: null
    });

    return {
      success: false,
      error: `Invalid password. ${MAX_FAILED_ATTEMPTS - attempts} attempt${MAX_FAILED_ATTEMPTS - attempts > 1 ? 's' : ''} remaining.`
    };
  }

  // Reset failed attempts and update last login
  const now = new Date().toISOString();
  user.failedLoginAttempts = 0;
  user.lockedUntil = null;
  user.lastLogin = now;
  user.updatedAt = now;
  writeUsers(users);

  // Create session
  const expiryMs = rememberMe ? SESSION_EXPIRY_REMEMBER_MS : SESSION_EXPIRY_MS;
  const expiresAt = new Date(Date.now() + expiryMs).toISOString();
  const sessionToken = generateSessionToken();

  const newSession = {
    id: generateSessionId(sessions),
    userId: user.id,
    sessionToken,
    expiresAt,
    createdAt: now
  };

  sessions.push(newSession);
  writeSessions(sessions);

  // Log successful login
  appendAudit({
    timestamp: now,
    action: 'LOGIN_SUCCESS',
    userId: user.id,
    username: user.username,
    details: rememberMe ? 'Login with remember me' : 'Login',
    ipAddress: null
  });

  // Return user data without password hash
  const { passwordHash, failedLoginAttempts, lockedUntil, ...safeUser } = user;

  return {
    success: true,
    user: safeUser,
    sessionToken,
    expiresAt
  };
}

/**
 * Validate session and return user data
 */
export function validateSession(sessionToken) {
  if (!sessionToken) {
    return null;
  }

  const users = readUsers();
  const sessions = readSessions();
  const { sessionsByToken } = buildAuthIndexes(users, sessions);

  const session = sessionsByToken.get(sessionToken);

  if (!session) {
    return null;
  }

  // Check if session is expired
  const expiryTime = new Date(session.expiresAt);
  if (expiryTime < new Date()) {
    // Remove expired session
    const filteredSessions = sessions.filter(s => s.sessionToken !== sessionToken);
    writeSessions(filteredSessions);
    return null;
  }

  // Find user
  const user = users.find(u => u.id === session.userId);

  if (!user || !user.isActive) {
    return null;
  }

  // Return user data without password hash
  const { passwordHash, failedLoginAttempts, lockedUntil, ...safeUser } = user;

  return {
    user: safeUser,
    session: {
      sessionToken: session.sessionToken,
      expiresAt: session.expiresAt
    }
  };
}

/**
 * Logout user (remove session)
 */
export function logout(sessionToken) {
  if (!sessionToken) {
    return { success: false };
  }

  const sessions = readSessions();
  const session = sessions.find(s => s.sessionToken === sessionToken);

  if (session) {
    const users = readUsers();
    const user = users.find(u => u.id === session.userId);

    // Log logout
    appendAudit({
      timestamp: new Date().toISOString(),
      action: 'LOGOUT',
      userId: session.userId,
      username: user?.username || 'unknown',
      details: 'User logged out',
      ipAddress: null
    });

    // Remove session
    const filteredSessions = sessions.filter(s => s.sessionToken !== sessionToken);
    writeSessions(filteredSessions);
  }

  return { success: true };
}

/**
 * Clean up expired sessions
 */
export function cleanupExpiredSessions() {
  const sessions = readSessions();
  const now = new Date();
  const activeSessions = sessions.filter(s => new Date(s.expiresAt) > now);

  if (activeSessions.length !== sessions.length) {
    writeSessions(activeSessions);
    return sessions.length - activeSessions.length; // Return count of removed sessions
  }

  return 0;
}

/**
 * Get all users (admin only)
 */
export function getAllUsers() {
  const users = readUsers();
  return users.map(({ passwordHash, ...user }) => user);
}

/**
 * Create new user (admin only)
 */
export async function createUser({ username, password, fullName, email, role }, createdByUserId) {
  // Validation
  if (!username || username.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters' };
  }

  if (!password || password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters' };
  }

  if (!['admin', 'servant', 'viewer'].includes(role)) {
    return { success: false, error: 'Invalid role' };
  }

  const users = readUsers();
  const { usersByUsername } = buildAuthIndexes(users, []);

  if (usersByUsername.has(username.toLowerCase())) {
    return { success: false, error: 'Username already taken' };
  }

  const passwordHash = await hashPassword(password);
  const now = new Date().toISOString();

  const newUser = {
    id: generateUserId(users),
    username: username.toLowerCase(),
    passwordHash,
    fullName: fullName.trim(),
    email: email?.trim() || null,
    role,
    isActive: true,
    failedLoginAttempts: 0,
    lockedUntil: null,
    lastLogin: null,
    createdAt: now,
    updatedAt: now
  };

  users.push(newUser);
  writeUsers(users);

  const createdByUser = users.find(u => u.id === createdByUserId);
  appendAudit({
    timestamp: now,
    action: 'USER_CREATED',
    userId: createdByUserId,
    username: createdByUser?.username || 'unknown',
    details: `Created user: ${newUser.username} (${newUser.role})`,
    ipAddress: null
  });

  const { passwordHash: _, ...safeUser } = newUser;
  return { success: true, user: safeUser };
}

/**
 * Update user (admin only)
 */
export function updateUser(userId, updates, updatedByUserId) {
  const users = readUsers();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return { success: false, error: 'User not found' };
  }

  const user = users[userIndex];
  const now = new Date().toISOString();

  // Update allowed fields
  if (updates.fullName !== undefined) user.fullName = updates.fullName.trim();
  if (updates.email !== undefined) user.email = updates.email?.trim() || null;
  if (updates.role !== undefined && ['admin', 'servant', 'viewer'].includes(updates.role)) {
    user.role = updates.role;
  }
  if (updates.isActive !== undefined) user.isActive = !!updates.isActive;

  user.updatedAt = now;
  writeUsers(users);

  const updatedByUser = users.find(u => u.id === updatedByUserId);
  appendAudit({
    timestamp: now,
    action: 'USER_UPDATED',
    userId: updatedByUserId,
    username: updatedByUser?.username || 'unknown',
    details: `Updated user: ${user.username}`,
    ipAddress: null
  });

  const { passwordHash, ...safeUser } = user;
  return { success: true, user: safeUser };
}

/**
 * Reset user password (admin only or self)
 */
export async function resetPassword(userId, newPassword, resetByUserId) {
  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters' };
  }

  const users = readUsers();
  const user = users.find(u => u.id === userId);

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  const passwordHash = await hashPassword(newPassword);
  const now = new Date().toISOString();

  user.passwordHash = passwordHash;
  user.failedLoginAttempts = 0;
  user.lockedUntil = null;
  user.updatedAt = now;
  writeUsers(users);

  // Invalidate all sessions for this user
  const sessions = readSessions();
  const filteredSessions = sessions.filter(s => s.userId !== userId);
  writeSessions(filteredSessions);

  const resetByUser = users.find(u => u.id === resetByUserId);
  appendAudit({
    timestamp: now,
    action: 'PASSWORD_RESET',
    userId: resetByUserId,
    username: resetByUser?.username || 'unknown',
    details: `Reset password for user: ${user.username}`,
    ipAddress: null
  });

  return { success: true };
}

/**
 * Unlock user account (admin only)
 */
export function unlockAccount(userId, unlockedByUserId) {
  const users = readUsers();
  const user = users.find(u => u.id === userId);

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  const now = new Date().toISOString();
  user.failedLoginAttempts = 0;
  user.lockedUntil = null;
  user.updatedAt = now;
  writeUsers(users);

  const unlockedByUser = users.find(u => u.id === unlockedByUserId);
  appendAudit({
    timestamp: now,
    action: 'ACCOUNT_UNLOCKED',
    userId: unlockedByUserId,
    username: unlockedByUser?.username || 'unknown',
    details: `Unlocked account: ${user.username}`,
    ipAddress: null
  });

  return { success: true };
}

// Auto-cleanup expired sessions on module load and periodically
cleanupExpiredSessions();
setInterval(cleanupExpiredSessions, 60 * 60 * 1000); // Every hour
