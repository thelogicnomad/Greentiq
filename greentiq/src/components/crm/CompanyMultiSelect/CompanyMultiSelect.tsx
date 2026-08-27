import React, { useState } from "react";
import { CompanyMultiSelectProps } from "./CompanyMultiSelect.type";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Search, ChevronDown, Check, X } from "lucide-react";

export function CompanyMultiSelect({
  availableCompanies,
  selectedCompanies = [],
  onCompanyToggle,
  onCompanyRemove,
}: CompanyMultiSelectProps) {
  const [companySearch, setCompanySearch] = useState("");
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

  const filteredCompanyOptions = availableCompanies.filter((c) =>
    c.toLowerCase().includes(companySearch.toLowerCase())
  );

  const selectedCompaniesCount = selectedCompanies.length;

  return (
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
          className="z-50 w-[calc(100vw-3rem)] sm:w-[310px] rounded-lg border border-border bg-popover text-popover-foreground p-2 shadow-xl"
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
              const isSelected = selectedCompanies.includes(comp);
              return (
                <button
                  key={comp}
                  type="button"
                  onClick={() => onCompanyToggle(comp)}
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

      {selectedCompanies.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selectedCompanies.map((comp) => (
            <span
              key={comp}
              className="inline-flex items-center space-x-1 rounded-md bg-accent border border-border px-2 py-0.5 text-xs text-foreground max-w-full"
            >
              <span className="truncate max-w-[140px]">{comp}</span>
              <button
                type="button"
                onClick={() => onCompanyRemove(comp)}
                className="text-muted-foreground hover:text-destructive ml-1 shrink-0"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
