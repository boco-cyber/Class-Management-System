# LOGIN SYSTEM - QUICK IMPLEMENTATION GUIDE

## Overview
This guide provides step-by-step instructions for implementing secure authentication in the Youth Ministry desktop application.

---

## 1. DATABASE SETUP

### Create Authentication Tables
```sql
-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  passwordHash TEXT NOT NULL,
  fullName TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'servant' CHECK(role IN ('admin', 'servant', 'viewer')),
  isActive BOOLEAN DEFAULT 1,
  failedLoginAttempts INTEGER DEFAULT 0,
  lockedUntil TEXT,
  lastLogin TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE userSessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  sessionToken TEXT NOT NULL UNIQUE,
  expiresAt TEXT NOT NULL,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_sessions_token ON userSessions(sessionToken);
CREATE INDEX idx_sessions_expiry ON userSessions(expiresAt);
```

---

## 2. PASSWORD HASHING

### Implementation (Node.js with bcrypt)
```javascript
const bcrypt = require('bcryptjs');

// Hash password (when creating/updating user)
async function hashPassword(plainPassword) {
  const saltRounds = 10;
  return await bcrypt.hash(plainPassword, saltRounds);
}

// Verify password (when logging in)
async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// Example usage
const passwordHash = await hashPassword('MyPassword123');
const isValid = await verifyPassword('MyPassword123', passwordHash); // true
```

### Implementation (.NET with BCrypt)
```csharp
using BCrypt.Net;

// Hash password
string HashPassword(string plainPassword)
{
    return BCrypt.HashPassword(plainPassword);
}

// Verify password
bool VerifyPassword(string plainPassword, string hashedPassword)
{
    return BCrypt.Verify(plainPassword, hashedPassword);
}
```

---

## 3. SESSION MANAGEMENT

### Create Session Token
```javascript
const crypto = require('crypto');

function createSession(userId, rememberMe = false) {
  // Generate secure random token
  const sessionToken = crypto.randomBytes(32).toString('hex');
  
  // Set expiration (30 min normal, 7 days if "remember me")
  const expirationMs = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000;
  const expiresAt = new Date(Date.now() + expirationMs).toISOString();
  
  // Store in database
  db.prepare(`
    INSERT INTO userSessions (userId, sessionToken, expiresAt)
    VALUES (?, ?, ?)
  `).run(userId, sessionToken, expiresAt);
  
  return { sessionToken, expiresAt };
}
```

### Validate Session
```javascript
function validateSession(sessionToken) {
  const session = db.prepare(`
    SELECT s.*, u.id, u.username, u.fullName, u.role, u.isActive
    FROM userSessions s
    JOIN users u ON s.userId = u.id
    WHERE s.sessionToken = ? AND s.expiresAt > datetime('now')
  `).get(sessionToken);
  
  if (!session) return null;
  if (!session.isActive) return null;
  
  return {
    userId: session.userId,
    username: session.username,
    fullName: session.fullName,
    role: session.role
  };
}
```

### Cleanup Expired Sessions
```javascript
function cleanupExpiredSessions() {
  db.prepare(`
    DELETE FROM userSessions 
    WHERE expiresAt < datetime('now')
  `).run();
}

// Run cleanup every hour
setInterval(cleanupExpiredSessions, 60 * 60 * 1000);
```

---

## 4. LOGIN FLOW

### Complete Login Function
```javascript
async function login(username, password) {
  // 1. Get user from database
  const user = db.prepare(`
    SELECT * FROM users 
    WHERE username = ? AND isActive = 1
  `).get(username);
  
  if (!user) {
    return { success: false, error: 'Invalid username or password' };
  }
  
  // 2. Check if account is locked
  if (user.lockedUntil) {
    const lockTime = new Date(user.lockedUntil);
    if (lockTime > new Date()) {
      const minutesLeft = Math.ceil((lockTime - new Date()) / 60000);
      return { 
        success: false, 
        error: `Account locked. Try again in ${minutesLeft} minutes.` 
      };
    } else {
      // Unlock account
      db.prepare(`
        UPDATE users 
        SET failedLoginAttempts = 0, lockedUntil = NULL 
        WHERE id = ?
      `).run(user.id);
    }
  }
  
  // 3. Verify password
  const isValidPassword = await verifyPassword(password, user.passwordHash);
  
  if (!isValidPassword) {
    // Increment failed attempts
    const attempts = (user.failedLoginAttempts || 0) + 1;
    const maxAttempts = 5;
    
    if (attempts >= maxAttempts) {
      // Lock account for 15 minutes
      const lockUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      db.prepare(`
        UPDATE users 
        SET failedLoginAttempts = ?, lockedUntil = ? 
        WHERE id = ?
      `).run(attempts, lockUntil, user.id);
      
      return { 
        success: false, 
        error: 'Too many failed attempts. Account locked for 15 minutes.' 
      };
    }
    
    db.prepare(`
      UPDATE users 
      SET failedLoginAttempts = ? 
      WHERE id = ?
    `).run(attempts, user.id);
    
    return { 
      success: false, 
      error: `Invalid password. ${maxAttempts - attempts} attempts remaining.` 
    };
  }
  
  // 4. Reset failed attempts and update last login
  db.prepare(`
    UPDATE users 
    SET failedLoginAttempts = 0, 
        lockedUntil = NULL, 
        lastLogin = datetime('now') 
    WHERE id = ?
  `).run(user.id);
  
  // 5. Create session
  const session = createSession(user.id);
  
  // 6. Return user data (without password hash)
  return {
    success: true,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    },
    sessionToken: session.sessionToken
  };
}
```

---

## 5. FIRST-TIME SETUP WIZARD

### Check if Setup Needed
```javascript
function needsSetup() {
  const adminCount = db.prepare(`
    SELECT COUNT(*) as count 
    FROM users 
    WHERE role = 'admin'
  `).get();
  
  return adminCount.count === 0;
}
```

### Create Initial Admin
```javascript
async function setupInitialAdmin(username, password, fullName, email) {
  // Validate password strength
  if (password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters' };
  }
  
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return { 
      success: false, 
      error: 'Password must contain uppercase, lowercase, and numbers' 
    };
  }
  
  // Check if username already exists
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) {
    return { success: false, error: 'Username already taken' };
  }
  
  // Create admin user
  const passwordHash = await hashPassword(password);
  const result = db.prepare(`
    INSERT INTO users (username, passwordHash, fullName, email, role)
    VALUES (?, ?, ?, ?, 'admin')
  `).run(username, passwordHash, fullName, email);
  
  return { 
    success: true, 
    userId: result.lastInsertRowid 
  };
}
```

---

## 6. ROLE-BASED ACCESS CONTROL

### Permission Definitions
```javascript
const PERMISSIONS = {
  admin: {
    canViewDashboard: true,
    canManageStudents: true,
    canMarkAttendance: true,
    canManageCourses: true,
    canScheduleServices: true,
    canManageVisitations: true,
    canViewReports: true,
    canExportData: true,
    canManageUsers: true,
    canChangeSettings: true,
    canDeleteRecords: true
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
    canManageUsers: false,
    canChangeSettings: false,
    canDeleteRecords: false
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
    canManageUsers: false,
    canChangeSettings: false,
    canDeleteRecords: false
  }
};
```

### Check Permission
```javascript
function hasPermission(userRole, permission) {
  return PERMISSIONS[userRole]?.[permission] || false;
}

// Usage example
if (hasPermission(currentUser.role, 'canDeleteRecords')) {
  // Show delete button
}
```

### React Component Protection
```javascript
function RequirePermission({ permission, children, fallback = null }) {
  const { user } = useAuth();
  
  if (!hasPermission(user.role, permission)) {
    return fallback;
  }
  
  return children;
}

// Usage in components
<RequirePermission permission="canManageUsers">
  <button onClick={openUserManagement}>User Management</button>
</RequirePermission>
```

---

## 7. LOGIN SCREEN UI (React)

### Login Component
```jsx
import React, { useState } from 'react';
import { authService } from '../services/auth';

function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authService.login(username, password, rememberMe);
      
      if (result.success) {
        onLoginSuccess(result.user, result.sessionToken);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">✝</div>
          <h1>Youth Ministry System</h1>
          <p className="subtitle">HS 2025-2026</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              Remember me
            </label>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <a href="#" className="forgot-password">Forgot password?</a>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
```

---

## 8. AUTO-LOGOUT ON INACTIVITY

### Activity Tracker
```javascript
class ActivityTracker {
  constructor(timeoutMinutes = 30, onTimeout) {
    this.timeout = timeoutMinutes * 60 * 1000;
    this.onTimeout = onTimeout;
    this.timerId = null;
    this.events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    this.resetTimer = this.resetTimer.bind(this);
    this.start();
  }
  
  start() {
    this.events.forEach(event => {
      document.addEventListener(event, this.resetTimer, true);
    });
    this.resetTimer();
  }
  
  resetTimer() {
    clearTimeout(this.timerId);
    this.timerId = setTimeout(() => {
      this.onTimeout();
    }, this.timeout);
  }
  
  stop() {
    clearTimeout(this.timerId);
    this.events.forEach(event => {
      document.removeEventListener(event, this.resetTimer, true);
    });
  }
}

// Usage
const tracker = new ActivityTracker(30, () => {
  alert('Session expired due to inactivity');
  logout();
});
```

---

## 9. USER MANAGEMENT (Admin Only)

### User Management UI Features
- List all users with their roles
- Add new user (username, password, role)
- Edit user (change name, email, role)
- Deactivate user (soft delete)
- Reset user password (admin only)
- View last login time
- View account status (active/locked)

---

## 10. SECURITY BEST PRACTICES CHECKLIST

- ✅ Never store passwords in plain text
- ✅ Use strong password hashing (bcrypt with salt)
- ✅ Implement account lockout after failed attempts
- ✅ Use secure random tokens for sessions
- ✅ Set reasonable session expiration times
- ✅ Clear sessions on logout
- ✅ Validate all user inputs
- ✅ Implement RBAC (role-based access control)
- ✅ Log security events (failed logins, password changes)
- ✅ Auto-logout on inactivity
- ✅ Use HTTPS for any network communication (future)
- ✅ Encrypt database file (optional but recommended)
- ✅ Regular security audits
- ✅ Keep dependencies updated

---

## IMPLEMENTATION CHECKLIST

**Phase 1: Database**
- [ ] Create users table
- [ ] Create userSessions table
- [ ] Add indexes
- [ ] Test database operations

**Phase 2: Authentication Service**
- [ ] Implement password hashing
- [ ] Implement session management
- [ ] Implement login function
- [ ] Implement logout function
- [ ] Test authentication flow

**Phase 3: UI Components**
- [ ] Create LoginScreen component
- [ ] Create SetupWizard component
- [ ] Create RequireAuth wrapper
- [ ] Add role-based component visibility

**Phase 4: Integration**
- [ ] Add authentication check to App.tsx
- [ ] Protect all routes with RequireAuth
- [ ] Add logout button to sidebar
- [ ] Show current user in header

**Phase 5: User Management**
- [ ] Create UserManagement screen (admin only)
- [ ] Implement add/edit/deactivate user
- [ ] Implement password reset
- [ ] Test role permissions

**Phase 6: Security Enhancements**
- [ ] Add activity tracker for auto-logout
- [ ] Add account lockout logic
- [ ] Add password strength validation
- [ ] Add security event logging
- [ ] Test security measures

---

**This guide provides everything needed to implement secure authentication for the Youth Ministry desktop application.**
