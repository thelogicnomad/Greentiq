import React from "react";
import Image from "next/image";
import { LayoutDashboard, Users, Briefcase, CheckSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
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
    <aside className="w-64 shrink-0 border-r border-border bg-card p-5 text-card-foreground hidden md:flex md:flex-col justify-between h-screen sticky top-0 transition-colors duration-200">
      <div className="space-y-8">
        {/* Greentiq Brand Logo */}
        <div className="px-2 pt-1 flex items-center">
          <Image
            src="/greentiq-logo.png"
            alt="Greentiq Logo"
            width={140}
            height={38}
            className="h-9 w-auto object-contain"
            priority
          />
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
                  <span className="ml-auto text-[10px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                    Coming soon
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
