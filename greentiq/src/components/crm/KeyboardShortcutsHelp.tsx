import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";

interface KeyboardShortcutsHelpProps {
  onToggleFilters: () => void;
  onFocusSearch: () => void;
  onOpenAddModal: () => void;
}

export function KeyboardShortcutsHelp({
  onToggleFilters,
  onFocusSearch,
  onOpenAddModal,
}: KeyboardShortcutsHelpProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K -> Focus Search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onFocusSearch();
      }
      // Cmd+F or Ctrl+F -> Toggle Filters
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        onToggleFilters();
      }
      // Shift+A -> Add Customer
      if (e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        onOpenAddModal();
      }
      // ? -> Keyboard shortcuts dialog
      if (e.key === "?" && !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onToggleFilters, onFocusSearch, onOpenAddModal]);

  const shortcuts = [
    { key: "Cmd + K", description: "Focus search bar" },
    { key: "Cmd + F", description: "Toggle advanced filters panel" },
    { key: "Shift + A", description: "Open Add Customer modal" },
    { key: "?", description: "Show keyboard shortcuts reference" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader>
          <div className="flex items-center space-x-2 text-blue-400 mb-1">
            <Keyboard className="h-5 w-5" />
            <DialogTitle className="text-base font-bold text-slate-100">Keyboard Shortcuts</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-2 py-2">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs"
            >
              <span className="text-slate-300">{s.description}</span>
              <kbd className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-400">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
