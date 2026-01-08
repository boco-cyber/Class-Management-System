// Excel Data Migration Script
// Use this script to convert your Excel data to the app format

/**
 * This script helps you migrate data from your Excel spreadsheet
 * to the Youth Ministry Management System format.
 * 
 * USAGE:
 * 1. Export your Excel sheets to CSV format
 * 2. Use this script as a template to parse and import data
 * 3. The data will be formatted for use in the React application
 */

// ==========================================
// STUDENT DATA MIGRATION
// ==========================================

/**
 * Converts Excel student data to app format
 * Source: "Class 2526" sheet
 */
function migrateStudents(excelData) {
  return excelData.map((row, index) => ({
    id: index + 1,
    firstName: row['First Name'] || '',
    lastName: row['Last Name'] || '',
    grade: row['Grade'] || '9th',
    phone: row['Phone'] || row['Mobile Phone'] || '',
    email: row['Email'] || '',
    dob: row['Date of Birth'] || row['Birthdate'] || '',
    responsibleServant: row['Responsible Servant'] || '',
    status: 'Active',
    // Parent Information
    parent1Name: row['Parent 1 Full Name'] || '',
    parent1Phone: row['Parent 1 Phone Number'] || '',
    parent1Email: row['Parent 1 Email'] || '',
    parent2Name: row['Parent 2 Full Name'] || '',
    parent2Phone: row['Parent 2 Phone Number'] || '',
    parent2Email: row['Parent 2 Email'] || '',
    // Address
    address: row['Address'] || row['Address Line'] || '',
    city: row['City'] || '',
    zipcode: row['Zipcode'] || row['Zip Code'] || ''
  }));
}

/**
 * Example usage with CSV data
 */
const exampleStudentData = [
  {
    'First Name': 'Abanob',
    'Last Name': 'Bakheet',
    'Date of Birth': '2010-08-05',
    'Phone': '951-429-2464',
    'Email': '',
    'Grade': '9th',
    'Parent 1 Full Name': 'Ibrahim Bakheet',
    'Parent 1 Phone Number': '951-429-2464',
    'Parent 1 Email': 'beboabi2019@gmail.com',
    'Responsible Servant': 'Mariam'
  }
  // ... more students
];

const migratedStudents = migrateStudents(exampleStudentData);
console.log('Migrated Students:', migratedStudents);


// ==========================================
// ATTENDANCE DATA MIGRATION
// ==========================================

/**
 * Converts Excel attendance data to app format
 * Source: "Attendance 2025-2026" sheet
 */
function migrateAttendance(excelData, studentLookup) {
  const attendanceRecords = [];
  
  excelData.forEach((row, studentIndex) => {
    const studentName = `${row['First Name']} ${row['Last Name']}`;
    const student = studentLookup[studentName];
    
    if (!student) return;
    
    // Loop through date columns
    Object.keys(row).forEach(key => {
      if (key.includes('2025') || key.includes('2026')) {
        const value = row[key];
        if (value && value !== 'Fri' && value !== 'Sat') {
          attendanceRecords.push({
            id: attendanceRecords.length + 1,
            studentId: student.id,
            date: formatDate(key),
            present: value.toLowerCase().includes('p') || value === 'x',
            day: getDayFromDate(key)
          });
        }
      }
    });
  });
  
  return attendanceRecords;
}

function formatDate(dateString) {
  // Convert "2025-10-24 00:00:00" to "2025-10-24"
  return dateString.split(' ')[0];
}

function getDayFromDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDay();
  return day === 5 ? 'Friday' : 'Saturday';
}


// ==========================================
// SERVANTS PREP DATA MIGRATION
// ==========================================

/**
 * Converts Excel course results to app format
 * Source: "Class Results" sheet
 */
function migrateCourseProgress(excelData, studentLookup) {
  const courseProgress = [];
  
  const courseMapping = {
    'Dogma 1': 7,
    'Dogma 2': 1,
    'Spirituality': 2,
    'Liturgical Studies': 4,
    'Patristics': 5,
    'Apologetics': 6,
    'New Testament': 7,
    'Old Testament': 8,
    'Church History': 9,
    'Comparative': 10
  };
  
  excelData.forEach((row) => {
    const studentName = row['Name/class'];
    const student = studentLookup[studentName];
    
    if (!student) return;
    
    Object.keys(courseMapping).forEach(courseName => {
      const status = row[courseName];
      let statusValue = 'not-started';
      
      if (status && status.toLowerCase().includes('pass')) {
        statusValue = 'passed';
      } else if (status && status.toLowerCase().includes('progress')) {
        statusValue = 'in-progress';
      } else if (status && status.toLowerCase().includes('complete')) {
        statusValue = 'completed';
      }
      
      courseProgress.push({
        studentId: student.id,
        courseId: courseMapping[courseName],
        status: statusValue,
        grade: status || ''
      });
    });
  });
  
  return courseProgress;
}


// ==========================================
// VISITATION DATA MIGRATION
// ==========================================

/**
 * Converts Excel visitation data to app format
 * Source: "visitation plan" sheet
 */
function migrateVisitations(excelData, studentLookup) {
  return excelData.map((row, index) => {
    const studentName = `${row['First Name']} ${row['Last Name']}`;
    const student = studentLookup[studentName];
    
    return {
      id: index + 1,
      studentId: student?.id || null,
      studentName: studentName,
      address: row['Address Line'] || '',
      city: row['City'] || '',
      zipcode: row['Zip Code'] || '',
      phone: row['Mobile Phone'] || '',
      visitationGroup: row['visitaion gp'] || row['visitation gp'] || '',
      dateScheduled: row['date of visit'] || '',
      completedBy: row['servants completed the visit'] || '',
      notes: row['notes'] || '',
      status: row['servants completed the visit'] ? 'completed' : 'pending'
    };
  });
}


// ==========================================
// SERVICE ROTATIONS MIGRATION
// ==========================================

/**
 * Converts Excel service rotation data to app format
 * Source: "Service Rotations" sheet
 */
function migrateServiceRotations(excelData) {
  return excelData.map((row, index) => ({
    id: index + 1,
    date: row['Date'] || '',
    day: row['Day'] || '',
    service: row['Service'] || '',
    volunteers: row['Volunteers'] || ''
  }));
}


// ==========================================
// TEACHING SCHEDULE MIGRATION
// ==========================================

/**
 * Converts Excel teaching schedule to app format
 * Source: "teaching schedule" sheet
 */
function migrateTeachingSchedule(excelData) {
  const schedule = [];
  
  excelData.forEach((row, index) => {
    // Friday sessions
    if (row['Fridays']) {
      schedule.push({
        id: schedule.length + 1,
        date: row['Fridays'],
        day: 'Friday',
        servant: row['Servant'] || '',
        topic: row['class'] || '',
        notes: ''
      });
    }
    
    // Saturday sessions
    if (row['saturdays']) {
      schedule.push({
        id: schedule.length + 1,
        date: row['saturdays'],
        day: 'Saturday',
        servant: row['Servant 2'] || '',
        topic: row['class 2'] || '',
        notes: ''
      });
    }
  });
  
  return schedule;
}


// ==========================================
// COMPLETE MIGRATION FUNCTION
// ==========================================

/**
 * Main migration function - orchestrates all migrations
 */
async function migrateAllData(excelSheets) {
  console.log('Starting data migration...');
  
  // 1. Migrate students first (needed for lookups)
  const students = migrateStudents(excelSheets.students);
  const studentLookup = {};
  students.forEach(student => {
    studentLookup[`${student.firstName} ${student.lastName}`] = student;
  });
  
  // 2. Migrate attendance
  const attendance = migrateAttendance(excelSheets.attendance, studentLookup);
  
  // 3. Migrate course progress
  const courseProgress = migrateCourseProgress(excelSheets.courseResults, studentLookup);
  
  // 4. Migrate visitations
  const visitations = migrateVisitations(excelSheets.visitations, studentLookup);
  
  // 5. Migrate service rotations
  const serviceRotations = migrateServiceRotations(excelSheets.serviceRotations);
  
  // 6. Migrate teaching schedule
  const teachingSchedule = migrateTeachingSchedule(excelSheets.teachingSchedule);
  
  console.log('Migration complete!');
  
  return {
    students,
    attendance,
    courseProgress,
    visitations,
    serviceRotations,
    teachingSchedule
  };
}


// ==========================================
// EXPORT TO LOCALSTORAGE
// ==========================================

/**
 * Save migrated data to browser localStorage
 */
function saveToLocalStorage(migratedData) {
  localStorage.setItem('yms_students', JSON.stringify(migratedData.students));
  localStorage.setItem('yms_attendance', JSON.stringify(migratedData.attendance));
  localStorage.setItem('yms_courseProgress', JSON.stringify(migratedData.courseProgress));
  localStorage.setItem('yms_visitations', JSON.stringify(migratedData.visitations));
  localStorage.setItem('yms_serviceRotations', JSON.stringify(migratedData.serviceRotations));
  localStorage.setItem('yms_teachingSchedule', JSON.stringify(migratedData.teachingSchedule));
  
  console.log('Data saved to localStorage successfully!');
}


// ==========================================
// EXPORT TO JSON FILES
// ==========================================

/**
 * Export migrated data as downloadable JSON files
 */
function exportToJSON(migratedData) {
  Object.keys(migratedData).forEach(key => {
    const dataStr = JSON.stringify(migratedData[key], null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${key}.json`;
    link.click();
  });
  
  console.log('JSON files downloaded!');
}


// ==========================================
// USAGE INSTRUCTIONS
// ==========================================

/*
HOW TO USE THIS SCRIPT:

1. PREPARE YOUR DATA:
   - Export each Excel sheet to CSV format
   - Use a library like PapaParse to read CSV files in JavaScript

2. LOAD THE DATA:
   <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
   
   Papa.parse(csvFile, {
     header: true,
     complete: function(results) {
       const excelSheets = {
         students: results.data,
         attendance: attendanceResults.data,
         // ... other sheets
       };
       
       migrateAllData(excelSheets).then(migratedData => {
         saveToLocalStorage(migratedData);
         // OR
         exportToJSON(migratedData);
       });
     }
   });

3. IN YOUR REACT APP:
   Update the initial state to load from localStorage:
   
   const [students, setStudents] = useState(() => {
     const saved = localStorage.getItem('yms_students');
     return saved ? JSON.parse(saved) : initialStudents;
   });

4. BACKUP YOUR DATA:
   Always keep your original Excel file as backup!
*/

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    migrateStudents,
    migrateAttendance,
    migrateCourseProgress,
    migrateVisitations,
    migrateServiceRotations,
    migrateTeachingSchedule,
    migrateAllData,
    saveToLocalStorage,
    exportToJSON
  };
}
