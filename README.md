# Youth Ministry Management System

A comprehensive web application for managing high school youth ministry programs, built with React.

## 📋 Overview

This application digitizes and streamlines the management of your High School Youth Ministry for 2025-2026, replacing complex Excel spreadsheets with an intuitive, modern web interface.

## ✨ Features

### 1. **Enhanced Dashboard**
- Real-time statistics with live data
  - Active Students with grade distribution breakdown
  - Graduates count
  - Real-time attendance percentage calculation
  - Pending visits counter with completed visitations
- Recent activity feed from actual data
  - Latest attendance sessions
  - Recently added students
  - Completed visitations
- Quick action buttons for common tasks
  - Mark Attendance
  - Add Student
  - Schedule Visit
  - Import/Export Data

### 2. **Comprehensive Student Management**
- **Complete Profiles**:
  - Full name, grade, date of birth
  - Contact information (phone, email)
  - Responsible servant assignment
  - Student status (Active, Graduate, Transferred)
- **Parent Information**:
  - Parent 1 & 2 contact details (name, phone, email)
- **Address Information**:
  - Full address, city, zipcode
- **Student Detail View**:
  - Comprehensive profile display
  - Full attendance history with percentages
  - Course progress overview
  - Parent contact cards
  - Edit capabilities
- **Management Features**:
  - Search and filter by name or grade
  - CRUD operations (Create, Read, Update, Delete)
  - Status badges (color-coded)
  - Quick access to edit/delete/view details

### 3. **Advanced Attendance Tracking**
- **Digital Attendance Marking**:
  - Friday/Saturday service selection
  - Date picker for any session
  - Individual Present/Absent marking
- **Bulk Operations**:
  - Mark All Present
  - Mark All Absent
  - Copy from Last Week
- **Attendance History**:
  - Statistics dashboard (total sessions, present/absent counts)
  - Timeline view of last 10 sessions
  - Color-coded percentages (green ≥80%, yellow ≥60%, red <60%)
  - Session-by-session breakdown
- **Real Calculations**:
  - Live attendance percentage on dashboard
  - Per-student attendance tracking
  - Historical records with date filtering

### 4. **Servants Preparation Program**
- **10 Core Courses Tracked**:
  - Dogma 1 & 2
  - Spirituality
  - Liturgical Studies
  - Patristics
  - Apologetics
  - New Testament
  - Old Testament
  - Church History
  - Comparative Religion
- **Progress Tracking**:
  - Course status: Not Started, In Progress, Completed, Passed
  - Per-student progress view
  - Visual progress indicators
  - Persistent storage (survives page refresh)
- **Integration**:
  - Displayed in Student Detail view
  - Automatic save on status change

### 5. **Service Rotations Management**
- **Full CRUD Operations**:
  - Create new rotations
  - Edit existing rotations
  - Delete rotations with confirmation
- **8 Service Types**:
  - Altar Service
  - Ushers
  - Hymns/Praise
  - Readings
  - Offering
  - Multimedia
  - Cleaning
  - Setup/Teardown
- **Features**:
  - Date-based scheduling
  - Volunteer assignment (comma-separated names)
  - Sorted by date (most recent first)
  - Modal-based editing
  - Empty state with call-to-action

### 6. **Visitations Scheduling & Tracking**
- **Full Management**:
  - Schedule new visits
  - Edit existing visits
  - Delete visits with confirmation
  - Toggle completion status
- **Filter System**:
  - View All visitations
  - Filter by Pending
  - Filter by Completed
- **Detailed Information**:
  - Student assignment
  - Visit date
  - Servants assigned
  - Group size
  - Notes
  - Student address (when available)
- **Status Tracking**:
  - Pending vs Completed badges
  - Quick status toggle
  - Completion count in dashboard

### 7. **Data Import/Export System**
- **Export Capabilities**:
  - Export Students (CSV)
  - Export Attendance (CSV)
  - Export Course Progress (CSV)
  - Full Backup (JSON) - all data included
- **Import Features**:
  - CSV file upload with drag-and-drop
  - Real-time data validation
  - Preview table (first 10 records)
  - Error reporting with detailed messages
  - Support for all 17 student fields
- **CSV Format**:
  - Required: firstName, lastName, grade
  - Optional: phone, email, dob, responsibleServant, status, parent info, address
  - Grade validation: 9th, 10th, 11th, or 12th
- **User-Friendly**:
  - Step-by-step wizard
  - Validation errors displayed
  - Confirmation before import
  - Success notifications

## 🎨 Design Features

- **Modern, Church-Appropriate Aesthetic**: Warm earth tones (browns, golds) reflecting tradition and warmth
- **Intuitive Navigation**: Sidebar navigation with clear iconography
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Professional Typography**: Crimson Pro for headings, Inter for body text
- **Smooth Animations**: Enhanced user experience with subtle transitions
- **Accessible Interface**: High contrast, clear labels, and logical flow

## 🚀 Getting Started

### Development Setup

```bash
# Clone or download the repository
cd Class-Management-System

# Install dependencies
npm install

# Start the development server (runs on port 8080)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Dependencies

The application uses:
- **React 18.3.1** - UI framework
- **Vite 7.3.1** - Build tool and dev server
- **Lucide React 0.294.0** - Icon library
- **PapaParse 5.5.3** - CSV parsing for data import

### Production Deployment

**Deploy to Vercel (Recommended):**
```bash
npm install -g vercel
vercel
```

**Deploy to Netlify:**
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`

## 📊 Data Structure

### Students
```javascript
{
  id: number,
  firstName: string,
  lastName: string,
  grade: '9th' | '10th' | '11th' | '12th',
  phone: string,
  email: string,
  dob: string,
  responsibleServant: string,
  status: 'Active' | 'Graduate' | 'Transferred',
  // Parent Information
  parent1Name: string,
  parent1Phone: string,
  parent1Email: string,
  parent2Name: string,
  parent2Phone: string,
  parent2Email: string,
  // Address Information
  address: string,
  city: string,
  zipcode: string
}
```

### Attendance
```javascript
{
  id: number,
  studentId: number,
  date: string, // ISO date format
  present: boolean,
  day: string // Weekday name
}
```

### Course Progress
```javascript
{
  studentId: number,
  courseId: number,
  status: 'not-started' | 'in-progress' | 'completed' | 'passed'
}
```

### Service Rotations
```javascript
{
  id: number,
  date: string, // ISO date format
  serviceType: string, // One of 8 service types
  volunteers: string // Comma-separated names
}
```

### Visitations
```javascript
{
  id: number,
  studentId: number,
  date: string, // ISO date format
  servants: string,
  groupSize: string,
  notes: string,
  completed: boolean
}
```

## 🔧 Configuration

### Adding Servants
Edit the responsible servant list in the Student Modal:
```javascript
<option value="ServantName">Servant Name</option>
```

### Adding Courses
Modify the `initialCourses` array:
```javascript
{ id: number, name: string, category: string }
```

### Customizing Colors
Edit CSS variables in the style section:
```css
:root {
  --primary: #8B4513;
  --secondary: #D4AF37;
  /* ... more colors */
}
```

## 📱 Mobile Responsive

The application is fully responsive with breakpoints at:
- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 768px

## 🔐 Future Enhancements

### Recommended Next Steps:

1. **Backend Integration**
   - Connect to a database (Firebase, Supabase, or PostgreSQL)
   - User authentication and role-based access
   - Real-time data synchronization

2. **Advanced Features**
   - Email/SMS notifications for service rotations
   - Automated attendance reminders
   - PDF report generation
   - Data export to Excel
   - Bulk import from existing spreadsheets
   - Photo uploads for students
   - Document storage

3. **Analytics Dashboard**
   - Attendance trends over time
   - Course completion rates
   - Engagement metrics
   - Visitation completion tracking

4. **Mobile App**
   - React Native version
   - Push notifications
   - Offline mode

## 🗄️ Data Migration from Excel

The application includes a built-in **Import/Export system**:

### Importing Data:

1. **Navigate to Import/Export**:
   - Click "Import/Export" in the sidebar

2. **Export Excel to CSV**:
   - Open your Excel file (e.g., "HS 2025-2026.xlsx")
   - Export "Class 2526" sheet to CSV

3. **Import via UI**:
   - Select "Students" import type
   - Click to upload CSV file or drag-and-drop
   - Review the preview (first 10 records shown)
   - Check for validation errors
   - Click "Import" to complete

### CSV Format Requirements:

**Required Columns:**
- `firstName`
- `lastName`
- `grade` (must be: 9th, 10th, 11th, or 12th)

**Optional Columns:**
- `phone`, `email`, `dob`
- `responsibleServant`
- `status` (Active, Graduate, Transferred)
- `parent1Name`, `parent1Phone`, `parent1Email`
- `parent2Name`, `parent2Phone`, `parent2Email`
- `address`, `city`, `zipcode`

### Exporting Data:

- **Students CSV**: All student information
- **Attendance CSV**: All attendance records with student names
- **Course Progress CSV**: Student course completion status
- **Full Backup JSON**: Complete data backup (all tables)

## 🆘 Support & Documentation

### Common Tasks:

**Add a New Student:**
1. Click "Students" in sidebar
2. Click "Add Student" button
3. Fill in the form
4. Click "Create Student"

**Mark Attendance:**
1. Click "Attendance" in sidebar
2. Select date and day (Friday/Saturday)
3. Click "Present" or "Absent" for each student

**Track Course Progress:**
1. Click "Servants Prep" in sidebar
2. Select a student from the left panel
3. Update course status using dropdowns

**Schedule a Visitation:**
1. Click "Visitations" in sidebar
2. Click "Schedule Visit"
3. Select student and assign date/servants

## 🎯 Best Practices

1. **Regular Backups**: Export data weekly
2. **Consistent Data Entry**: Use standard formats for phones, emails
3. **Weekly Updates**: Mark attendance and update course progress weekly
4. **Quarterly Reviews**: Review student progress and engagement
5. **Communication**: Use the system to track and plan communications

## 📝 Technical Stack

- **Frontend**: React 18.3.1
- **Build Tool**: Vite 7.3.1
- **Icons**: Lucide React 0.294.0
- **CSV Parsing**: PapaParse 5.5.3
- **Styling**: CSS3 with CSS Variables
- **State Management**: React Hooks (useState, useEffect)
- **Data Storage**: LocalStorage with custom hooks
- **Module System**: ES6 Modules

## 🤝 Contributing

To extend this application:

1. Fork the repository
2. Create a feature branch
3. Add your enhancements
4. Test thoroughly
5. Submit a pull request

## 📄 License

This application is provided as-is for church ministry use. Feel free to modify and adapt to your specific needs.

## 🙏 Acknowledgments

Built with care for effective youth ministry management. May this tool help you serve and connect with your youth community more effectively.

---

**Version**: 1.0.0
**Last Updated**: January 2026
**Maintained by**: Youth Ministry Team

## 🎯 Key Features Summary

✅ **Full LocalStorage Persistence** - All data saves automatically
✅ **Student Management** - Complete profiles with parent & address info
✅ **Attendance Tracking** - Bulk operations, history view, real-time stats
✅ **Course Progress** - 10 Servants Prep courses with persistent tracking
✅ **Service Rotations** - Full CRUD with 8 service types
✅ **Visitations** - Scheduling, tracking, and completion management
✅ **Import/Export** - CSV import with validation, multiple export formats
✅ **Enhanced Dashboard** - Live stats, grade distribution, recent activity
✅ **Student Detail View** - Comprehensive profile with attendance & progress
✅ **Professional UI** - Church-appropriate design with smooth animations
