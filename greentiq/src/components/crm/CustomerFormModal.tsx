import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema, CustomerFormValues } from "@/lib/schemas";
import { Customer } from "@/types";
import { STATUSES } from "@/lib/api/seed";
import { useAddCustomer, useUpdateCustomer } from "@/hooks/useCustomerMutations";
import { formatDate } from "@/lib/utils";
import { parseISO, isValid, format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerToEdit?: Customer | null;
}

export function CustomerFormModal({ isOpen, onClose, customerToEdit }: CustomerFormModalProps) {
  const isEditing = Boolean(customerToEdit);

  const addMutation = useAddCustomer();
  const updateMutation = useUpdateCustomer();
  const isPending = addMutation.isPending || updateMutation.isPending;

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "Acme Corp",
      status: "active",
      jobTitle: "",
      dealValue: undefined,
      accountOwner: "Alex Rivera",
      lastContactDate: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  useEffect(() => {
    if (customerToEdit) {
      reset({
        name: customerToEdit.name,
        email: customerToEdit.email,
        phone: customerToEdit.phone,
        company: customerToEdit.company,
        status: customerToEdit.status,
        jobTitle: customerToEdit.jobTitle || "",
        dealValue: customerToEdit.dealValue,
        accountOwner: customerToEdit.accountOwner || "",
        lastContactDate: customerToEdit.lastContactDate
          ? new Date(customerToEdit.lastContactDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        notes: "",
      });
    } else {
      reset({
        name: "",
        email: "",
        phone: "",
        company: "Acme Corp",
        status: "active",
        jobTitle: "",
        dealValue: undefined,
        accountOwner: "Alex Rivera",
        lastContactDate: new Date().toISOString().split("T")[0],
        notes: "",
      });
    }
  }, [customerToEdit, isOpen, reset]);

  const currentStatus = watch("status");
  const currentLastContactDate = watch("lastContactDate");

  const onSubmit = async (values: CustomerFormValues) => {
    try {
      if (isEditing && customerToEdit) {
        await updateMutation.mutateAsync({ id: customerToEdit.id, data: values });
      } else {
        await addMutation.mutateAsync(values);
      }
      onClose();
    } catch (error) {
      console.error("Customer form submit error:", error);
    }
  };

  const parsedDate = currentLastContactDate ? parseISO(currentLastContactDate) : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-xl bg-card border-border text-card-foreground p-0 gap-0 overflow-hidden shadow-2xl rounded-2xl">
        <DialogHeader className="p-4 sm:p-6 border-b border-border">
          <DialogTitle className="text-lg sm:text-xl font-bold">
            {isEditing ? "Edit Customer" : "Add Customer"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-4 sm:px-7 py-5 max-h-[75vh] overflow-y-auto pr-3 sm:pr-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Name <span className="text-destructive">*</span>
            </label>
            <Input
              {...register("name")}
              placeholder="e.g. John Doe"
              className={`bg-background border-input text-foreground text-xs ${
                errors.name ? "border-destructive" : ""
              }`}
            />
            {errors.name && <p className="text-[11px] text-destructive font-medium">{errors.name.message}</p>}
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Email <span className="text-destructive">*</span>
              </label>
              <Input
                {...register("email")}
                placeholder="john.doe@example.com"
                className={`bg-background border-input text-foreground text-xs ${
                  errors.email ? "border-destructive" : ""
                }`}
              />
              {errors.email && <p className="text-[11px] text-destructive font-medium">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Phone <span className="text-destructive">*</span>
              </label>
              <Input
                {...register("phone")}
                placeholder="+1 (555) 123-4567"
                className={`bg-background border-input text-foreground text-xs ${
                  errors.phone ? "border-destructive" : ""
                }`}
              />
              {errors.phone && <p className="text-[11px] text-destructive font-medium">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Company & Job Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Company</label>
              <Input
                {...register("company")}
                placeholder="Acme Corp"
                className="bg-background border-input text-foreground text-xs"
              />
              {errors.company && <p className="text-[11px] text-destructive font-medium">{errors.company.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Job Title</label>
              <Input
                {...register("jobTitle")}
                placeholder="Marketing Director"
                className="bg-background border-input text-foreground text-xs"
              />
            </div>
          </div>

          {/* Status & Last Contact Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Status</label>
              <Select
                value={currentStatus}
                onValueChange={(val) => setValue("status", val as any)}
              >
                <SelectTrigger className="bg-background border-input text-foreground capitalize text-xs">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border text-popover-foreground">
                  {STATUSES.map((st) => (
                    <SelectItem key={st} value={st} className="capitalize text-xs">
                      {st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Last Contact Date Field Popover Button */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Last Contact Date</label>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between text-left font-normal text-xs h-9 border-input bg-background text-foreground px-3"
                  >
                    <span className="truncate">
                      {currentLastContactDate ? formatDate(currentLastContactDate, "PPP") : "Select date"}
                    </span>
                    <CalendarIcon className="ml-auto h-4 w-4 text-muted-foreground shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="z-50 p-0 border-none bg-transparent">
                  <Calendar
                    selected={parsedDate && isValid(parsedDate) ? parsedDate : undefined}
                    onSelect={(date) => {
                      if (date) {
                        setValue("lastContactDate", format(date, "yyyy-MM-dd"));
                      }
                      setIsDatePickerOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Deal Value & Account Owner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Deal Value ($)</label>
              <Input
                type="number"
                {...register("dealValue")}
                placeholder="45000"
                className="bg-background border-input text-foreground text-xs"
              />
              {errors.dealValue && (
                <p className="text-[11px] text-destructive font-medium">{errors.dealValue.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Account Owner</label>
              <Input
                {...register("accountOwner")}
                placeholder="Alex Rivera"
                className="bg-background border-input text-foreground text-xs"
              />
            </div>
          </div>

          {/* Customer Notes / Interaction Summary Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              {isEditing ? "Add Note / Interaction Summary" : "Initial Note / Interaction Summary"}
            </label>
            <textarea
              {...register("notes")}
              rows={3}
              placeholder="Type interaction notes, meeting summaries, or account context..."
              className="w-full rounded-lg border border-input bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <DialogFooter className="pt-4 border-t border-border mt-2 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="w-full sm:w-auto text-muted-foreground text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 text-xs"
            >
              {isPending
                ? isEditing
                  ? "Updating..."
                  : "Adding..."
                : isEditing
                ? "Save Changes"
                : "Add Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
