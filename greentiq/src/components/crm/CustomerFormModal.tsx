import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema, CustomerFormValues } from "@/lib/schemas";
import { Customer } from "@/types";
import { STATUSES } from "@/lib/api/seed";
import { useAddCustomer, useUpdateCustomer } from "@/hooks/useCustomerMutations";
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
      });
    }
  }, [customerToEdit, isOpen, reset]);

  const currentStatus = watch("status");

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-100">
            {isEditing ? "Edit Customer" : "Add Customer"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Name <span className="text-rose-400">*</span>
            </label>
            <Input
              {...register("name")}
              placeholder="e.g. John Doe"
              className={`bg-slate-950 border-slate-800 text-slate-100 ${
                errors.name ? "border-rose-500" : ""
              }`}
            />
            {errors.name && <p className="text-[11px] text-rose-400 font-medium">{errors.name.message}</p>}
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Email <span className="text-rose-400">*</span>
              </label>
              <Input
                {...register("email")}
                placeholder="john.doe@example.com"
                className={`bg-slate-950 border-slate-800 text-slate-100 ${
                  errors.email ? "border-rose-500" : ""
                }`}
              />
              {errors.email && <p className="text-[11px] text-rose-400 font-medium">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Phone <span className="text-rose-400">*</span>
              </label>
              <Input
                {...register("phone")}
                placeholder="+1 (555) 123-4567"
                className={`bg-slate-950 border-slate-800 text-slate-100 ${
                  errors.phone ? "border-rose-500" : ""
                }`}
              />
              {errors.phone && <p className="text-[11px] text-rose-400 font-medium">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Company & Job Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Company</label>
              <Input
                {...register("company")}
                placeholder="Acme Corp"
                className="bg-slate-950 border-slate-800 text-slate-100"
              />
              {errors.company && <p className="text-[11px] text-rose-400 font-medium">{errors.company.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Job Title</label>
              <Input
                {...register("jobTitle")}
                placeholder="Marketing Director"
                className="bg-slate-950 border-slate-800 text-slate-100"
              />
            </div>
          </div>

          {/* Status & Last Contact Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Status</label>
              <Select
                value={currentStatus}
                onValueChange={(val) => setValue("status", val as any)}
              >
                <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-100 capitalize">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                  {STATUSES.map((st) => (
                    <SelectItem key={st} value={st} className="capitalize">
                      {st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Last Contact Date</label>
              <Input
                type="date"
                {...register("lastContactDate")}
                className="bg-slate-950 border-slate-800 text-slate-100"
              />
            </div>
          </div>

          {/* Deal Value & Account Owner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Deal Value ($)</label>
              <Input
                type="number"
                {...register("dealValue")}
                placeholder="45000"
                className="bg-slate-950 border-slate-800 text-slate-100"
              />
              {errors.dealValue && (
                <p className="text-[11px] text-rose-400 font-medium">{errors.dealValue.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Account Owner</label>
              <Input
                {...register("accountOwner")}
                placeholder="Alex Rivera"
                className="bg-slate-950 border-slate-800 text-slate-100"
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-slate-400"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-500 font-semibold px-6"
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
