const USERS_KEY = 'yms_auth_users';
const SESSIONS_KEY = 'yms_auth_sessions';
const AUDIT_KEY = 'yms_auth_audit';
const SCHEMA_VERSION_KEY = 'yms_auth_schema_version';
const SCHEMA_VERSION = 1;

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error(`Auth storage read failed for ${key}:`, error);
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Auth storage write failed for ${key}:`, error);
  }
}

export function initAuthStorage() {
  const version = readJson(SCHEMA_VERSION_KEY, 0);
  if (version !== SCHEMA_VERSION) {
    writeJson(USERS_KEY, []);
    writeJson(SESSIONS_KEY, []);
    writeJson(AUDIT_KEY, []);
    writeJson(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
    return;
  }

  if (!Array.isArray(readJson(USERS_KEY, null))) {
    writeJson(USERS_KEY, []);
  }

  if (!Array.isArray(readJson(SESSIONS_KEY, null))) {
    writeJson(SESSIONS_KEY, []);
  }

  if (!Array.isArray(readJson(AUDIT_KEY, null))) {
    writeJson(AUDIT_KEY, []);
  }
}

export function readUsers() {
  return readJson(USERS_KEY, []);
}

export function writeUsers(users) {
  writeJson(USERS_KEY, users);
}

export function readSessions() {
  return readJson(SESSIONS_KEY, []);
}

export function writeSessions(sessions) {
  writeJson(SESSIONS_KEY, sessions);
}

export function readAudit() {
  return readJson(AUDIT_KEY, []);
}

export function writeAudit(entries) {
  writeJson(AUDIT_KEY, entries);
}

export function appendAudit(entry) {
  const entries = readAudit();
  writeAudit([entry, ...entries].slice(0, 500));
}

export function buildAuthIndexes(users, sessions) {
  const usersByUsername = new Map();
  users.forEach((user) => {
    if (user?.username) {
      usersByUsername.set(user.username, user);
    }
  });

  const sessionsByToken = new Map();
  sessions.forEach((session) => {
    if (session?.sessionToken) {
      sessionsByToken.set(session.sessionToken, session);
    }
  });

  return { usersByUsername, sessionsByToken };
}
