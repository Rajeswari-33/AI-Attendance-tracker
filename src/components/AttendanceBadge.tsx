import { getAttendancePercentage } from "@/lib/data";

interface AttendanceBadgeProps {
  studentId: string;
  percentage?: number;
}

export default function AttendanceBadge({ studentId, percentage }: AttendanceBadgeProps) {
  const pct = percentage ?? getAttendancePercentage(studentId);

  let classes: string;
  if (pct === 100) classes = "bg-success/15 text-success border-success/30";
  else if (pct >= 85) classes = "bg-primary/15 text-primary border-primary/30";
  else if (pct >= 70) classes = "bg-warning/15 text-warning border-warning/30";
  else classes = "bg-destructive/15 text-destructive border-destructive/30";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${classes}`}>
      {pct}%
    </span>
  );
}
