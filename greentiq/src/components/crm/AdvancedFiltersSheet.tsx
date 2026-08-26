import React, { useState } from "react";
import { FilterState, CustomerStatus, SavedFilter } from "@/types";
import { STATUSES } from "@/lib/api/seed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { SavedFilterList } from "./SavedFilterList";
import {
  useSavedFilters,
  useAddSavedFilter,
  useDeleteSavedFilter,
  useReorderSavedFilters,
} from "@/hooks/useSavedFilters";
import { X, Filter, BookmarkPlus, RotateCcw, Search, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface AdvancedFiltersSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (newFilters: FilterState) => void;
  availableCompanies: string[];
  activeFilterCount: number;
}

export function AdvancedFiltersSheet({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  availableCompanies,
  activeFilterCount,
}: AdvancedFiltersSheetProps) {
  // Local transient state for live adjustments before apply (or real-time)
  const [draftFilters, setDraftFilters] = useState<FilterState>(filters);
  const [activeSavedFilterId, setActiveSavedFilterId] = useState<string | undefined>(undefined);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");
  const [companySearch, setCompanySearch] = useState("");

  const { data: savedFilters = [], isLoading: isLoadingSavedFilters } = useSavedFilters();
  const addSavedFilterMutation = useAddSavedFilter();
  const deleteSavedFilterMutation = useDeleteSavedFilter();
  const reorderSavedFiltersMutation = useReorderSavedFilters();

  // Sync draft filters when open or props change
  React.useEffect(() => {
    setDraftFilters(filters);
  }, [filters, isOpen]);

  // Handle status checkbox toggle
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

  // Handle company multi-select
  const handleCompanySelect = (company: string) => {
    setDraftFilters((prev) => {
      const current = prev.companies || [];
      if (current.includes(company)) return prev;
      return { ...prev, companies: [...current, company] };
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

  // Clear all filters
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

  // Apply current draft filters
  const handleApply = () => {
    onApplyFilters(draftFilters);
    onClose();
  };

  // Apply saved filter combination
  const handleApplySavedFilter = (savedFilter: SavedFilter) => {
    setDraftFilters(savedFilter.filters);
    setActiveSavedFilterId(savedFilter.id);
    onApplyFilters(savedFilter.filters);
  };

  // Save current filter as preset
  const handleSavePreset = async () => {
    if (!newPresetName.trim()) return;
    await addSavedFilterMutation.mutateAsync({
      name: newPresetName.trim(),
      isPinned: false,
      filters: draftFilters,
    });
    setNewPresetName("");
    setIsSaveModalOpen(false);
  };

  // Delete saved filter preset
  const handleDeleteSavedFilter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSavedFilterMutation.mutate(id);
    if (activeSavedFilterId === id) {
      setActiveSavedFilterId(undefined);
    }
  };

  // Reorder saved filter presets via dnd-kit
  const handleReorderSavedFilters = (orderedIds: string[]) => {
    reorderSavedFiltersMutation.mutate(orderedIds);
  };

  if (!isOpen) return null;

  const filteredCompanyOptions = availableCompanies.filter((c) =>
    c.toLowerCase().includes(companySearch.toLowerCase())
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Sidebar Panel */}
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-800/80 bg-slate-900 shadow-2xl transition-all animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-blue-400" />
            <h3 className="text-base font-semibold text-slate-100">Filters</h3>
            {activeFilterCount > 0 && (
              <Badge variant="default" className="bg-blue-600 font-bold">
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
                className="h-8 text-xs text-slate-400 hover:text-slate-200"
              >
                <RotateCcw className="mr-1 h-3.5 w-3.5" /> Clear All
              </Button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Action: Save current filter preset */}
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <span className="text-xs text-slate-300 font-medium">Save current combination?</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSaveModalOpen(true)}
              className="h-7 text-xs border-slate-700 bg-slate-900"
            >
              <BookmarkPlus className="mr-1 h-3.5 w-3.5 text-blue-400" /> Save Filter
            </Button>
          </div>

          {/* 1. Status Checkboxes */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Status
            </label>
            <div className="space-y-2.5 rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5">
              {STATUSES.map((status) => {
                const isChecked = (draftFilters.status || []).includes(status);
                return (
                  <label
                    key={status}
                    className="flex cursor-pointer items-center space-x-3 text-sm text-slate-200 hover:text-white"
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleStatusToggle(status)}
                    />
                    <span className="capitalize">{status}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 2. Company Multi-Select Dropdown */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Company
            </label>
            {/* Selected Chips */}
            {draftFilters.companies && draftFilters.companies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {draftFilters.companies.map((comp) => (
                  <span
                    key={comp}
                    className="inline-flex items-center space-x-1 rounded-md bg-blue-500/15 border border-blue-500/30 px-2 py-1 text-xs text-blue-300"
                  >
                    <span>{comp}</span>
                    <button
                      onClick={() => handleCompanyRemove(comp)}
                      className="text-blue-400 hover:text-white ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Dropdown Menu for selecting companies */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-950/60 px-3 text-xs text-slate-300 hover:border-slate-600 focus:outline-none">
                  <span>Select Companies...</span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 bg-slate-900 border-slate-800 text-slate-200 p-2">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 mb-2 px-1">
                  <Search className="h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search company..."
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {filteredCompanyOptions.map((comp) => {
                    const isSelected = (draftFilters.companies || []).includes(comp);
                    return (
                      <DropdownMenuItem
                        key={comp}
                        onClick={() => handleCompanySelect(comp)}
                        className={`text-xs cursor-pointer ${
                          isSelected ? "bg-slate-800 text-blue-400 font-semibold" : ""
                        }`}
                      >
                        {comp}
                      </DropdownMenuItem>
                    );
                  })}
                  {filteredCompanyOptions.length === 0 && (
                    <div className="p-2 text-center text-xs text-slate-500">No companies found</div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 3. Last Contact Date Range */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Date Range (Last Contact)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-400 mb-1 block">From</span>
                <Input
                  type="date"
                  value={draftFilters.dateFrom || ""}
                  onChange={(e) => {
                    setDraftFilters((prev) => ({
                      ...prev,
                      dateFrom: e.target.value || undefined,
                    }));
                    setActiveSavedFilterId(undefined);
                  }}
                  className="text-xs text-slate-200 bg-slate-950/60"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 mb-1 block">To</span>
                <Input
                  type="date"
                  value={draftFilters.dateTo || ""}
                  onChange={(e) => {
                    setDraftFilters((prev) => ({
                      ...prev,
                      dateTo: e.target.value || undefined,
                    }));
                    setActiveSavedFilterId(undefined);
                  }}
                  className="text-xs text-slate-200 bg-slate-950/60"
                />
              </div>
            </div>
          </div>

          {/* 4. Phone Partial Match Input */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
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
              className="text-xs text-slate-200 bg-slate-950/60"
            />
          </div>

          {/* 5. Email Partial Match Input */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
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
              className="text-xs text-slate-200 bg-slate-950/60"
            />
          </div>

          {/* 6. Saved Filter Presets (with dnd-kit reordering) */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Saved Filters
              </label>
              <span className="text-[10px] text-slate-500">Drag to reorder</span>
            </div>

            {isLoadingSavedFilters ? (
              <div className="space-y-2">
                <div className="h-8 rounded-lg bg-slate-800/40 animate-pulse" />
                <div className="h-8 rounded-lg bg-slate-800/40 animate-pulse" />
              </div>
            ) : savedFilters.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No saved filters yet.</p>
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
        <div className="border-t border-slate-800 p-4 bg-slate-950/80 backdrop-blur-xs">
          <Button onClick={handleApply} className="w-full bg-blue-600 hover:bg-blue-500 font-medium">
            Apply Filters
          </Button>
        </div>
      </aside>

      {/* Save Filter Modal */}
      <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-slate-100">Save Filter Combination</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <label className="text-xs font-medium text-slate-300">Filter Preset Name</label>
            <Input
              type="text"
              placeholder="e.g. Q3 Tech Prospect Leads"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              className="bg-slate-950 border-slate-800 text-slate-100"
            />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsSaveModalOpen(false)}
              className="text-slate-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePreset}
              disabled={!newPresetName.trim() || addSavedFilterMutation.isPending}
              className="bg-blue-600 hover:bg-blue-500"
            >
              Save Preset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
