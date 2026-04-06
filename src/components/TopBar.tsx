import { Bell, Menu, Sparkles } from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { getStudentAlerts } from "@/lib/data";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/students", label: "Students" },
  { to: "/attendance", label: "Attendance" },
  { to: "/alerts", label: "Alerts" },
  { to: "/analytics", label: "Analytics" },
];

export default function TopBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const alerts = getStudentAlerts();
  const unread = alerts.filter(a => !a.read).length;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-3 lg:hidden">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-muted-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">AttendAI</span>
          </div>
        </div>

        <div className="hidden lg:block">
          <h2 className="text-lg font-display font-semibold text-foreground">
            {navItems.find(n => n.to === location.pathname)?.label || 'Dashboard'}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <NavLink to="/alerts" className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </NavLink>
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-secondary text-sm font-semibold text-secondary-foreground">
            A
          </div>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden border-t border-border bg-background p-3 flex flex-col gap-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                location.pathname === item.to ? "bg-primary/10 text-primary" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
