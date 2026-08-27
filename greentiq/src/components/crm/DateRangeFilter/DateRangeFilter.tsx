import React, { useState } from "react";
import { DateRangeFilterProps } from "./DateRangeFilter.type";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "@/lib/utils";
import { parseISO, isValid, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";

export function DateRangeFilter({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
}: DateRangeFilterProps) {
  const [isDateFromOpen, setIsDateFromOpen] = useState(false);
  const [isDateToOpen, setIsDateToOpen] = useState(false);

  const parsedDateFrom = dateFrom ? parseISO(dateFrom) : undefined;
  const parsedDateTo = dateTo ? parseISO(dateTo) : undefined;

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Date Range (Last Contact)
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  {dateFrom ? formatDate(dateFrom, "MMM d, yyyy") : "Pick date"}
                </span>
                <CalendarIcon className="ml-auto h-4 w-4 text-muted-foreground shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="z-50 p-0 border-none bg-transparent">
              <Calendar
                selected={parsedDateFrom && isValid(parsedDateFrom) ? parsedDateFrom : undefined}
                onSelect={(date) => {
                  onDateFromChange(date ? format(date, "yyyy-MM-dd") : undefined);
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
                  {dateTo ? formatDate(dateTo, "MMM d, yyyy") : "Pick date"}
                </span>
                <CalendarIcon className="ml-auto h-4 w-4 text-muted-foreground shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="z-50 p-0 border-none bg-transparent">
              <Calendar
                selected={parsedDateTo && isValid(parsedDateTo) ? parsedDateTo : undefined}
                onSelect={(date) => {
                  onDateToChange(date ? format(date, "yyyy-MM-dd") : undefined);
                  setIsDateToOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
