import { motion } from "framer-motion";
import { LayoutDashboard, Users, CalendarCheck, Bell, BarChart3, Sparkles } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/students", icon: Users, label: "Students" },
  { to: "/attendance", icon: CalendarCheck, label: "Attendance" },
  { to: "/alerts", icon: Bell, label: "Alerts" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-sidebar border-r border-sidebar-border p-4">
      <div className="flex items-center gap-3 px-3 mb-10 mt-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center glow-primary" style={{ background: 'var(--gradient-primary)' }}>
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold text-foreground">AttendAI</h1>
          <p className="text-xs text-muted-foreground">Smart Attendance</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink key={item.to} to={item.to}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      <div className="glass-card p-4 mt-4">
        <p className="text-xs text-muted-foreground">AI-Powered System</p>
        <p className="text-xs text-muted-foreground mt-1">Monitoring 24 students across 5 departments</p>
      </div>
    </aside>
  );
}
