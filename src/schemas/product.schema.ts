import { z } from "zod";

/**
 * The product form's rules, checked in the browser before saving.
 * The API checks the same things again (never trust only the browser), see ProductController::rules().
 */
export const productSchema = z.object({
  code: z.string().trim().min(1, "Code is required.").max(20, "Use 20 characters or fewer."),
  name: z.string().trim().min(1, "Name is required.").max(120, "Use 120 characters or fewer."),
  category: z.string().min(1, "Pick a category."),
  price: z.number({ error: "Price is required." }).min(0, "Price can't be negative."),
  stock: z.number({ error: "Stock is required." }).int("Use a whole number.").min(0, "Stock can't be negative."),
  description: z.string().max(500, "Use 500 characters or fewer."),
  is_active: z.boolean(),
});

/** The form's values, worked out from the schema above (no need to write the type twice). */
export type ProductFormValues = z.infer<typeof productSchema>;
