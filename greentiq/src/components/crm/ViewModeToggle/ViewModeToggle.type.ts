export interface ViewModeToggleProps {
  viewMode: "table" | "card";
  onViewModeChange: (mode: "table" | "card") => void;
  className?: string;
}
