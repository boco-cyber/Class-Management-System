# Youth Ministry Management System

A comprehensive web application for managing high school youth ministry programs, built with React.

## 📋 Overview

This application digitizes and streamlines the management of your High School Youth Ministry for 2025-2026, replacing complex Excel spreadsheets with an intuitive, modern web interface.

## ✨ Features

### 1. **Dashboard**
- Real-time statistics (Active Students, Graduates, Attendance, Pending Visits)
- Recent activity feed
- Quick action buttons for common tasks
- Visual analytics at a glance

### 2. **Student Management**
- Complete student profiles with contact information
- Parent contact details
- Grade tracking
- Responsible servant assignment
- Search and filter capabilities
- CRUD operations (Create, Read, Update, Delete)
- Student status tracking (Active, Graduate, Transferred)

### 3. **Attendance Tracking**
- Digital attendance marking for Friday/Saturday services
- Date-based attendance records
- Real-time attendance marking
- Present/Absent tracking
- Historical attendance data
- Attendance reports per student

### 4. **Servants Preparation Program**
- Track student progress through 10 core courses:
  - Dogma 1 & 2
  - Spirituality
  - Liturgical Studies
  - Patristics
  - Apologetics
  - New Testament
  - Old Testament
  - Church History
  - Comparative Religion
- Course status tracking (Not Started, In Progress, Completed, Passed)
- Service hours logging
- Graduate tracking

### 5. **Service Rotations**
- Schedule and manage service assignments
- Calendar view of rotations
- Multiple service types (Altar Service, Ushers, etc.)
- Volunteer assignment tracking

### 6. **Visitations**
- Visitation planning and scheduling
- Track visit status (Pending, Completed)
- Visitation groups management
- Notes and follow-up tracking
- Address and contact information

### 7. **Reports & Analytics**
- Generate attendance reports
- Export data functionality
- Progress tracking reports
- Statistical analysis

## 🎨 Design Features

- **Modern, Church-Appropriate Aesthetic**: Warm earth tones (browns, golds) reflecting tradition and warmth
- **Intuitive Navigation**: Sidebar navigation with clear iconography
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Professional Typography**: Crimson Pro for headings, Inter for body text
- **Smooth Animations**: Enhanced user experience with subtle transitions
- **Accessible Interface**: High contrast, clear labels, and logical flow

## 🚀 Getting Started

### Option 1: Simple Local Deployment

1. Download all files to a folder
2. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)
3. Start using the application immediately

### Option 2: Development Setup

```bash
# Create a new React project
npx create-react-app youth-ministry-system
cd youth-ministry-system

# Copy the component file
# Replace src/App.js with youth-ministry-app.jsx content

# Install dependencies (if needed)
npm install lucide-react

# Start the development server
npm start
```

### Option 3: Production Deployment

**Deploy to Vercel (Recommended):**
```bash
npm install -g vercel
vercel
```

**Deploy to Netlify:**
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `build`

## 📊 Data Structure

### Students
```javascript
{
  id: number,
  firstName: string,
  lastName: string,
  grade: string,
  phone: string,
  email: string,
  dob: string,
  responsibleServant: string,
  status: string // 'Active' | 'Graduate' | 'Transferred'
}
```

### Attendance
```javascript
{
  id: number,
  studentId: number,
  date: string,
  present: boolean,
  day: string // 'Friday' | 'Saturday'
}
```

### Course Progress
```javascript
{
  studentId: number,
  courseId: number,
  status: string // 'not-started' | 'in-progress' | 'completed' | 'passed'
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

To migrate your existing Excel data:

1. **Export each sheet to CSV**
2. **Create a data import script**:
```javascript
// Example: Import students from CSV
function importStudents(csvData) {
  const students = csvData.map(row => ({
    firstName: row['First Name'],
    lastName: row['Last Name'],
    grade: row['Grade'],
    // ... map other fields
  }));
  setStudents(students);
}
```

3. **Use the provided data structure** to maintain consistency

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

- **Frontend**: React 18
- **Icons**: Lucide React
- **Styling**: CSS-in-JS
- **State Management**: React Hooks (useState)
- **Data Storage**: LocalStorage (can be upgraded to database)

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
