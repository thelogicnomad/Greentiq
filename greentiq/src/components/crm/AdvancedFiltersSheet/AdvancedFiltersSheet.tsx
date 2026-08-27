import React, { useState } from "react";
import { FilterState, CustomerStatus, SavedFilter } from "@/types";
import { AdvancedFiltersSheetProps } from "./AdvancedFiltersSheet.type";
import { StatusFilterGroup } from "@/components/crm/StatusFilterGroup";
import { CompanyMultiSelect } from "@/components/crm/CompanyMultiSelect";
import { DateRangeFilter } from "@/components/crm/DateRangeFilter";
import { SaveFilterForm } from "@/components/crm/SaveFilterForm";
import { SavedFilterList } from "@/components/crm/SavedFilterList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  useSavedFilters,
  useDeleteSavedFilter,
  useReorderSavedFilters,
} from "@/hooks/useSavedFilters";
import { X, Filter, BookmarkPlus, RotateCcw, Info } from "lucide-react";

export function AdvancedFiltersSheet({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  availableCompanies,
  activeFilterCount,
}: AdvancedFiltersSheetProps) {
  const [draftFilters, setDraftFilters] = useState<FilterState>(filters);
  const [activeSavedFilterId, setActiveSavedFilterId] = useState<string | undefined>(undefined);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const { data: savedFilters = [], isLoading: isLoadingSavedFilters } = useSavedFilters();
  const deleteSavedFilterMutation = useDeleteSavedFilter();
  const reorderSavedFiltersMutation = useReorderSavedFilters();

  React.useEffect(() => {
    setDraftFilters(filters);
  }, [filters, isOpen]);

  const handleStatusToggle = (status: CustomerStatus) => {
    setDraftFilters((prev) => {
      const current = prev.status || [];
      const updated = current.includes(status)
        ? current.filter((s) => s !== status)
        : [...current, status];
      return { ...prev, status: updated };
    });
    setActiveSavedFilterId(undefined);
  };

  const handleCompanyToggle = (company: string) => {
    setDraftFilters((prev) => {
      const current = prev.companies || [];
      const isSelected = current.includes(company);
      const updated = isSelected
        ? current.filter((c) => c !== company)
        : [...current, company];
      return { ...prev, companies: updated };
    });
    setActiveSavedFilterId(undefined);
  };

  const handleCompanyRemove = (company: string) => {
    setDraftFilters((prev) => {
      const current = prev.companies || [];
      return { ...prev, companies: current.filter((c) => c !== company) };
    });
    setActiveSavedFilterId(undefined);
  };

  const handleClearAll = () => {
    const emptyFilters: FilterState = {
      status: [],
      companies: [],
      dateFrom: undefined,
      dateTo: undefined,
      phoneContains: undefined,
      emailContains: undefined,
    };
    setDraftFilters(emptyFilters);
    setActiveSavedFilterId(undefined);
    onApplyFilters(emptyFilters);
  };

  const handleApply = () => {
    onApplyFilters(draftFilters);
    onClose();
  };

  const handleApplySavedFilter = (savedFilter: SavedFilter) => {
    setDraftFilters(savedFilter.filters);
    setActiveSavedFilterId(savedFilter.id);
    onApplyFilters(savedFilter.filters);
  };

  const handleDeleteSavedFilter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSavedFilterMutation.mutate(id);
    if (activeSavedFilterId === id) {
      setActiveSavedFilterId(undefined);
    }
  };

  const handleReorderSavedFilters = (orderedIds: string[]) => {
    reorderSavedFiltersMutation.mutate(orderedIds);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Sidebar Panel */}
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full sm:w-[380px] flex-col border-l border-border bg-card text-card-foreground shadow-2xl transition-all animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Filters</h3>
            {activeFilterCount > 0 && (
              <Badge variant="default" className="bg-primary text-primary-foreground font-bold border-none">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="mr-1 h-3.5 w-3.5" /> Clear All
              </Button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 sm:space-y-6">
          {/* Save Filter Preset Bar */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-3">
            <div className="flex items-center space-x-1.5 min-w-0">
              <span className="text-xs text-foreground font-medium truncate">Save filter combination?</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="text-muted-foreground hover:text-foreground p-0.5 shrink-0">
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs text-xs space-y-1 z-50">
                  <p className="font-semibold border-b border-border/50 pb-1 mb-1">How Saved Filters Work:</p>
                  <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-muted-foreground">
                    <li>Set your desired filter criteria</li>
                    <li>Click <strong>Save Filter</strong> button</li>
                    <li>Enter a descriptive name</li>
                    <li>Access & reorder anytime from the list below</li>
                  </ol>
                </TooltipContent>
              </Tooltip>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSaveModalOpen(true)}
              className="h-7 text-xs border-border bg-background text-foreground shrink-0"
            >
              <BookmarkPlus className="mr-1 h-3.5 w-3.5 text-primary" /> Save Filter
            </Button>
          </div>

          {/* 1. Status Filter Group */}
          <StatusFilterGroup
            selectedStatuses={draftFilters.status || []}
            onStatusToggle={handleStatusToggle}
          />

          {/* 2. Company Multi-Select */}
          <CompanyMultiSelect
            availableCompanies={availableCompanies}
            selectedCompanies={draftFilters.companies || []}
            onCompanyToggle={handleCompanyToggle}
            onCompanyRemove={handleCompanyRemove}
          />

          {/* 3. Date Range Filter */}
          <DateRangeFilter
            dateFrom={draftFilters.dateFrom}
            dateTo={draftFilters.dateTo}
            onDateFromChange={(df) => {
              setDraftFilters((prev) => ({ ...prev, dateFrom: df }));
              setActiveSavedFilterId(undefined);
            }}
            onDateToChange={(dt) => {
              setDraftFilters((prev) => ({ ...prev, dateTo: dt }));
              setActiveSavedFilterId(undefined);
            }}
          />

          {/* 4. Phone Partial Match Input */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Phone Number Contains
            </label>
            <Input
              type="text"
              placeholder="(555) 123-4567"
              value={draftFilters.phoneContains || ""}
              onChange={(e) => {
                setDraftFilters((prev) => ({
                  ...prev,
                  phoneContains: e.target.value || undefined,
                }));
                setActiveSavedFilterId(undefined);
              }}
              className="text-xs text-foreground bg-background border-input"
            />
          </div>

          {/* 5. Email Partial Match Input */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email Contains
            </label>
            <Input
              type="text"
              placeholder="@company.com"
              value={draftFilters.emailContains || ""}
              onChange={(e) => {
                setDraftFilters((prev) => ({
                  ...prev,
                  emailContains: e.target.value || undefined,
                }));
                setActiveSavedFilterId(undefined);
              }}
              className="text-xs text-foreground bg-background border-input"
            />
          </div>

          {/* 6. Saved Filter Presets */}
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Saved Filters
              </label>
              <span className="text-[10px] text-muted-foreground">Drag to reorder</span>
            </div>

            {isLoadingSavedFilters ? (
              <div className="space-y-2">
                <div className="h-8 rounded-lg bg-muted animate-pulse" />
                <div className="h-8 rounded-lg bg-muted animate-pulse" />
              </div>
            ) : savedFilters.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No saved filters yet.</p>
            ) : (
              <SavedFilterList
                filters={savedFilters}
                activeSavedFilterId={activeSavedFilterId}
                onApply={handleApplySavedFilter}
                onDelete={handleDeleteSavedFilter}
                onReorder={handleReorderSavedFilters}
              />
            )}
          </div>
        </div>

        {/* Footer Apply Button */}
        <div className="border-t border-border p-4 bg-muted/40 backdrop-blur-xs">
          <Button onClick={handleApply} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs">
            Apply Filters
          </Button>
        </div>
      </aside>

      {/* Save Filter Preset Modal */}
      <SaveFilterForm
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        filters={draftFilters}
      />
    </>
  );
}
