import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Search, Filter, Plus, Keyboard, Users, ShieldAlert } from "lucide-react";

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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K -> Open Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
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
      // ? -> Open Command Palette
      if (e.key === "?" && !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onToggleFilters, onOpenAddModal]);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Palette"
      className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl animate-in fade-in-0 zoom-in-95 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center border-b border-slate-800 px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
        <Command.Input
          placeholder="Type a command or search action (e.g. search, filter, add)..."
          className="flex h-11 w-full rounded-md bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
        />
      </div>
      <Command.List className="max-h-[300px] overflow-y-auto p-2 text-slate-200">
        <Command.Empty className="py-6 text-center text-xs text-slate-500">
          No matching command found.
        </Command.Empty>

        <Command.Group heading="Quick Actions" className="px-2 py-1.5 text-xs font-semibold text-slate-400">
          <Command.Item
            onSelect={() => {
              setOpen(false);
              onFocusSearch();
            }}
            className="flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-xs hover:bg-slate-800 hover:text-white"
          >
            <Search className="mr-2 h-4 w-4 text-blue-400" />
            <span>Focus Search Input</span>
            <kbd className="ml-auto font-mono text-[10px] text-slate-400">Cmd + K</kbd>
          </Command.Item>

          <Command.Item
            onSelect={() => {
              setOpen(false);
              onToggleFilters();
            }}
            className="flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-xs hover:bg-slate-800 hover:text-white"
          >
            <Filter className="mr-2 h-4 w-4 text-emerald-400" />
            <span>Toggle Advanced Filters Panel</span>
            <kbd className="ml-auto font-mono text-[10px] text-slate-400">Cmd + F</kbd>
          </Command.Item>

          <Command.Item
            onSelect={() => {
              setOpen(false);
              onOpenAddModal();
            }}
            className="flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-xs hover:bg-slate-800 hover:text-white"
          >
            <Plus className="mr-2 h-4 w-4 text-purple-400" />
            <span>Add New Customer</span>
            <kbd className="ml-auto font-mono text-[10px] text-slate-400">Shift + A</kbd>
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
