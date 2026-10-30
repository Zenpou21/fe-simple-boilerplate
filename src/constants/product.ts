import type { SelectOption } from "../components/form";

/**
 * The product categories for the dropdowns. Keep this list the same as
 * Product::CATEGORIES in the API, which rejects any other value.
 */
export const PRODUCT_CATEGORIES: SelectOption[] = [
  { label: "Electronics", value: "Electronics" },
  { label: "Furniture", value: "Furniture" },
  { label: "Office Supplies", value: "Office Supplies" },
  { label: "Food & Beverage", value: "Food & Beverage" },
  { label: "Cleaning", value: "Cleaning" },
];

/** Cache prefix of every product read: pass it to useCrud's `invalidate` after a change. */
export const PRODUCT_QUERIES = "products";
