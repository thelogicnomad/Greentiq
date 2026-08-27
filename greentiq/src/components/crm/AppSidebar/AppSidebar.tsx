import React from "react";
import { LayoutDashboard, Users, Briefcase, CheckSquare, Settings, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppSidebarProps } from "./AppSidebar.type";

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
    <aside className="w-64 shrink-0 border-r border-border bg-card p-4 text-card-foreground hidden md:flex md:flex-col justify-between h-screen sticky top-0 transition-colors duration-200">
      <div className="space-y-6">
        {/* User Profile Header */}
        <div className="flex items-center space-x-3 px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground text-sm shadow-md">
            AR
          </div>
          <div className="flex-1 overflow-hidden">
            <h4 className="text-sm font-semibold text-foreground truncate">Alex R.</h4>
            <p className="text-xs text-muted-foreground truncate">CRM Admin</p>
          </div>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
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
                    ? "bg-accent text-primary border border-border shadow-xs"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                  isDisabled && "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                <span>{item.label}</span>
                {isDisabled && (
                  <span className="ml-auto text-[10px] uppercase font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                    Static
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border pt-4 px-2">
        <div className="rounded-lg bg-muted/50 border border-border p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Advanced CRM v1.0</p>
          <p className="mt-1 text-[11px]">TanStack Query v5 + Mock API</p>
        </div>
      </div>
    </aside>
  );
}
