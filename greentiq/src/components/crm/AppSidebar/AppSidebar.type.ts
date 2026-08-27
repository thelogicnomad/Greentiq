export interface AppSidebarProps {
  activeTab: "dashboard" | "contacts" | "deals" | "tasks" | "settings";
  onTabChange: (tab: "dashboard" | "contacts" | "deals" | "tasks" | "settings") => void;
}
