import React, { useState, useEffect } from 'react';
import { Calendar, Users, BookOpen, CheckSquare, MapPin, UserCheck, Settings, Home, Bell, Search, Download, Upload, Plus, Edit2, Trash2, Eye, Filter, X, Save, ChevronDown, ChevronRight, Clock, Mail, Phone, Award, Activity } from 'lucide-react';
import './App.css';

// Custom hook for localStorage persistence
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

// Initial data structure based on the Excel file
const initialStudents = [
  {
    id: 1,
    firstName: 'Abanob',
    lastName: 'Bakheet',
    grade: '9th',
    phone: '951-429-2464',
    email: '',
    dob: '2010-08-05',
    responsibleServant: 'Mariam',
    status: 'Active',
    parent1Name: '',
    parent1Phone: '',
    parent1Email: '',
    parent2Name: '',
    parent2Phone: '',
    parent2Email: '',
    address: '',
    city: '',
    zipcode: ''
  },
  {
    id: 2,
    firstName: 'Abigail',
    lastName: 'Malak',
    grade: '10th',
    phone: '',
    email: '',
    dob: '',
    responsibleServant: 'Mariam',
    status: 'Active',
    parent1Name: '',
    parent1Phone: '',
    parent1Email: '',
    parent2Name: '',
    parent2Phone: '',
    parent2Email: '',
    address: '',
    city: '',
    zipcode: ''
  },
  {
    id: 3,
    firstName: 'Alexandra',
    lastName: 'Gerges',
    grade: '11th',
    phone: '',
    email: '',
    dob: '2008-08-22',
    responsibleServant: 'Mariam',
    status: 'Active',
    parent1Name: '',
    parent1Phone: '',
    parent1Email: '',
    parent2Name: '',
    parent2Phone: '',
    parent2Email: '',
    address: '',
    city: '',
    zipcode: ''
  },
  {
    id: 4,
    firstName: 'Andrew',
    lastName: 'Nabil',
    grade: '12th',
    phone: '',
    email: '',
    dob: '2009-07-28',
    responsibleServant: 'Nancy',
    status: 'Active',
    parent1Name: '',
    parent1Phone: '',
    parent1Email: '',
    parent2Name: '',
    parent2Phone: '',
    parent2Email: '',
    address: '',
    city: '',
    zipcode: ''
  },
  {
    id: 5,
    firstName: 'Angela',
    lastName: 'Moawad',
    grade: '9th',
    phone: '',
    email: '',
    dob: '2008-09-22',
    responsibleServant: 'Veronia',
    status: 'Active',
    parent1Name: '',
    parent1Phone: '',
    parent1Email: '',
    parent2Name: '',
    parent2Phone: '',
    parent2Email: '',
    address: '',
    city: '',
    zipcode: ''
  },
];

const initialAttendance = [];

const initialCourses = [
  { id: 1, name: 'Dogma 1', category: 'Theology' },
  { id: 2, name: 'Dogma 2', category: 'Theology' },
  { id: 3, name: 'Spirituality', category: 'Spiritual Life' },
  { id: 4, name: 'Liturgical Studies', category: 'Worship' },
  { id: 5, name: 'Patristics', category: 'Church Fathers' },
  { id: 6, name: 'Apologetics', category: 'Apologetics' },
  { id: 7, name: 'New Testament', category: 'Scripture' },
  { id: 8, name: 'Old Testament', category: 'Scripture' },
  { id: 9, name: 'Church History', category: 'History' },
  { id: 10, name: 'Comparative Religion', category: 'Comparative' },
];

const YouthMinistryApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [students, setStudents] = useLocalStorage('yms_students', initialStudents);
  const [attendance, setAttendance] = useLocalStorage('yms_attendance', initialAttendance);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [serviceRotations, setServiceRotations] = useLocalStorage('yms_serviceRotations', []);
  const [visitations, setVisitations] = useLocalStorage('yms_visitations', []);
  const [teachingSchedule, setTeachingSchedule] = useLocalStorage('yms_teachingSchedule', []);
  const [courseProgress, setCourseProgress] = useLocalStorage('yms_courseProgress', []);

  // Calculate statistics
  const stats = {
    totalStudents: students.filter(s => s.status === 'Active').length,
    totalGraduates: students.filter(s => s.status === 'Graduate').length,
    averageAttendance: 0,
    upcomingVisits: visitations.filter(v => !v.completed).length,
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || student.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  // Attendance marking
  const markAttendance = (studentId, present) => {
    const newRecord = {
      id: Date.now(),
      studentId,
      date: attendanceDate,
      present,
      day: new Date(attendanceDate).toLocaleDateString('en-US', { weekday: 'short' })
    };
    setAttendance([...attendance, newRecord]);
  };

  // Student CRUD operations
  const addStudent = (studentData) => {
    setStudents([...students, { ...studentData, id: Date.now() }]);
    setShowModal(false);
  };

  const updateStudent = (id, studentData) => {
    setStudents(students.map(s => s.id === id ? { ...s, ...studentData } : s));
    setShowModal(false);
    setSelectedStudent(null);
  };

  const deleteStudent = (id) => {
    if (confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  // Component: Dashboard
  const Dashboard = () => (
    <div className="dashboard-grid">
      <div className="stat-card stat-primary">
        <div className="stat-icon"><Users size={32} /></div>
        <div className="stat-content">
          <div className="stat-label">Active Students</div>
          <div className="stat-value">{stats.totalStudents}</div>
        </div>
      </div>
      
      <div className="stat-card stat-secondary">
        <div className="stat-icon"><Award size={32} /></div>
        <div className="stat-content">
          <div className="stat-label">Graduates</div>
          <div className="stat-value">{stats.totalGraduates}</div>
        </div>
      </div>
      
      <div className="stat-card stat-accent">
        <div className="stat-icon"><Activity size={32} /></div>
        <div className="stat-content">
          <div className="stat-label">Avg Attendance</div>
          <div className="stat-value">78%</div>
        </div>
      </div>
      
      <div className="stat-card stat-warning">
        <div className="stat-icon"><MapPin size={32} /></div>
        <div className="stat-content">
          <div className="stat-label">Pending Visits</div>
          <div className="stat-value">{stats.upcomingVisits}</div>
        </div>
      </div>

      <div className="dashboard-section recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <Clock size={16} />
            <span>Attendance marked for Friday service</span>
            <span className="activity-time">2 hours ago</span>
          </div>
          <div className="activity-item">
            <Users size={16} />
            <span>New student added: John Doe</span>
            <span className="activity-time">1 day ago</span>
          </div>
          <div className="activity-item">
            <MapPin size={16} />
            <span>Visitation completed: Smith Family</span>
            <span className="activity-time">2 days ago</span>
          </div>
        </div>
      </div>

      <div className="dashboard-section quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => setCurrentView('attendance')}>
            <CheckSquare size={20} />
            Mark Attendance
          </button>
          <button className="action-btn" onClick={() => { setShowModal(true); setSelectedStudent(null); }}>
            <Plus size={20} />
            Add Student
          </button>
          <button className="action-btn" onClick={() => setCurrentView('visitations')}>
            <MapPin size={20} />
            Schedule Visit
          </button>
          <button className="action-btn" onClick={() => setCurrentView('reports')}>
            <Download size={20} />
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );

  // Component: Students Management
  const StudentsView = () => (
    <div className="content-section">
      <div className="section-header">
        <h1>Students Management</h1>
        <button className="btn-primary" onClick={() => { setShowModal(true); setSelectedStudent(null); }}>
          <Plus size={18} /> Add Student
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)} className="filter-select">
          <option value="all">All Grades</option>
          <option value="9th">9th Grade</option>
          <option value="10th">10th Grade</option>
          <option value="11th">11th Grade</option>
          <option value="12th">12th Grade</option>
        </select>
      </div>

      <div className="students-grid">
        {filteredStudents.map(student => (
          <div key={student.id} className="student-card">
            <div className="student-header">
              <div className="student-avatar">
                {student.firstName[0]}{student.lastName[0]}
              </div>
              <div className="student-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3>{student.firstName} {student.lastName}</h3>
                  <span className={`status-badge status-${student.status?.toLowerCase() || 'active'}`}>
                    {student.status || 'Active'}
                  </span>
                </div>
                <p className="student-grade">{student.grade}</p>
              </div>
            </div>

            <div className="student-details">
              {student.phone && (
                <div className="detail-row">
                  <Phone size={14} />
                  <span>{student.phone}</span>
                </div>
              )}
              {student.email && (
                <div className="detail-row">
                  <Mail size={14} />
                  <span>{student.email}</span>
                </div>
              )}
              <div className="detail-row">
                <UserCheck size={14} />
                <span>{student.responsibleServant}</span>
              </div>
              {student.parent1Name && (
                <div className="detail-row" style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                  <Users size={14} />
                  <span style={{ fontSize: '0.8rem' }}>{student.parent1Name}</span>
                </div>
              )}
              {student.address && (
                <div className="detail-row">
                  <MapPin size={14} />
                  <span style={{ fontSize: '0.8rem' }}>{student.city || student.address}</span>
                </div>
              )}
            </div>
            
            <div className="student-actions">
              <button className="icon-btn" onClick={() => { setSelectedStudent(student); setCurrentView('studentDetail'); }}>
                <Eye size={16} />
              </button>
              <button className="icon-btn" onClick={() => { setSelectedStudent(student); setShowModal(true); }}>
                <Edit2 size={16} />
              </button>
              <button className="icon-btn danger" onClick={() => deleteStudent(student.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Component: Attendance Tracking
  const AttendanceView = () => {
    const [selectedDay, setSelectedDay] = useState('Friday');
    const todayAttendance = attendance.filter(a => a.date === attendanceDate);

    return (
      <div className="content-section">
        <div className="section-header">
          <h1>Attendance Tracking</h1>
          <div className="attendance-controls">
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="date-input"
            />
            <div className="day-toggle">
              <button
                className={selectedDay === 'Friday' ? 'active' : ''}
                onClick={() => setSelectedDay('Friday')}
              >
                Friday
              </button>
              <button
                className={selectedDay === 'Saturday' ? 'active' : ''}
                onClick={() => setSelectedDay('Saturday')}
              >
                Saturday
              </button>
            </div>
          </div>
        </div>

        <div className="attendance-list">
          {students.filter(s => s.status === 'Active').map(student => {
            const hasRecord = todayAttendance.find(a => a.studentId === student.id);
            return (
              <div key={student.id} className="attendance-row">
                <div className="student-name-col">
                  <div className="student-avatar-sm">
                    {student.firstName[0]}{student.lastName[0]}
                  </div>
                  <div>
                    <div className="student-name">{student.firstName} {student.lastName}</div>
                    <div className="student-grade-sm">{student.grade}</div>
                  </div>
                </div>
                
                <div className="attendance-actions">
                  <button
                    className={`attendance-btn ${hasRecord?.present === true ? 'present' : ''}`}
                    onClick={() => markAttendance(student.id, true)}
                  >
                    <CheckSquare size={18} />
                    Present
                  </button>
                  <button
                    className={`attendance-btn ${hasRecord?.present === false ? 'absent' : ''}`}
                    onClick={() => markAttendance(student.id, false)}
                  >
                    <X size={18} />
                    Absent
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Component: Servants Prep
  const ServantsPrep = () => {
    const [selectedStudent, setLocalStudent] = useState(null);
    const [courseProgress, setCourseProgress] = useState({});

    return (
      <div className="content-section">
        <div className="section-header">
          <h1>Servants Preparation Program</h1>
        </div>

        <div className="prep-layout">
          <div className="students-sidebar">
            <h3>Students</h3>
            {students.filter(s => s.status === 'Active').map(student => (
              <div
                key={student.id}
                className={`sidebar-student ${selectedStudent?.id === student.id ? 'active' : ''}`}
                onClick={() => setLocalStudent(student)}
              >
                <div className="student-avatar-sm">
                  {student.firstName[0]}{student.lastName[0]}
                </div>
                <span>{student.firstName} {student.lastName}</span>
              </div>
            ))}
          </div>

          <div className="courses-content">
            {selectedStudent ? (
              <>
                <div className="selected-student-header">
                  <h2>{selectedStudent.firstName} {selectedStudent.lastName}</h2>
                  <p>Servants Preparation Progress</p>
                </div>
                
                <div className="courses-grid">
                  {initialCourses.map(course => (
                    <div key={course.id} className="course-card">
                      <div className="course-header">
                        <h3>{course.name}</h3>
                        <span className="course-category">{course.category}</span>
                      </div>
                      <select className="course-status-select">
                        <option value="not-started">Not Started</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="passed">Passed</option>
                      </select>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-state">
                <BookOpen size={48} />
                <p>Select a student to view their course progress</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Component: Service Rotations
  const ServiceRotationsView = () => (
    <div className="content-section">
      <div className="section-header">
        <h1>Service Rotations</h1>
        <button className="btn-primary">
          <Plus size={18} /> Add Rotation
        </button>
      </div>
      
      <div className="rotations-calendar">
        <div className="calendar-header">
          <h3>October 2025</h3>
        </div>
        <div className="rotation-list">
          <div className="rotation-item">
            <div className="rotation-date">
              <div className="date-day">04</div>
              <div className="date-month">Oct</div>
            </div>
            <div className="rotation-details">
              <h4>Altar Service</h4>
              <p>Elijah Benjamin, Martin Kusto, Alexandra Gerges</p>
            </div>
          </div>
          <div className="rotation-item">
            <div className="rotation-date">
              <div className="date-day">11</div>
              <div className="date-month">Oct</div>
            </div>
            <div className="rotation-details">
              <h4>Ushers</h4>
              <p>Sandra Shonoda, Fady Said</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Component: Visitations
  const VisitationsView = () => (
    <div className="content-section">
      <div className="section-header">
        <h1>Visitations</h1>
        <button className="btn-primary">
          <Plus size={18} /> Schedule Visit
        </button>
      </div>

      <div className="visitations-grid">
        {students.slice(0, 6).map(student => (
          <div key={student.id} className="visitation-card">
            <div className="visitation-header">
              <h3>{student.firstName} {student.lastName}</h3>
              <span className="visit-status pending">Pending</span>
            </div>
            <div className="visitation-details">
              <div className="detail-row">
                <MapPin size={14} />
                <span>Address needed</span>
              </div>
              <div className="detail-row">
                <Calendar size={14} />
                <span>Not scheduled</span>
              </div>
            </div>
            <button className="btn-outline">Schedule Visit</button>
          </div>
        ))}
      </div>
    </div>
  );

  // Component: Student Modal
  const StudentModal = () => {
    const [formData, setFormData] = useState(selectedStudent || {
      firstName: '',
      lastName: '',
      grade: '9th',
      phone: '',
      email: '',
      dob: '',
      responsibleServant: '',
      status: 'Active',
      parent1Name: '',
      parent1Phone: '',
      parent1Email: '',
      parent2Name: '',
      parent2Phone: '',
      parent2Email: '',
      address: '',
      city: '',
      zipcode: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (selectedStudent) {
        updateStudent(selectedStudent.id, formData);
      } else {
        addStudent(formData);
      }
    };

    return (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{selectedStudent ? 'Edit Student' : 'Add New Student'}</h2>
            <button className="icon-btn" onClick={() => setShowModal(false)}>
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="student-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Grade *</label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  required
                >
                  <option value="9th">9th Grade</option>
                  <option value="10th">10th Grade</option>
                  <option value="11th">11th Grade</option>
                  <option value="12th">12th Grade</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Responsible Servant</label>
                <select
                  value={formData.responsibleServant}
                  onChange={(e) => setFormData({...formData, responsibleServant: e.target.value})}
                >
                  <option value="">Select Servant</option>
                  <option value="Veronia">Veronia</option>
                  <option value="Magda">Magda</option>
                  <option value="Kero">Kero Basely</option>
                  <option value="Nancy">Nancy</option>
                  <option value="Gerges">Gerges</option>
                  <option value="Mariam">Mariam</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Transferred">Transferred</option>
                </select>
              </div>
            </div>

            <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--primary)' }}>Parent 1 Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Parent 1 Name</label>
                <input
                  type="text"
                  value={formData.parent1Name}
                  onChange={(e) => setFormData({...formData, parent1Name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Parent 1 Phone</label>
                <input
                  type="tel"
                  value={formData.parent1Phone}
                  onChange={(e) => setFormData({...formData, parent1Phone: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Parent 1 Email</label>
              <input
                type="email"
                value={formData.parent1Email}
                onChange={(e) => setFormData({...formData, parent1Email: e.target.value})}
              />
            </div>

            <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--primary)' }}>Parent 2 Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Parent 2 Name</label>
                <input
                  type="text"
                  value={formData.parent2Name}
                  onChange={(e) => setFormData({...formData, parent2Name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Parent 2 Phone</label>
                <input
                  type="tel"
                  value={formData.parent2Phone}
                  onChange={(e) => setFormData({...formData, parent2Phone: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Parent 2 Email</label>
              <input
                type="email"
                value={formData.parent2Email}
                onChange={(e) => setFormData({...formData, parent2Email: e.target.value})}
              />
            </div>

            <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--primary)' }}>Address Information</h3>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Zipcode</label>
                <input
                  type="text"
                  value={formData.zipcode}
                  onChange={(e) => setFormData({...formData, zipcode: e.target.value})}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-outline" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Save size={18} />
                {selectedStudent ? 'Update' : 'Create'} Student
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">✝</div>
            <div className="logo-text">
              <div className="logo-title">Youth Ministry</div>
              <div className="logo-subtitle">HS 2025-2026</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </button>
          
          <button
            className={`nav-item ${currentView === 'students' ? 'active' : ''}`}
            onClick={() => setCurrentView('students')}
          >
            <Users size={20} />
            <span>Students</span>
          </button>
          
          <button
            className={`nav-item ${currentView === 'attendance' ? 'active' : ''}`}
            onClick={() => setCurrentView('attendance')}
          >
            <CheckSquare size={20} />
            <span>Attendance</span>
          </button>
          
          <button
            className={`nav-item ${currentView === 'servantsPrep' ? 'active' : ''}`}
            onClick={() => setCurrentView('servantsPrep')}
          >
            <BookOpen size={20} />
            <span>Servants Prep</span>
          </button>
          
          <button
            className={`nav-item ${currentView === 'rotations' ? 'active' : ''}`}
            onClick={() => setCurrentView('rotations')}
          >
            <Calendar size={20} />
            <span>Service Rotations</span>
          </button>
          
          <button
            className={`nav-item ${currentView === 'visitations' ? 'active' : ''}`}
            onClick={() => setCurrentView('visitations')}
          >
            <MapPin size={20} />
            <span>Visitations</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="header-left">
            <h1 className="page-title">
              {currentView === 'dashboard' && 'Dashboard'}
              {currentView === 'students' && 'Students'}
              {currentView === 'attendance' && 'Attendance'}
              {currentView === 'servantsPrep' && 'Servants Preparation'}
              {currentView === 'rotations' && 'Service Rotations'}
              {currentView === 'visitations' && 'Visitations'}
            </h1>
          </div>
          <div className="header-right">
            <button className="icon-btn">
              <Bell size={20} />
            </button>
            <div className="user-menu">
              <div className="user-avatar">AS</div>
            </div>
          </div>
        </header>

        <div className="content-wrapper">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'students' && <StudentsView />}
          {currentView === 'attendance' && <AttendanceView />}
          {currentView === 'servantsPrep' && <ServantsPrep />}
          {currentView === 'rotations' && <ServiceRotationsView />}
          {currentView === 'visitations' && <VisitationsView />}
        </div>
      </main>

      {showModal && <StudentModal />}
    </div>
  );
};

export default YouthMinistryApp;
