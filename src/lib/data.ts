export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  year: number;
  email: string;
  phone: string;
  avatar?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface AlertNotification {
  id: string;
  studentId: string;
  type: 'low-attendance' | 'motivation';
  message: string;
  timestamp: string;
  read: boolean;
}

export const DEPARTMENTS = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'] as const;

export const MOTIVATIONAL_QUOTES = [
  "🌟 Your 100% attendance speaks volumes about your dedication!",
  "🔥 Consistency is the key to success — keep showing up!",
  "💪 Champions are made by showing up every single day!",
  "🏆 Perfect attendance — you're setting the standard!",
  "⭐ Discipline today, success tomorrow. Keep it up!",
  "🎯 Your commitment to attendance reflects your commitment to excellence!",
  "🚀 100% attendance — you're on the launchpad to greatness!",
  "💎 Every day you show up, you invest in your future!",
];

const generateStudents = (): Student[] => {
  const firstNames = ['Aarav', 'Priya', 'Rohan', 'Ananya', 'Vikram', 'Sneha', 'Arjun', 'Kavya', 'Aditya', 'Meera', 'Rahul', 'Ishita', 'Dev', 'Nisha', 'Karan', 'Pooja', 'Siddharth', 'Riya', 'Manish', 'Divya', 'Amit', 'Sakshi', 'Nikhil', 'Tanvi'];
  const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Reddy', 'Joshi', 'Verma', 'Nair', 'Das', 'Rao', 'Mehta'];

  return firstNames.map((first, i) => ({
    id: `STU${String(i + 1).padStart(3, '0')}`,
    name: `${first} ${lastNames[i % lastNames.length]}`,
    rollNumber: `${2024}${String(i + 1).padStart(4, '0')}`,
    department: DEPARTMENTS[i % DEPARTMENTS.length],
    year: (i % 4) + 1,
    email: `${first.toLowerCase()}@college.edu`,
    phone: `+91 ${Math.floor(7000000000 + Math.random() * 3000000000)}`,
  }));
};

const generateAttendance = (students: Student[]): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();

  students.forEach((student) => {
    // Different attendance patterns
    const idx = parseInt(student.id.replace('STU', ''));
    let presentProb: number;

    if (idx <= 4) presentProb = 1.0; // 100% attendance
    else if (idx <= 8) presentProb = 0.95;
    else if (idx <= 14) presentProb = 0.82;
    else if (idx <= 18) presentProb = 0.68; // Below 70%
    else if (idx <= 21) presentProb = 0.55; // Well below 70%
    else presentProb = 0.75;

    for (let d = 0; d < 30; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - d);
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      const rand = Math.random();
      records.push({
        id: `ATT-${student.id}-${d}`,
        studentId: student.id,
        date: date.toISOString().split('T')[0],
        status: rand < presentProb ? 'present' : rand < presentProb + 0.05 ? 'late' : 'absent',
      });
    }
  });

  return records;
};

export const students: Student[] = generateStudents();
export const attendanceRecords: AttendanceRecord[] = generateAttendance(students);

export function getAttendancePercentage(studentId: string): number {
  const records = attendanceRecords.filter(r => r.studentId === studentId);
  if (records.length === 0) return 0;
  const present = records.filter(r => r.status === 'present' || r.status === 'late').length;
  return Math.round((present / records.length) * 100);
}

export function getStudentAlerts(): AlertNotification[] {
  const alerts: AlertNotification[] = [];

  students.forEach((student) => {
    const pct = getAttendancePercentage(student.id);

    if (pct < 70) {
      alerts.push({
        id: `ALERT-LOW-${student.id}`,
        studentId: student.id,
        type: 'low-attendance',
        message: `⚠️ ${student.name}'s attendance is at ${pct}% — below the 70% threshold. Immediate action required.`,
        timestamp: new Date().toISOString(),
        read: false,
      });
    } else if (pct === 100) {
      const quote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
      alerts.push({
        id: `ALERT-MOT-${student.id}`,
        studentId: student.id,
        type: 'motivation',
        message: `${quote} — Keep going, ${student.name}!`,
        timestamp: new Date().toISOString(),
        read: false,
      });
    }
  });

  return alerts;
}

export function getDepartmentStats() {
  return DEPARTMENTS.map(dept => {
    const deptStudents = students.filter(s => s.department === dept);
    const avgAttendance = deptStudents.reduce((sum, s) => sum + getAttendancePercentage(s.id), 0) / deptStudents.length;
    return { department: dept, students: deptStudents.length, avgAttendance: Math.round(avgAttendance) };
  });
}

export function getWeeklyTrend() {
  const today = new Date();
  const days: { day: string; present: number; absent: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    const dateStr = date.toISOString().split('T')[0];
    const dayRecords = attendanceRecords.filter(r => r.date === dateStr);
    days.push({
      day: date.toLocaleDateString('en', { weekday: 'short' }),
      present: dayRecords.filter(r => r.status === 'present' || r.status === 'late').length,
      absent: dayRecords.filter(r => r.status === 'absent').length,
    });
  }
  return days;
}
