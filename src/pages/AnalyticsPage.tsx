import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend } from "recharts";
import { students, getAttendancePercentage, getDepartmentStats, getWeeklyTrend } from "@/lib/data";

export default function AnalyticsPage() {
  const deptStats = getDepartmentStats();
  const weeklyData = getWeeklyTrend();

  const distribution = [
    { range: '90-100%', count: students.filter(s => getAttendancePercentage(s.id) >= 90).length },
    { range: '80-89%', count: students.filter(s => { const p = getAttendancePercentage(s.id); return p >= 80 && p < 90; }).length },
    { range: '70-79%', count: students.filter(s => { const p = getAttendancePercentage(s.id); return p >= 70 && p < 80; }).length },
    { range: '<70%', count: students.filter(s => getAttendancePercentage(s.id) < 70).length },
  ];

  const radarData = deptStats.map(d => ({ subject: d.department.split(' ')[0], attendance: d.avgAttendance, fullMark: 100 }));

  const tooltipStyle = { background: 'hsl(222,44%,9%)', border: '1px solid hsl(222,30%,16%)', borderRadius: 8, color: 'hsl(210,40%,96%)' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" /> Analytics
        </h1>
        <p className="text-sm text-muted-foreground">Deep insights into attendance patterns</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Department Comparison</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deptStats} layout="vertical">
              <XAxis type="number" domain={[0, 100]} stroke="hsl(215,20%,55%)" fontSize={12} tickLine={false} />
              <YAxis type="category" dataKey="department" width={100} stroke="hsl(215,20%,55%)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => v.split(' ')[0]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="avgAttendance" fill="hsl(160,84%,39%)" radius={[0, 4, 4, 0]} name="Avg %" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Attendance Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={distribution}>
              <XAxis dataKey="range" stroke="hsl(215,20%,55%)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(215,20%,55%)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Students">
                {distribution.map((_, i) => {
                  const fills = ['hsl(160,84%,39%)', 'hsl(199,89%,48%)', 'hsl(38,92%,50%)', 'hsl(0,72%,51%)'];
                  return <Bar key={i} dataKey="count" fill={fills[i]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Weekly Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <XAxis dataKey="day" stroke="hsl(215,20%,55%)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(215,20%,55%)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="present" stroke="hsl(160,84%,39%)" strokeWidth={2} dot={{ r: 4, fill: 'hsl(160,84%,39%)' }} name="Present" />
              <Line type="monotone" dataKey="absent" stroke="hsl(0,72%,51%)" strokeWidth={2} dot={{ r: 4, fill: 'hsl(0,72%,51%)' }} name="Absent" />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Department Radar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(222,30%,16%)" />
              <PolarAngleAxis dataKey="subject" stroke="hsl(215,20%,55%)" fontSize={11} />
              <Radar name="Attendance" dataKey="attendance" stroke="hsl(160,84%,39%)" fill="hsl(160,84%,39%)" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
