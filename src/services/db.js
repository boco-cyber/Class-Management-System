// SQLite scaffolding for future Electron integration.
// This module is intentionally not wired into the UI yet.

export function getDbPath() {
  return '%APPDATA%/YouthMinistry/data.db';
}

export function initDatabase() {
  throw new Error('Database adapter not implemented yet. Use better-sqlite3 in Electron.');
}

export function seedDatabase() {
  throw new Error('Database adapter not implemented yet.');
}
