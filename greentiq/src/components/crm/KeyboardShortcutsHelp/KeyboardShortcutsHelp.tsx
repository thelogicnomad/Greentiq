import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Search, Filter, Plus } from "lucide-react";
import { KeyboardShortcutsHelpProps } from "./KeyboardShortcutsHelp.type";

export function KeyboardShortcutsHelp({
  onToggleFilters,
  onFocusSearch,
  onOpenAddModal,
}: KeyboardShortcutsHelpProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      // Prevent shortcut triggers when typing inside inputs, textareas, or open dialogs
      if (
        target &&
        (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
          target.isContentEditable ||
          target.closest("[role='dialog']"))
      ) {
        return;
      }

      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (isCmdOrCtrl && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (isCmdOrCtrl && e.key.toLowerCase() === "f") {
        e.preventDefault();
        onToggleFilters();
      } else if (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        onOpenAddModal();
      } else if (e.key === "?") {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onToggleFilters, onFocusSearch, onOpenAddModal]);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Palette"
      className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl animate-in fade-in-0 zoom-in-95"
    >
      <div className="flex items-center border-b border-border px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
        <Command.Input
          placeholder="Type a command or search action (e.g. search, filter, add)..."
          className="flex h-11 w-full rounded-md bg-transparent text-sm text-popover-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>
      <Command.List className="max-h-[300px] overflow-y-auto p-2 text-popover-foreground">
        <Command.Empty className="py-6 text-center text-xs text-muted-foreground">
          No matching command found.
        </Command.Empty>

        <Command.Group heading="Quick Actions" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
          <Command.Item
            onSelect={() => {
              setOpen(false);
              onFocusSearch();
            }}
            className="flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-xs hover:bg-accent hover:text-accent-foreground"
          >
            <Search className="mr-2 h-4 w-4 text-primary" />
            <span>Focus Search Input</span>
            <kbd className="ml-auto font-mono text-[10px] text-muted-foreground">Cmd + K</kbd>
          </Command.Item>

          <Command.Item
            onSelect={() => {
              setOpen(false);
              onToggleFilters();
            }}
            className="flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-xs hover:bg-accent hover:text-accent-foreground"
          >
            <Filter className="mr-2 h-4 w-4 text-emerald-500" />
            <span>Toggle Advanced Filters Panel</span>
            <kbd className="ml-auto font-mono text-[10px] text-muted-foreground">Cmd + F</kbd>
          </Command.Item>

          <Command.Item
            onSelect={() => {
              setOpen(false);
              onOpenAddModal();
            }}
            className="flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-xs hover:bg-accent hover:text-accent-foreground"
          >
            <Plus className="mr-2 h-4 w-4 text-purple-500" />
            <span>Add New Customer</span>
            <kbd className="ml-auto font-mono text-[10px] text-muted-foreground">Cmd + Shift + A</kbd>
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
