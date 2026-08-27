import React, { useState } from "react";
import Image from "next/image";
import { Bell, Plus } from "lucide-react";
import { currentUser } from "@/lib/mock-user";
import { getInitials } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { TopNavbarProps } from "./TopNavbar.type";

export function TopNavbar({ user = currentUser, onOpenAddModal, className = "" }: TopNavbarProps) {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(user.name);

  return (
    <header className={`sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-4 sm:px-8 shadow-xs backdrop-blur-md transition-colors duration-200 ${className}`}>
      {/* Left side branding (Visible on mobile/tablet) */}
      <div className="flex items-center space-x-3">
        <div className="md:hidden flex items-center space-x-2">
          <Image
            src="/greentiq-logo.png"
            alt="Greentiq CRM"
            width={120}
            height={32}
            className="h-7 w-auto object-contain"
            priority
          />
        </div>
        <div className="hidden md:block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace / Contacts
          </span>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Mobile Add Customer Shortcut */}
        {onOpenAddModal && (
          <Button
            size="sm"
            onClick={onOpenAddModal}
            className="md:hidden h-8 bg-primary text-primary-foreground hover:bg-primary/90 text-xs px-2.5"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        )}

        {/* Theme Toggle Icon Button */}
        <ThemeToggle />

        {/* Notifications Icon Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Bell className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Notifications</TooltipContent>
        </Tooltip>

        {/* User Profile Block */}
        <div className="flex items-center space-x-2.5 border-l border-border pl-3 sm:pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full overflow-hidden border border-border bg-primary font-bold text-primary-foreground text-xs shadow-xs shrink-0">
            {user.avatarUrl && !imageError ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                onError={() => setImageError(true)}
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-foreground leading-tight">{user.name}</span>
            <span className="text-[10px] font-medium text-muted-foreground leading-tight">{user.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
