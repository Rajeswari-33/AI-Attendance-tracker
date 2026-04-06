import { motion } from "framer-motion";
import { CalendarCheck, Check, X, Clock } from "lucide-react";
import { useState } from "react";
import { students, attendanceRecords, DEPARTMENTS } from "@/lib/data";

export default function AttendancePage() {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [deptFilter, setDeptFilter] = useState("");
  const [markedToday, setMarkedToday] = useState<Record<string, 'present' | 'absent' | 'late'>>({});

  const filtered = students.filter(s => !deptFilter || s.department === deptFilter);

  const getStatus = (studentId: string) => {
    if (markedToday[studentId]) return markedToday[studentId];
    const record = attendanceRecords.find(r => r.studentId === studentId && r.date === selectedDate);
    return record?.status || null;
  };

  const markAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setMarkedToday(prev => ({ ...prev, [studentId]: status }));
  };

  const statusIcon = (status: string | null) => {
    if (status === 'present') return <Check className="w-4 h-4 text-success" />;
    if (status === 'absent') return <X className="w-4 h-4 text-destructive" />;
    if (status === 'late') return <Clock className="w-4 h-4 text-warning" />;
    return <span className="w-4 h-4 rounded-full border border-border" />;
  };

  const presentCount = filtered.filter(s => getStatus(s.id) === 'present' || getStatus(s.id) === 'late').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <CalendarCheck className="w-6 h-6 text-primary" /> Mark Attendance
        </h1>
        <p className="text-sm text-muted-foreground">Record daily attendance for students</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="px-4 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <div className="text-sm text-muted-foreground ml-auto">
          Present: <span className="text-success font-semibold">{presentCount}</span> / {filtered.length}
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Department</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, i) => {
                const status = getStatus(student.id);
                return (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{student.department}</td>
                    <td className="px-4 py-3 text-center">{statusIcon(status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {(['present', 'late', 'absent'] as const).map(s => (
                          <button
                            key={s}
                            onClick={() => markAttendance(student.id, s)}
                            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                              status === s
                                ? s === 'present' ? 'bg-success/20 text-success' : s === 'late' ? 'bg-warning/20 text-warning' : 'bg-destructive/20 text-destructive'
                                : 'bg-secondary text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </button>
                        ))}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
