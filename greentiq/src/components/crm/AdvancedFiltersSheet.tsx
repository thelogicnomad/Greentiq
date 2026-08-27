import React, { useState } from "react";
import { FilterState, CustomerStatus, SavedFilter } from "@/types";
import { STATUSES } from "@/lib/api/seed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { SavedFilterList } from "./SavedFilterList";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "@/lib/utils";
import { parseISO, isValid, format } from "date-fns";
import {
  useSavedFilters,
  useAddSavedFilter,
  useDeleteSavedFilter,
  useReorderSavedFilters,
} from "@/hooks/useSavedFilters";
import {
  X,
  Filter,
  BookmarkPlus,
  RotateCcw,
  Search,
  ChevronDown,
  Calendar as CalendarIcon,
  Info,
  Check,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
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
  const [draftFilters, setDraftFilters] = useState<FilterState>(filters);
  const [activeSavedFilterId, setActiveSavedFilterId] = useState<string | undefined>(undefined);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

  // Popover open states for From / To Date Pickers
  const [isDateFromOpen, setIsDateFromOpen] = useState(false);
  const [isDateToOpen, setIsDateToOpen] = useState(false);

  const { data: savedFilters = [], isLoading: isLoadingSavedFilters } = useSavedFilters();
  const addSavedFilterMutation = useAddSavedFilter();
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

  const filteredCompanyOptions = availableCompanies.filter((c) =>
    c.toLowerCase().includes(companySearch.toLowerCase())
  );

  const selectedCompaniesCount = draftFilters.companies?.length || 0;

  const parsedDateFrom = draftFilters.dateFrom ? parseISO(draftFilters.dateFrom) : undefined;
  const parsedDateTo = draftFilters.dateTo ? parseISO(draftFilters.dateTo) : undefined;

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
              <Badge variant="default" className="bg-primary text-primary-foreground font-bold">
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
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Save Filter Preset Bar */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-3">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-foreground font-medium">Save filter combination?</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="text-muted-foreground hover:text-foreground p-0.5">
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
              className="h-7 text-xs border-border bg-background text-foreground"
            >
              <BookmarkPlus className="mr-1 h-3.5 w-3.5 text-primary" /> Save Filter
            </Button>
          </div>

          {/* 1. Status Checkboxes */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </label>
            <div className="space-y-2.5 rounded-xl border border-border bg-muted/20 p-3.5">
              {STATUSES.map((status) => {
                const isChecked = (draftFilters.status || []).includes(status);
                return (
                  <label
                    key={status}
                    className="flex cursor-pointer items-center space-x-3 text-sm text-foreground hover:text-primary"
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
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Company
            </label>

            <Popover open={isCompanyDropdownOpen} onOpenChange={setIsCompanyDropdownOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 text-xs text-foreground hover:border-accent focus:outline-none"
                >
                  <span className="truncate">
                    {selectedCompaniesCount === 0
                      ? "Select Companies..."
                      : `${selectedCompaniesCount} company${selectedCompaniesCount > 1 ? "s" : ""} selected`}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="z-50 w-[310px] rounded-lg border border-border bg-popover text-popover-foreground p-2 shadow-xl"
              >
                <div className="flex items-center space-x-2 border-b border-border pb-2 mb-2 px-1">
                  <Search className="h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search company..."
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {filteredCompanyOptions.map((comp) => {
                    const isSelected = (draftFilters.companies || []).includes(comp);
                    return (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => handleCompanyToggle(comp)}
                        className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-xs text-left cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-accent text-primary font-semibold"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        <span className="truncate">{comp}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                  {filteredCompanyOptions.length === 0 && (
                    <div className="p-2 text-center text-xs text-muted-foreground">No companies found</div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {draftFilters.companies && draftFilters.companies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {draftFilters.companies.map((comp) => (
                  <span
                    key={comp}
                    className="inline-flex items-center space-x-1 rounded-md bg-accent border border-border px-2 py-0.5 text-xs text-foreground"
                  >
                    <span className="truncate max-w-[140px]">{comp}</span>
                    <button
                      type="button"
                      onClick={() => handleCompanyRemove(comp)}
                      className="text-muted-foreground hover:text-destructive ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 3. Date Range Fields (Exact Local Date Formatting via format(date, "yyyy-MM-dd")) */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Date Range (Last Contact)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Date From */}
              <div>
                <span className="text-[11px] text-muted-foreground mb-1 block">From</span>
                <Popover open={isDateFromOpen} onOpenChange={setIsDateFromOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-left font-normal text-xs h-9 border-input bg-background text-foreground px-3"
                    >
                      <span className="truncate">
                        {draftFilters.dateFrom ? formatDate(draftFilters.dateFrom, "MMM d, yyyy") : "Pick date"}
                      </span>
                      <CalendarIcon className="ml-auto h-4 w-4 text-muted-foreground shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="z-50 p-0 border-none bg-transparent">
                    <Calendar
                      selected={parsedDateFrom && isValid(parsedDateFrom) ? parsedDateFrom : undefined}
                      onSelect={(date) => {
                        setDraftFilters((prev) => ({
                          ...prev,
                          dateFrom: date ? format(date, "yyyy-MM-dd") : undefined,
                        }));
                        setActiveSavedFilterId(undefined);
                        setIsDateFromOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date To */}
              <div>
                <span className="text-[11px] text-muted-foreground mb-1 block">To</span>
                <Popover open={isDateToOpen} onOpenChange={setIsDateToOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-left font-normal text-xs h-9 border-input bg-background text-foreground px-3"
                    >
                      <span className="truncate">
                        {draftFilters.dateTo ? formatDate(draftFilters.dateTo, "MMM d, yyyy") : "Pick date"}
                      </span>
                      <CalendarIcon className="ml-auto h-4 w-4 text-muted-foreground shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="z-50 p-0 border-none bg-transparent">
                    <Calendar
                      selected={parsedDateTo && isValid(parsedDateTo) ? parsedDateTo : undefined}
                      onSelect={(date) => {
                        setDraftFilters((prev) => ({
                          ...prev,
                          dateTo: date ? format(date, "yyyy-MM-dd") : undefined,
                        }));
                        setActiveSavedFilterId(undefined);
                        setIsDateToOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

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
          <Button onClick={handleApply} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
            Apply Filters
          </Button>
        </div>
      </aside>

      {/* Save Filter Modal */}
      <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border text-card-foreground">
          <DialogHeader>
            <DialogTitle>Save Filter Combination</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <label className="text-xs font-medium text-foreground">Filter Preset Name</label>
            <Input
              type="text"
              placeholder="e.g. Q3 Tech Prospect Leads"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              className="bg-background border-input text-foreground"
            />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsSaveModalOpen(false)}
              className="text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePreset}
              disabled={!newPresetName.trim() || addSavedFilterMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save Preset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
