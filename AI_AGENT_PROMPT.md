# PROMPT FOR AI AGENT: Youth Ministry Management Desktop Application

## PROJECT OVERVIEW

Build a **desktop application** for managing a High School Youth Ministry program (2025-2026). This should be a **Windows desktop app** built with modern technologies that can run on PC without requiring a web browser.

---

## TECHNOLOGY STACK REQUIREMENTS

### Primary Option (Recommended): Electron + React
- **Framework**: Electron (for desktop packaging)
- **Frontend**: React 18 with TypeScript
- **UI Library**: Tailwind CSS (already designed - see attached files)
- **Database**: SQLite (local, embedded database - no server needed)
- **State Management**: React Context API or Zustand
- **Build Tool**: Vite or Create React App
- **Icons**: Lucide React (already implemented)

### Alternative Option: .NET Desktop
- **Framework**: WPF (Windows Presentation Foundation) or WinForms
- **Language**: C# with .NET 8
- **Database**: SQLite or SQL Server LocalDB
- **UI**: Modern Material Design or Fluent UI

**Recommendation**: Use Electron + React as it allows code reuse from the existing web app.

---

## EXISTING CODEBASE TO LEVERAGE

You have been provided with:
1. `youth-ministry-standalone.html` - Complete working web application with all UI/UX already designed
2. `README.md` - Full feature documentation
3. `data-migration.js` - Excel import/export logic
4. Excel file structure from `HS_2025-2026.xlsx`

**Key Instruction**: Extract the React components, styling, and business logic from the standalone HTML file and convert them into a proper Electron desktop application.

---

## CORE FEATURES TO IMPLEMENT

### 1. STUDENT MANAGEMENT ✅
**Database Table**: `students`
```sql
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  grade TEXT,
  phone TEXT,
  email TEXT,
  dateOfBirth TEXT,
  responsibleServant TEXT,
  status TEXT DEFAULT 'Active',
  -- Parent Information
  parent1Name TEXT,
  parent1Phone TEXT,
  parent1Email TEXT,
  parent2Name TEXT,
  parent2Phone TEXT,
  parent2Email TEXT,
  -- Address
  address TEXT,
  city TEXT,
  zipcode TEXT,
  notes TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);
```

**Features**:
- ✅ Add, Edit, Delete students
- ✅ Search by name (real-time filtering)
- ✅ Filter by grade (9th, 10th, 11th, 12th)
- ✅ Filter by status (Active, Graduate, Transferred)
- ✅ View student details with all information
- ✅ Parent contact management
- ✅ Bulk operations (import from Excel)

---

### 2. ATTENDANCE TRACKING ✅
**Database Table**: `attendance`
```sql
CREATE TABLE attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  studentId INTEGER NOT NULL,
  date TEXT NOT NULL,
  dayOfWeek TEXT NOT NULL, -- 'Friday' or 'Saturday'
  present BOOLEAN NOT NULL,
  isExcused BOOLEAN DEFAULT 0,
  excuseReason TEXT,
  notes TEXT,
  markedBy TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE(studentId, date, dayOfWeek)
);
```

**Features**:
- ✅ Mark attendance for Friday/Saturday services
- ✅ Date picker to select any date
- ✅ Visual indicators (Green = Present, Red = Absent)
- ✅ Excuse tracking (Excused vs Unexcused absences)
- ✅ Attendance history per student
- ✅ Attendance reports by date range
- ✅ Attendance percentage calculation
- ✅ Alert for students with low attendance (<60%)
- ✅ Bulk attendance entry (mark all present/absent)

**Reports to Generate**:
- Attendance by student (date range)
- Weekly attendance summary
- Monthly attendance trends
- Students with <60% attendance
- Export to Excel

---

### 3. SERVANTS PREPARATION PROGRAM ✅
**Database Tables**:
```sql
CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  requiredForGraduation BOOLEAN DEFAULT 1,
  displayOrder INTEGER
);

CREATE TABLE studentCourses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  studentId INTEGER NOT NULL,
  courseId INTEGER NOT NULL,
  status TEXT DEFAULT 'Not Started', -- 'Not Started', 'In Progress', 'Completed', 'Passed', 'Failed'
  grade TEXT, -- 'A', 'B', 'C', 'Pass', 'Fail', etc.
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

CREATE TABLE serviceHours (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  studentId INTEGER NOT NULL,
  date TEXT NOT NULL,
  hours REAL NOT NULL,
  serviceType TEXT, -- 'Teaching', 'Altar', 'Ushers', etc.
  description TEXT,
  verifiedBy TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
);
```

**Courses to Pre-populate**:
1. Dogma 1 (Theology)
2. Dogma 2 (Theology)
3. Spirituality (Spiritual Life)
4. Liturgical Studies (Worship)
5. Patristics (Church Fathers)
6. Apologetics (Apologetics)
7. New Testament (Scripture)
8. Old Testament (Scripture)
9. Church History (History)
10. Comparative Religion (Comparative)

**Features**:
- ✅ Track course progress per student
- ✅ Status dropdown: Not Started, In Progress, Completed, Passed, Failed
- ✅ Grade entry (optional)
- ✅ Track service hours with type and description
- ✅ Generate graduation eligibility report
- ✅ Course completion certificates (PDF export)
- ✅ Progress tracking dashboard per student
- ✅ Bulk grade entry

**Graduation Requirements**:
- All 10 courses must be "Passed" or "Completed"
- Minimum service hours (configurable, default: 40 hours)

---

### 4. SERVICE ROTATIONS ✅
**Database Tables**:
```sql
CREATE TABLE serviceTypes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  requiresTraining BOOLEAN DEFAULT 0,
  maxPerService INTEGER DEFAULT 1,
  displayOrder INTEGER
);

CREATE TABLE serviceRotations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  dayOfWeek TEXT NOT NULL, -- 'Friday' or 'Saturday'
  serviceTypeId INTEGER NOT NULL,
  studentId INTEGER,
  status TEXT DEFAULT 'Scheduled', -- 'Scheduled', 'Completed', 'No-Show', 'Cancelled'
  notes TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (serviceTypeId) REFERENCES serviceTypes(id) ON DELETE CASCADE,
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE SET NULL
);
```

**Service Types to Pre-populate**:
1. Altar Service
2. Ushers
3. Scripture Reading
4. Offering Collection
5. Multimedia/Tech
6. Children's Ministry
7. Setup/Cleanup

**Features**:
- ✅ Create rotation schedules
- ✅ Assign students to services
- ✅ Calendar view (monthly/weekly)
- ✅ Auto-schedule (rotate through students fairly)
- ✅ Conflict detection (student already assigned same day)
- ✅ Manual override and reassignment
- ✅ Mark service as completed/no-show
- ✅ Print rotation schedule
- ✅ Export to Excel/PDF

**Auto-Schedule Algorithm**:
- Track last assignment date per student per service type
- Prioritize students who haven't served recently
- Ensure fair distribution
- Skip students with attendance <60% (configurable)
- Avoid assigning same student to multiple services on same day

---

### 5. VISITATIONS MANAGEMENT ✅
**Database Table**:
```sql
CREATE TABLE visitations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  studentId INTEGER NOT NULL,
  scheduledDate TEXT,
  completedDate TEXT,
  visitationType TEXT, -- 'Initial', 'Follow-up', 'Emergency', 'Routine'
  status TEXT DEFAULT 'Pending', -- 'Pending', 'Scheduled', 'Completed', 'Cancelled'
  visitedBy TEXT, -- Servant name(s)
  notes TEXT,
  nextFollowUpDate TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
);
```

**Features**:
- ✅ Schedule home visits
- ✅ Track visitation status
- ✅ Assign servants to visits
- ✅ Notes and follow-up tracking
- ✅ Calendar view of upcoming visits
- ✅ Overdue visits alert
- ✅ Visit history per student
- ✅ Export visitation report

---

### 6. TEACHING SCHEDULE ✅
**Database Table**:
```sql
CREATE TABLE teachingSchedule (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  dayOfWeek TEXT NOT NULL, -- 'Friday' or 'Saturday'
  teacherName TEXT NOT NULL,
  topic TEXT NOT NULL,
  classType TEXT, -- 'Liturgical Studies', 'Bible Study', 'Special Event', etc.
  notes TEXT,
  materialsNeeded TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(date, dayOfWeek)
);
```

**Features**:
- ✅ Schedule teaching sessions
- ✅ Assign teachers
- ✅ Track topics covered
- ✅ Calendar view
- ✅ Recurring schedule support
- ✅ Print teaching schedule
- ✅ Export to PDF/Excel

---

### 7. AUTHENTICATION & LOGIN SYSTEM ✅
**Database Tables**:
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  passwordHash TEXT NOT NULL,
  fullName TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'servant', -- 'admin', 'servant', 'viewer'
  isActive BOOLEAN DEFAULT 1,
  lastLogin TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE userSessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  sessionToken TEXT NOT NULL UNIQUE,
  expiresAt TEXT NOT NULL,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

**Features**:
- ✅ Secure login screen (first screen on app launch)
- ✅ Password hashing (bcrypt or similar)
- ✅ Session management (stay logged in until logout)
- ✅ Remember me option (optional)
- ✅ Password change functionality
- ✅ User management (admin only)
- ✅ Role-based access control:
  - **Admin**: Full access to all features
  - **Servant**: Can view and edit data
  - **Viewer**: Read-only access
- ✅ Auto-logout after inactivity (configurable, default: 30 minutes)
- ✅ Failed login attempt tracking (lock after 5 failed attempts)

**User Roles & Permissions**:

**Admin**:
- All features unlocked
- Can create/edit/delete users
- Can change settings
- Can delete records
- Can export all data

**Servant**:
- Can add/edit students
- Can mark attendance
- Can update course progress
- Can schedule rotations and visitations
- Can view all reports
- Cannot delete records
- Cannot manage users
- Cannot change global settings

**Viewer**:
- Can view dashboard
- Can view student lists
- Can view reports
- Cannot add/edit/delete any data
- Read-only access

**Initial Setup**:
1. On first launch, show setup wizard
2. Create admin account (username + password)
3. Optional: Create additional servant/viewer accounts
4. Lock database with admin credentials

**Security Features**:
- Password requirements: Minimum 8 characters, mix of letters and numbers
- Password hashing with salt (never store plain text)
- Session timeout for security
- Audit log for sensitive operations (optional)
- Account lockout after failed login attempts
- Database encryption (optional but recommended)

---

### 8. DASHBOARD & ANALYTICS ✅
**Features**:
- ✅ Statistics cards:
  - Total active students
  - Graduates count
  - Average attendance (last 4 weeks)
  - Pending visitations
  - Upcoming service rotations
- ✅ Charts:
  - Attendance trend (line chart - last 12 weeks)
  - Students by grade (pie chart)
  - Course completion progress (bar chart)
  - Service participation (horizontal bar chart)
- ✅ Recent activity feed
- ✅ Alerts:
  - Students with <60% attendance
  - Overdue visitations
  - Upcoming graduations
  - Service rotations needing assignment

**Chart Library**: Use Recharts or Chart.js

---

### 9. REPORTS & EXPORTS ✅
**Reports to Implement**:

**Student Reports**:
- Student roster (all students with details)
- Students by grade
- Graduate list
- Contact list (with parents)

**Attendance Reports**:
- Weekly attendance summary
- Monthly attendance by student
- Low attendance alert report
- Attendance trends (graph)

**Training Reports**:
- Course completion status (all students)
- Students ready to graduate
- Service hours summary
- Individual student transcript

**Service Reports**:
- Rotation schedule (by date range)
- Service participation by student
- Service type distribution

**Visitation Reports**:
- Visitation schedule
- Completed visits
- Overdue visits

**Export Formats**:
- ✅ Excel (.xlsx)
- ✅ PDF (for printing)
- ✅ CSV (for data analysis)

---

### 10. IMPORT/EXPORT DATA ✅
**Excel Import Features**:
- ✅ Import students from Excel template
- ✅ Import attendance records
- ✅ Import course results
- ✅ Import service rotations
- ✅ Validation and error reporting
- ✅ Preview before import
- ✅ Skip duplicate detection

**Excel Export Features**:
- ✅ Export all students
- ✅ Export attendance records
- ✅ Export course progress
- ✅ Export service rotations
- ✅ Template download (blank forms)

**Template Downloads**:
Provide blank Excel templates with:
- Correct column headers
- Data validation rules
- Example rows
- Instructions sheet

**Libraries to Use**:
- **Node.js/Electron**: `exceljs` or `xlsx`
- **.NET**: `EPPlus` or `ClosedXML`

---

### 11. SETTINGS & CONFIGURATION ✅
**Database Table**:
```sql
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  category TEXT, -- 'General', 'Security', 'Attendance', etc.
  description TEXT,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);
```

**Configurable Settings**:

**General**:
- Church name
- Ministry year (e.g., "2025-2026")
- Logo upload

**Security**:
- Session timeout duration (default: 30 minutes)
- Failed login lockout threshold (default: 5 attempts)
- Password requirements (min length, complexity)
- Auto-logout on inactivity

**Attendance**:
- Low attendance threshold (default: 60%)
- Consecutive absence alert (default: 3)

**Graduation**:
- Required service hours (default: 40)
- Course passing grade (default: C or Pass)

**Servants List**:
- Manage list of servants
- Assign responsibilities
- Contact information

**Backup**:
- Auto-backup schedule (daily, weekly)
- Backup location
- Number of backups to keep

---

## DATABASE DESIGN SUMMARY

### Tables to Create:
1. `users` - User accounts and authentication
2. `userSessions` - Login session management
3. `students` - Student records
4. `attendance` - Attendance tracking
5. `courses` - Course definitions
6. `studentCourses` - Student course enrollment and results
7. `serviceHours` - Service hours log
8. `serviceTypes` - Types of services
9. `serviceRotations` - Service assignments
10. `visitations` - Visitation tracking
11. `teachingSchedule` - Teaching calendar
12. `settings` - App configuration

### Database Initialization:
Create a seed script that:
1. Creates all tables with proper indexes
2. Prompts for admin account creation on first launch
3. Populates `courses` with 10 default courses
4. Populates `serviceTypes` with 7 default service types
5. Creates default settings
6. Optionally imports sample data for testing

---

## UI/UX DESIGN REQUIREMENTS

### Design System (Already Provided)
Use the **existing design** from `youth-ministry-standalone.html`:
- Color scheme: Warm earth tones (browns, golds, whites)
- Typography: Crimson Pro (headings), Inter (body)
- Icons: Lucide React icons
- Layout: Sidebar navigation + main content area

### Sidebar Navigation:
```
┌─────────────────────────┐
│ ✝ Youth Ministry        │
│   HS 2025-2026          │
│   👤 Admin Name          │ <- Current user display
├─────────────────────────┤
│ 🏠 Dashboard            │
│ 👥 Students             │
│ ✅ Attendance           │
│ 📚 Servants Prep        │
│ 📅 Service Rotations    │
│ 🏠 Visitations          │
│ 📖 Teaching Schedule    │
│ 📊 Reports              │
├─────────────────────────┤
│ 👤 User Management*     │ <- Admin only
│ ⚙️  Settings            │
│ 🚪 Logout               │
└─────────────────────────┘

* Only visible to Admin users
```

### Desktop-Specific Features:
- ✅ Window controls (minimize, maximize, close)
- ✅ System tray icon (optional - keep app running in background)
- ✅ Native file dialogs for import/export
- ✅ Print dialog integration
- ✅ Keyboard shortcuts (Ctrl+N for new, Ctrl+S for save, etc.)
- ✅ Auto-save functionality
- ✅ Offline mode (all data local)

---

## STEP-BY-STEP IMPLEMENTATION GUIDE

### Phase 1: Project Setup (Day 1)

**For Electron + React**:
```bash
# Create new Electron app
npm create @quick-start/electron
cd youth-ministry-app

# Install dependencies
npm install react react-dom
npm install -D @types/react @types/react-dom
npm install lucide-react
npm install tailwindcss postcss autoprefixer
npm install better-sqlite3  # For SQLite database
npm install exceljs  # For Excel import/export
npm install recharts  # For charts
npm install bcryptjs  # For password hashing
npm install jsonwebtoken  # For session tokens
npm install validator  # For input validation
```

**For .NET WPF**:
```bash
dotnet new wpf -n YouthMinistryApp
cd YouthMinistryApp
dotnet add package System.Data.SQLite
dotnet add package EPPlus
dotnet add package MaterialDesignThemes
dotnet add package BCrypt.Net-Next  # For password hashing
dotnet add package System.IdentityModel.Tokens.Jwt  # For tokens
```

### Phase 2: Database Setup (Day 1-2)

1. Create `database/schema.sql` with all table definitions
2. Create `database/seed.sql` with initial data
3. Create database helper functions:
   - `initDatabase()` - Creates tables if not exist
   - `seedDatabase()` - Populates initial data
   - CRUD functions for each table

**Example (Node.js)**:
```javascript
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const db = new Database('youth-ministry.db');

function initDatabase() {
  // Create tables
  db.exec(fs.readFileSync('database/schema.sql', 'utf8'));
  
  // Seed data
  db.exec(fs.readFileSync('database/seed.sql', 'utf8'));
}

// Authentication functions
async function createUser(username, password, fullName, role = 'servant') {
  const passwordHash = await bcrypt.hash(password, 10);
  const stmt = db.prepare(`
    INSERT INTO users (username, passwordHash, fullName, role)
    VALUES (?, ?, ?, ?)
  `);
  return stmt.run(username, passwordHash, fullName, role);
}

async function authenticateUser(username, password) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ? AND isActive = 1');
  const user = stmt.get(username);
  
  if (!user) return null;
  
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return null;
  
  // Update last login
  db.prepare('UPDATE users SET lastLogin = ? WHERE id = ?')
    .run(new Date().toISOString(), user.id);
  
  // Don't return password hash
  delete user.passwordHash;
  return user;
}

function createSession(userId) {
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  
  db.prepare(`
    INSERT INTO userSessions (userId, sessionToken, expiresAt)
    VALUES (?, ?, ?)
  `).run(userId, sessionToken, expiresAt.toISOString());
  
  return sessionToken;
}
```

### Phase 3: Extract React Components (Day 2-3)

From `youth-ministry-standalone.html`, extract these components:
1. `Sidebar.tsx` - Navigation sidebar
2. `Dashboard.tsx` - Dashboard view
3. `StudentsView.tsx` - Student management
4. `AttendanceView.tsx` - Attendance tracking
5. `ServantsPrep.tsx` - Course tracking
6. `ServiceRotations.tsx` - Service scheduling
7. `Visitations.tsx` - Visitation management
8. `StudentModal.tsx` - Student add/edit form

Create proper file structure:
```
src/
  components/
    auth/
      LoginScreen.tsx
      SetupWizard.tsx
      PasswordReset.tsx
      UserManagement.tsx
    layout/
      Sidebar.tsx
      Header.tsx
      RequireAuth.tsx
    students/
      StudentList.tsx
      StudentCard.tsx
      StudentModal.tsx
    attendance/
      AttendanceList.tsx
      AttendanceRow.tsx
    ...
  views/
    Dashboard.tsx
    Students.tsx
    Attendance.tsx
    ...
  services/
    database.ts
    auth.ts
    excel.ts
  utils/
    helpers.ts
    constants.ts
  App.tsx
  main.ts
```

### Phase 4: Implement Core Features (Day 3-8)

**Priority Order**:
1. ✅ Authentication & Login System (Day 3)
   - Login screen UI
   - Password hashing
   - Session management
   - Role-based access control
2. ✅ Student Management (Day 4)
3. ✅ Attendance Tracking (Day 5)
4. ✅ Servants Prep / Course Tracking (Day 6)
5. ✅ Service Rotations (Day 7)
6. ✅ Dashboard & Reports (Day 8)

### Phase 5: Import/Export (Day 9)

1. Create Excel templates
2. Implement import logic with validation
3. Implement export logic for all reports
4. Add PDF generation for certificates

### Phase 6: User Management (Day 10)

1. User management screen (admin only)
2. Add/Edit/Delete users
3. Password reset functionality
4. Role assignment
5. Activity logging

### Phase 7: Polish & Testing (Day 11-12)

1. Error handling
2. Loading states
3. Data validation
4. User testing
5. Bug fixes
6. Security testing

### Phase 8: Packaging & Distribution (Day 13)

**For Electron**:
```bash
npm install -D electron-builder
npm run build
npm run dist  # Creates installer
```

**For .NET**:
```bash
dotnet publish -c Release -r win-x64 --self-contained
# Creates .exe in bin/Release/net8.0/win-x64/publish/
```

---

## TECHNICAL SPECIFICATIONS

### Database:
- **Engine**: SQLite 3
- **Location**: `%APPDATA%/YouthMinistry/data.db` (Windows)
- **Backup**: Auto-backup daily to `%APPDATA%/YouthMinistry/backups/`
- **Indexes**: Add indexes on foreign keys and frequently queried fields

### Performance:
- Lazy loading for large lists (virtualization)
- Debounced search (300ms delay)
- Pagination for large datasets (50 items per page)
- Database connection pooling

### Security:
- **Authentication Required**: Login screen on launch
- **Password Hashing**: bcrypt or Argon2 (never store plain text)
- **Session Management**: Secure session tokens with expiration
- **Role-Based Access**: Admin, Servant, Viewer roles
- **Account Lockout**: Temporary lock after failed login attempts
- **Auto-Logout**: Configurable inactivity timeout
- **Data Encryption**: Optional database encryption at rest
- **Audit Trail**: Log sensitive operations (user changes, data deletion)
- **Password Policy**: Enforce strong passwords
- **Secure Password Reset**: Security questions or admin reset

### Error Handling:
- Graceful error messages
- Error logging to file
- Auto-recovery from crashes
- Data validation before database writes

---

## TESTING REQUIREMENTS

### Unit Tests:
- Database CRUD operations
- Date calculations
- Data validation functions
- Import/export logic

### Integration Tests:
- Student workflow (add → edit → delete)
- Attendance marking and reporting
- Course progress tracking
- Service rotation scheduling

### User Acceptance Testing:
- Real-world scenarios with sample data
- Performance with 100+ students
- Report generation speed
- Excel import/export accuracy

---

## DELIVERABLES

### Code:
- ✅ Full source code with comments
- ✅ Database schema and seed files
- ✅ README with setup instructions
- ✅ Build scripts

### Documentation:
- ✅ User manual (PDF)
- ✅ Installation guide
- ✅ Database schema diagram
- ✅ API/function reference

### Installer:
- ✅ Windows installer (.exe or .msi)
- ✅ Auto-updater (optional)
- ✅ Uninstaller

### Sample Data:
- ✅ Sample database with 20 students
- ✅ Sample attendance records
- ✅ Sample course results
- ✅ Sample service rotations

---

## EXISTING CODE REFERENCE

The provided `youth-ministry-standalone.html` contains:
1. ✅ Complete React components (extract and convert to .tsx files)
2. ✅ All styling (convert to Tailwind classes or CSS modules)
3. ✅ UI layout and navigation
4. ✅ Form validation patterns
5. ✅ Modal dialogs
6. ✅ State management patterns

**DO NOT rewrite from scratch** - extract and enhance the existing working code.

---

## ADDITIONAL FEATURES TO CONSIDER

### Nice-to-Have (If Time Permits):
- 📸 Student photo upload
- 🖨️ Print ID cards
- 📧 Bulk email composer
- 📊 Custom report builder
- 🔄 Data sync between multiple PCs (future: cloud sync)
- 📱 Mobile companion app (future)
- 🌐 Export to Google Calendar
- 📋 Checklist system for graduation requirements

---

## COMMON PITFALLS TO AVOID

1. ❌ **Don't use localhost API** - This is a desktop app with local database
2. ❌ **Don't require internet** - App must work fully offline
3. ❌ **Don't over-engineer** - Keep it simple and maintainable
4. ❌ **Don't ignore data migration** - Plan for schema updates
5. ❌ **Don't skip backup** - Auto-backup is critical
6. ❌ **Don't use external dependencies unnecessarily** - Keep bundle size small

---

## SUCCESS CRITERIA

The application is successful if:
- ✅ Runs on Windows 10/11 without installation issues
- ✅ Handles 200+ students without performance degradation
- ✅ Excel import works with provided Excel file structure
- ✅ All reports generate correctly and can be printed
- ✅ Data persists between app restarts
- ✅ UI matches the provided design
- ✅ User can complete common workflows in <5 clicks
- ✅ No data loss or corruption

---

## TIMELINE ESTIMATE

- **Basic App (Login + Students + Attendance)**: 4-5 days
- **Full Features (Everything except notifications)**: 11-13 days
- **Polish + Testing + Security**: 2-3 days
- **Total**: ~2 weeks for complete application

---

## QUESTIONS TO CLARIFY BEFORE STARTING

1. **Target Platform**: Windows only, or also macOS/Linux?
2. **User Roles**: Should there be different admin levels, or just admin/servant/viewer?
3. **Data Sharing**: Does data need to sync between multiple PCs?
4. **Initial Admin**: Should the first-time setup wizard be mandatory?
5. **Existing Data**: Will you provide the actual Excel file to test import?
6. **Customization**: Should church name/logo be customizable?
7. **Auto-Updates**: Should app auto-update when new version available?
8. **Password Recovery**: How should password reset work (admin only, security questions, etc.)?

---

## LOGIN SCREEN REQUIREMENTS

### First Launch - Setup Wizard:
```
┌────────────────────────────────────┐
│    Welcome to Youth Ministry       │
│         Management System          │
│                                    │
│  Let's set up your admin account  │
│                                    │
│  Full Name: [________________]     │
│  Username:  [________________]     │
│  Email:     [________________]     │
│  Password:  [________________]     │
│  Confirm:   [________________]     │
│                                    │
│  [x] I agree to terms of use       │
│                                    │
│        [ Continue Setup ]          │
└────────────────────────────────────┘
```

### Regular Login Screen:
```
┌────────────────────────────────────┐
│           ✝                        │
│    YOUTH MINISTRY SYSTEM           │
│         HS 2025-2026               │
│                                    │
│                                    │
│  Username: [________________]      │
│  Password: [________________]      │
│                                    │
│  [ ] Remember me                   │
│                                    │
│        [ Login ]                   │
│                                    │
│  Forgot password?                  │
└────────────────────────────────────┘
```

### Login Features:
- ✅ Clean, professional design matching app aesthetic
- ✅ Show church logo (if configured)
- ✅ Password visibility toggle (eye icon)
- ✅ "Remember me" checkbox (save session)
- ✅ Failed login error messages
- ✅ Account lockout warning after 3 failed attempts
- ✅ Forgot password link (admin reset only)
- ✅ Loading spinner during authentication
- ✅ Keyboard shortcuts (Enter to submit)

---

## FINAL NOTES

This is a well-scoped desktop application project. The existing web app code provides an excellent foundation - focus on:

1. **Converting web components to desktop format**
2. **Implementing local SQLite database**
3. **Adding Excel import/export**
4. **Creating robust reporting system**
5. **Packaging for easy distribution**

The UI/UX design is already proven and beautiful - don't change it unnecessarily. Focus on making it work reliably as a desktop application.

**Good luck! This will be a valuable tool for youth ministry management.**
