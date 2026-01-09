-- Youth Ministry Management System schema (SQLite)

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  passwordHash TEXT NOT NULL,
  fullName TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'servant',
  isActive BOOLEAN DEFAULT 1,
  lastLogin TEXT,
  failedAttempts INTEGER DEFAULT 0,
  lockedUntil TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS userSessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  sessionToken TEXT NOT NULL UNIQUE,
  expiresAt TEXT NOT NULL,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  grade TEXT,
  phone TEXT,
  email TEXT,
  dateOfBirth TEXT,
  responsibleServant TEXT,
  status TEXT DEFAULT 'Active',
  parent1Name TEXT,
  parent1Phone TEXT,
  parent1Email TEXT,
  parent2Name TEXT,
  parent2Phone TEXT,
  parent2Email TEXT,
  address TEXT,
  city TEXT,
  zipcode TEXT,
  notes TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  studentId INTEGER NOT NULL,
  date TEXT NOT NULL,
  dayOfWeek TEXT NOT NULL,
  present BOOLEAN NOT NULL,
  isExcused BOOLEAN DEFAULT 0,
  excuseReason TEXT,
  notes TEXT,
  markedBy TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE(studentId, date, dayOfWeek)
);

CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  requiredForGraduation BOOLEAN DEFAULT 1,
  displayOrder INTEGER
);

CREATE TABLE IF NOT EXISTS studentCourses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  studentId INTEGER NOT NULL,
  courseId INTEGER NOT NULL,
  status TEXT DEFAULT 'Not Started',
  grade TEXT,
  startDate TEXT,
  completionDate TEXT,
  notes TEXT,
  evaluatedBy TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE(studentId, courseId)
);

CREATE TABLE IF NOT EXISTS serviceHours (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  studentId INTEGER NOT NULL,
  date TEXT NOT NULL,
  hours REAL NOT NULL,
  serviceType TEXT,
  description TEXT,
  verifiedBy TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS serviceTypes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  requiresTraining BOOLEAN DEFAULT 0,
  maxPerService INTEGER DEFAULT 1,
  displayOrder INTEGER
);

CREATE TABLE IF NOT EXISTS serviceRotations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  dayOfWeek TEXT NOT NULL,
  serviceTypeId INTEGER NOT NULL,
  studentId INTEGER,
  status TEXT DEFAULT 'Scheduled',
  notes TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (serviceTypeId) REFERENCES serviceTypes(id) ON DELETE CASCADE,
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS visitations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  studentId INTEGER NOT NULL,
  scheduledDate TEXT,
  completedDate TEXT,
  visitationType TEXT,
  status TEXT DEFAULT 'Pending',
  visitedBy TEXT,
  notes TEXT,
  nextFollowUpDate TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS teachingSchedule (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  dayOfWeek TEXT NOT NULL,
  teacherName TEXT NOT NULL,
  topic TEXT NOT NULL,
  classType TEXT,
  notes TEXT,
  materialsNeeded TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(date, dayOfWeek)
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  category TEXT,
  description TEXT,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(studentId);
CREATE INDEX IF NOT EXISTS idx_studentCourses_student ON studentCourses(studentId);
CREATE INDEX IF NOT EXISTS idx_studentCourses_course ON studentCourses(courseId);
CREATE INDEX IF NOT EXISTS idx_serviceHours_student ON serviceHours(studentId);
CREATE INDEX IF NOT EXISTS idx_serviceRotations_serviceType ON serviceRotations(serviceTypeId);
CREATE INDEX IF NOT EXISTS idx_visitations_student ON visitations(studentId);
