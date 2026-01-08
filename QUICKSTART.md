# 🚀 QUICK START GUIDE

## Get Started in 60 Seconds!

### Step 1: Download the Files
You should have these files:
- `index.html` - The main entry point
- `youth-ministry-app.jsx` - The application code
- `README.md` - Full documentation
- `DEPLOYMENT.md` - Deployment options
- `data-migration.js` - Excel data migration
- `package.json` - For npm deployment

### Step 2: Open the App
**Option A - Easiest (Double-Click):**
1. Double-click `index.html`
2. The app opens in your browser
3. Start using immediately! ✨

**Option B - For Development:**
1. Create a new folder for your project
2. Move all files into that folder
3. Open terminal/command prompt in that folder
4. Run: `npx serve`
5. Open browser to the URL shown (usually http://localhost:3000)

### Step 3: Start Using the App

#### Navigation Menu (Left Sidebar):
- **Dashboard** - Overview and statistics
- **Students** - Manage student records
- **Attendance** - Mark Friday/Saturday attendance
- **Servants Prep** - Track course progress
- **Service Rotations** - Schedule volunteers
- **Visitations** - Plan and track home visits

#### Quick Actions:

**Add a Student:**
1. Click "Students" in sidebar
2. Click "+ Add Student" button (top right)
3. Fill in student information
4. Click "Create Student"

**Mark Attendance:**
1. Click "Attendance" in sidebar
2. Select today's date
3. Choose Friday or Saturday
4. Click "Present" or "Absent" for each student

**Track Course Progress:**
1. Click "Servants Prep" in sidebar
2. Select a student from the left panel
3. Update course status in dropdowns

---

## 📊 Importing Your Excel Data

### Quick Import Steps:

1. Open your Excel file (`HS_2025-2026.xlsx`)
2. Export each sheet to CSV:
   - File → Save As → CSV (Comma delimited)
   - Do this for: "Class 2526", "Attendance 2025-2026", etc.

3. Open `data-migration.js` in a text editor
4. Follow the instructions in the comments
5. Run the migration script to import your data

**OR** - Manual Entry:
- Use the "+ Add Student" button to enter students one by one
- Use the attendance page to mark attendance
- Gradually build up your database

---

## 🎨 Features at a Glance

### Dashboard
- See total active students
- View graduate count
- Check average attendance
- See pending visitations
- Quick action buttons

### Students Management
- Search students by name
- Filter by grade (9th, 10th, 11th, 12th)
- View student cards with contact info
- Edit or delete students
- See responsible servant assignments

### Attendance Tracking
- Choose date with calendar picker
- Select Friday or Saturday
- One-click attendance marking
- Visual feedback (green = present, red = absent)
- Automatic attendance history

### Servants Preparation
- 10 core courses tracked
- Status options: Not Started, In Progress, Completed, Passed
- Individual student progress view
- Course categories for organization

### Service Rotations
- Calendar view of assignments
- Multiple service types
- Volunteer scheduling
- Date and role tracking

### Visitations
- Student visitation cards
- Address and contact tracking
- Status indicators (Pending/Completed)
- Schedule visit dates
- Track which servants completed visits

---

## 🔑 Default Features

**Data Storage:**
- Currently uses browser localStorage
- Data persists between sessions
- Automatic saving on all changes

**Search & Filter:**
- Real-time search as you type
- Filter students by grade
- Easy navigation

**Responsive Design:**
- Works on desktop computers
- Adapts to tablets
- Mobile-friendly interface

---

## ⚡ Pro Tips

1. **Regular Backups:**
   - Export your data weekly
   - Keep your Excel file as backup initially

2. **Training:**
   - Have one servant test it first
   - Train others before full rollout
   - Start with attendance tracking (easiest)

3. **Data Entry:**
   - Start with current year students only
   - Add historical data gradually
   - Verify critical info (phone, parents)

4. **Best Practices:**
   - Mark attendance same day
   - Update course progress weekly
   - Schedule visitations monthly
   - Review dashboard regularly

---

## 🆘 Need Help?

**Problem:** App won't open
- **Solution:** Make sure `index.html` and `youth-ministry-app.jsx` are in the same folder

**Problem:** Data disappears
- **Solution:** Don't use incognito/private browsing mode. Enable cookies and localStorage.

**Problem:** Looks strange or broken
- **Solution:** Use a modern browser (Chrome, Firefox, Safari, Edge). Update to latest version.

**Problem:** Can't find a feature
- **Solution:** Check the navigation menu on the left. All features are there!

---

## 📱 Mobile Usage

The app works on mobile devices!
- Open in Safari (iOS) or Chrome (Android)
- Works in mobile browser
- Responsive layout adjusts automatically
- Can add to home screen for app-like experience

**Add to Home Screen:**
- **iOS:** Safari → Share → Add to Home Screen
- **Android:** Chrome → Menu → Add to Home Screen

---

## 🎯 Your First 5 Minutes

1. **Open `index.html`** (double-click)
2. **Click "Students"** in the left menu
3. **Click "+ Add Student"** 
4. **Add 2-3 test students** with made-up data
5. **Click "Attendance"**
6. **Mark attendance** for your test students
7. **Click "Dashboard"** to see the overview
8. **Explore** the other sections!

Congratulations! You're now familiar with the basics. 🎉

---

## 📚 Next Steps

After getting comfortable:

1. Read `README.md` for full documentation
2. Check `DEPLOYMENT.md` for hosting options
3. Use `data-migration.js` to import Excel data
4. Customize colors/branding if desired
5. Train your servant team
6. Go live!

---

## 💡 Remember

- **Save Often:** Changes are auto-saved
- **Test First:** Try with sample data before real data
- **Ask Questions:** Check documentation or ask for help
- **Have Fun:** This tool is here to make ministry easier! 😊

---

**Welcome to the Youth Ministry Management System!**

You're all set to start managing your high school ministry more effectively. The interface is intuitive, so explore and discover all the features.

God bless your ministry! ✝️
