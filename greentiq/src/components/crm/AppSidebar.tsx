import React from "react";
import { LayoutDashboard, Users, Briefcase, CheckSquare, Settings, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

interface AppSidebarProps {
  activeTab: "dashboard" | "contacts" | "deals" | "tasks" | "settings";
  onTabChange: (tab: "dashboard" | "contacts" | "deals" | "tasks" | "settings") => void;
}

interface NavItem {
  id: "dashboard" | "contacts" | "deals" | "tasks" | "settings";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, disabled: false },
    { id: "contacts", label: "Contacts", icon: Users, disabled: false },
    { id: "deals", label: "Deals", icon: Briefcase, disabled: true },
    { id: "tasks", label: "Tasks", icon: CheckSquare, disabled: true },
    { id: "settings", label: "Settings", icon: Settings, disabled: true },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800/80 bg-slate-950 p-4 text-slate-300 hidden md:flex md:flex-col justify-between h-screen sticky top-0 dark:border-slate-800 dark:bg-slate-950">
      <div className="space-y-6">
        {/* User Profile Header */}
        <div className="flex items-center space-x-3 px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white text-sm shadow-md">
            AR
          </div>
          <div className="flex-1 overflow-hidden">
            <h4 className="text-sm font-semibold text-slate-100 truncate">Alex R.</h4>
            <p className="text-xs text-slate-400 truncate">CRM Admin</p>
          </div>
          <button className="text-slate-400 hover:text-slate-200 transition-colors">
            <Bell className="h-4 w-4" />
          </button>
        </div>

        {/* Theme Toggle Button */}
        <div className="px-2">
          <ThemeToggle />
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isDisabled = Boolean(item.disabled);
            return (
              <button
                key={item.id}
                onClick={() => !isDisabled && onTabChange(item.id)}
                disabled={isDisabled}
                className={cn(
                  "flex w-full items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-800/90 text-blue-400 border border-slate-700/60 shadow-sm"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200",
                  isDisabled && "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-slate-400"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-blue-400" : "text-slate-400")} />
                <span>{item.label}</span>
                {isDisabled && (
                  <span className="ml-auto text-[10px] uppercase font-semibold text-slate-600 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                    Static
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-800/80 pt-4 px-2">
        <div className="rounded-lg bg-slate-900/60 border border-slate-800/80 p-3 text-xs text-slate-400">
          <p className="font-medium text-slate-300">Advanced CRM v1.0</p>
          <p className="mt-1 text-[11px]">TanStack Query v5 + Mock API</p>
        </div>
      </div>
    </aside>
  );
}
