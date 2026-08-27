export interface DateRangeFilterProps {
  dateFrom?: string;
  dateTo?: string;
  onDateFromChange: (dateFrom?: string) => void;
  onDateToChange: (dateTo?: string) => void;
}
