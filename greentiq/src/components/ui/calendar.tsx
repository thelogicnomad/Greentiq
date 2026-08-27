import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  parseISO,
  isValid,
  setMonth,
  setYear,
} from "date-fns";
import { cn } from "@/lib/utils";

export interface CalendarProps {
  selected?: Date | string;
  onSelect?: (date: Date) => void;
  className?: string;
  mode?: "single";
  initialFocus?: boolean;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function Calendar({
  selected,
  onSelect,
  className,
}: CalendarProps) {
  const selectedDate = React.useMemo(() => {
    if (!selected) return undefined;
    if (selected instanceof Date) return selected;
    const parsed = parseISO(selected);
    return isValid(parsed) ? parsed : undefined;
  }, [selected]);

  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    selectedDate || new Date()
  );

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonthIndex = parseInt(e.target.value, 10);
    setCurrentMonth((prev) => setMonth(prev, newMonthIndex));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value, 10);
    setCurrentMonth((prev) => setYear(prev, newYear));
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const currentYearVal = currentMonth.getFullYear();
  const yearsRange: number[] = [];
  for (let y = 2015; y <= 2035; y++) {
    yearsRange.push(y);
  }

  return (
    <div className={cn("p-3 bg-popover border border-border rounded-xl shadow-2xl text-popover-foreground w-[270px]", className)}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <div className="flex items-center space-x-1">
          {/* Month Select */}
          <select
            value={currentMonth.getMonth()}
            onChange={handleMonthChange}
            className="rounded-md border border-input bg-background px-1.5 py-0.5 text-[11px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {MONTHS.map((m, idx) => (
              <option key={m} value={idx}>
                {m}
              </option>
            ))}
          </select>

          {/* Year Select */}
          <select
            value={currentYearVal}
            onChange={handleYearChange}
            className="rounded-md border border-input bg-background px-1.5 py-0.5 text-[11px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {yearsRange.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Prev / Next Arrows */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1 rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1 rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            title="Next Month"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Weekday Labels Header */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {weekDays.map((d) => (
          <span key={d} className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-0.5">
            {d}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((d, idx) => {
          const isSelected = selectedDate ? isSameDay(d, selectedDate) : false;
          const isCurrentMonth = isSameMonth(d, currentMonth);
          const isToday = isSameDay(d, new Date());

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelect && onSelect(d)}
              className={cn(
                "h-7 w-7 rounded-md text-xs font-medium flex items-center justify-center transition-all",
                !isCurrentMonth && "text-muted-foreground/30 opacity-40",
                isCurrentMonth && !isSelected && "text-foreground hover:bg-accent hover:text-accent-foreground",
                isToday && !isSelected && "border border-primary text-primary font-bold",
                isSelected && "bg-primary text-primary-foreground font-bold shadow-xs"
              )}
            >
              {format(d, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
