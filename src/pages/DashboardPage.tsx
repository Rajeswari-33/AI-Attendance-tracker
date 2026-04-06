import { motion } from "framer-motion";
import { Users, UserCheck, UserX, AlertTriangle, Trophy, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import StatCard from "@/components/StatCard";
import AttendanceBadge from "@/components/AttendanceBadge";
import { students, getAttendancePercentage, getStudentAlerts, getDepartmentStats, getWeeklyTrend } from "@/lib/data";

const CHART_COLORS = ['hsl(160,84%,39%)', 'hsl(199,89%,48%)', 'hsl(38,92%,50%)', 'hsl(0,72%,51%)', 'hsl(280,70%,50%)'];

export default function DashboardPage() {
  const alerts = getStudentAlerts();
  const lowAlerts = alerts.filter(a => a.type === 'low-attendance');
  const motivationAlerts = alerts.filter(a => a.type === 'motivation');
  const weeklyData = getWeeklyTrend();
  const deptStats = getDepartmentStats();

  const totalPresent = students.filter(s => getAttendancePercentage(s.id) >= 70).length;
  const avgAttendance = Math.round(students.reduce((s, st) => s + getAttendancePercentage(st.id), 0) / students.length);

  const topStudents = students
    .map(s => ({ ...s, pct: getAttendancePercentage(s.id) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);

  const pieData = deptStats.map(d => ({ name: d.department.split(' ')[0], value: d.avgAttendance }));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-2">
        <h1 className="text-2xl font-display font-bold text-foreground">Welcome back, Admin</h1>
        <p className="text-sm text-muted-foreground">Here's your attendance overview for today</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={students.length} subtitle="Across 5 departments" icon={<Users className="w-5 h-5 text-primary-foreground" />} delay={0} />
        <StatCard title="Avg Attendance" value={`${avgAttendance}%`} subtitle="Last 30 days" icon={<TrendingUp className="w-5 h-5 text-primary-foreground" />} gradient="var(--gradient-primary)" delay={0.1} />
        <StatCard title="Low Attendance" value={lowAlerts.length} subtitle="Below 70% threshold" icon={<AlertTriangle className="w-5 h-5 text-warning-foreground" />} gradient="var(--gradient-danger)" delay={0.2} />
        <StatCard title="Perfect Attendance" value={motivationAlerts.length} subtitle="100% — Stars!" icon={<Trophy className="w-5 h-5 text-success-foreground" />} gradient="var(--gradient-success)" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5 lg:col-span-2">
          <h3 className="font-display font-semibold text-foreground mb-4">Weekly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" stroke="hsl(215,20%,55%)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(215,20%,55%)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(222,44%,9%)', border: '1px solid hsl(222,30%,16%)', borderRadius: 8, color: 'hsl(210,40%,96%)' }} />
              <Bar dataKey="present" fill="hsl(160,84%,39%)" radius={[4, 4, 0, 0]} name="Present" />
              <Bar dataKey="absent" fill="hsl(0,72%,51%)" radius={[4, 4, 0, 0]} name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Department Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Dept. Attendance</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" stroke="none">
                {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(222,44%,9%)', border: '1px solid hsl(222,30%,16%)', borderRadius: 8, color: 'hsl(210,40%,96%)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {pieData.map((d, i) => (
              <span key={d.name} className="text-[10px] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: CHART_COLORS[i] }} />
                <span className="text-muted-foreground">{d.name}</span>
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Performers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-warning" /> Top Performers
          </h3>
          <div className="space-y-3">
            {topStudents.map((s, i) => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-secondary text-secondary-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.department}</p>
                  </div>
                </div>
                <AttendanceBadge studentId={s.id} percentage={s.pct} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Alerts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-5">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" /> Recent Alerts
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {alerts.slice(0, 6).map(alert => (
              <div key={alert.id} className={`p-3 rounded-lg text-xs ${
                alert.type === 'low-attendance' ? 'bg-destructive/10 border border-destructive/20' : 'bg-success/10 border border-success/20'
              }`}>
                <p className={alert.type === 'low-attendance' ? 'text-destructive' : 'text-success'}>{alert.message}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
