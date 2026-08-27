"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TooltipContext = React.createContext<TooltipContextType | undefined>(undefined);

export function TooltipProvider({ children }: { children: React.ReactNode; delayDuration?: number }) {
  return <>{children}</>;
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div
        className="relative inline-flex"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </div>
    </TooltipContext.Provider>
  );
}

export function TooltipTrigger({
  children,
  asChild,
  ...props
}: {
  children: React.ReactNode;
  asChild?: boolean;
  [key: string]: any;
}) {
  return <>{children}</>;
}

export function TooltipContent({
  className,
  children,
  side = "top",
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  [key: string]: any;
}) {
  const context = React.useContext(TooltipContext);
  if (!context?.open) return null;

  const sideClasses =
    side === "bottom"
      ? "top-full mt-1.5 left-1/2 -translate-x-1/2"
      : side === "left"
      ? "right-full mr-1.5 top-1/2 -translate-y-1/2"
      : side === "right"
      ? "left-full ml-1.5 top-1/2 -translate-y-1/2"
      : "bottom-full mb-1.5 left-1/2 -translate-x-1/2";

  return (
    <div
      className={cn(
        "absolute z-50 pointer-events-none whitespace-nowrap rounded-md border border-border bg-popover px-2.5 py-1 text-[11px] font-medium text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
        sideClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
