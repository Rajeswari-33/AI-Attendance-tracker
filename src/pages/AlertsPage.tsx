import { motion } from "framer-motion";
import { Bell, AlertTriangle, Sparkles, Send } from "lucide-react";
import { useState } from "react";
import { getStudentAlerts, students, getAttendancePercentage, MOTIVATIONAL_QUOTES } from "@/lib/data";
import { toast } from "sonner";

export default function AlertsPage() {
  const alerts = getStudentAlerts();
  const [filter, setFilter] = useState<'all' | 'low-attendance' | 'motivation'>('all');
  const [sentAlerts, setSentAlerts] = useState<Set<string>>(new Set());

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.type === filter);

  const sendAlert = (alertId: string, studentName: string, type: string) => {
    setSentAlerts(prev => new Set(prev).add(alertId));
    toast.success(
      type === 'low-attendance'
        ? `⚠️ Low attendance alert sent to ${studentName}`
        : `🌟 Motivational message sent to ${studentName}`
    );
  };

  const sendAllAlerts = (type: 'low-attendance' | 'motivation') => {
    const toSend = alerts.filter(a => a.type === type && !sentAlerts.has(a.id));
    toSend.forEach(a => {
      const student = students.find(s => s.id === a.studentId);
      if (student) sendAlert(a.id, student.name, type);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" /> AI Alerts & Notifications
          </h1>
          <p className="text-sm text-muted-foreground">AI-generated alerts based on attendance patterns</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => sendAllAlerts('low-attendance')} className="px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors flex items-center gap-1">
            <Send className="w-3 h-3" /> Send All Warnings
          </button>
          <button onClick={() => sendAllAlerts('motivation')} className="px-3 py-2 rounded-lg bg-success/10 text-success text-xs font-medium hover:bg-success/20 transition-colors flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Send All Motivation
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {(['all', 'low-attendance', 'motivation'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              filter === f ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {f === 'all' ? 'All' : f === 'low-attendance' ? '⚠️ Low Attendance' : '🌟 Motivation'}
            <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-border text-[10px]">
              {f === 'all' ? alerts.length : alerts.filter(a => a.type === f).length}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((alert, i) => {
          const student = students.find(s => s.id === alert.studentId);
          const pct = student ? getAttendancePercentage(student.id) : 0;
          const isSent = sentAlerts.has(alert.id);

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                alert.type === 'low-attendance' ? 'border-l-2 border-l-destructive' : 'border-l-2 border-l-success'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  alert.type === 'low-attendance' ? 'bg-destructive/15' : 'bg-success/15'
                }`}>
                  {alert.type === 'low-attendance' ? <AlertTriangle className="w-4 h-4 text-destructive" /> : <Sparkles className="w-4 h-4 text-success" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{student?.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {student?.department} · Year {student?.year} · Attendance: {pct}%
                  </p>
                </div>
              </div>
              <button
                onClick={() => student && sendAlert(alert.id, student.name, alert.type)}
                disabled={isSent}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 flex items-center gap-1 ${
                  isSent
                    ? 'bg-secondary text-muted-foreground cursor-default'
                    : alert.type === 'low-attendance'
                      ? 'bg-destructive/15 text-destructive hover:bg-destructive/25'
                      : 'bg-success/15 text-success hover:bg-success/25'
                }`}
              >
                {isSent ? '✓ Sent' : <><Send className="w-3 h-3" /> Send</>}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
