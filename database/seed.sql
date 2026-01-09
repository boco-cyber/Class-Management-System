-- Seed data for Youth Ministry Management System

INSERT OR IGNORE INTO courses (id, name, category, displayOrder) VALUES
  (1, 'Dogma 1', 'Theology', 1),
  (2, 'Dogma 2', 'Theology', 2),
  (3, 'Spirituality', 'Spiritual Life', 3),
  (4, 'Liturgical Studies', 'Worship', 4),
  (5, 'Patristics', 'Church Fathers', 5),
  (6, 'Apologetics', 'Apologetics', 6),
  (7, 'New Testament', 'Scripture', 7),
  (8, 'Old Testament', 'Scripture', 8),
  (9, 'Church History', 'History', 9),
  (10, 'Comparative Religion', 'Comparative', 10);

INSERT OR IGNORE INTO serviceTypes (id, name, description, displayOrder) VALUES
  (1, 'Altar Service', 'Serving at the altar', 1),
  (2, 'Ushers', 'Greeting and seating', 2),
  (3, 'Scripture Reading', 'Readings during service', 3),
  (4, 'Offering Collection', 'Collect offerings', 4),
  (5, 'Multimedia/Tech', 'Audio, video, and slides', 5),
  (6, 'Children''s Ministry', 'Serving younger kids', 6),
  (7, 'Setup/Cleanup', 'Prepare and reset spaces', 7);

INSERT OR IGNORE INTO settings (key, value, category, description) VALUES
  ('churchName', 'Youth Ministry', 'General', 'Displayed church or ministry name'),
  ('ministryYear', '2025-2026', 'General', 'Current ministry year'),
  ('attendanceThreshold', '60', 'Attendance', 'Low attendance threshold percent'),
  ('requiredServiceHours', '40', 'Graduation', 'Service hours required for graduation'),
  ('sessionTimeoutMinutes', '30', 'Security', 'Auto logout timeout'),
  ('failedLoginThreshold', '5', 'Security', 'Failed attempts before lockout');
