import { z } from "zod";

export const customerStatusEnum = z.enum(["active", "prospect", "lead", "inactive", "archived"]);

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^(\+?\d{1,4}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/, "Invalid phone format (e.g. (555) 123-4567 or 555-123-4567)"),
  company: z.string().min(1, "Company is required"),
  status: customerStatusEnum,
  jobTitle: z.string().optional(),
  dealValue: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number({ invalid_type_error: "Deal value must be a number" }).min(0, "Deal value cannot be negative").optional()
  ),
  accountOwner: z.string().optional(),
  lastContactDate: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

export const savedFilterSchema = z.object({
  name: z.string().min(1, "Filter name is required"),
  isPinned: z.boolean().default(false),
  filters: z.object({
    status: z.array(customerStatusEnum).default([]),
    companies: z.array(z.string()).default([]),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    phoneContains: z.string().optional(),
    emailContains: z.string().optional(),
  }),
});

export type SavedFilterFormValues = z.infer<typeof savedFilterSchema>;
