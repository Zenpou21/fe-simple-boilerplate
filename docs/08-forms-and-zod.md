# Forms: react-hook-form + zod

**What they are:**
- **react-hook-form** keeps track of a form's values, errors and "has this field been touched".
- **zod** describes the rules ("required", "max 20 characters", "a number of 0 or more"). One schema gives you both the checks and the TypeScript type.
- **@hookform/resolvers** connects the two.

**Where we use them:** `src/schemas/` (the rules), `src/components/form/` (fields connected to the form), and `src/pages/Products/ProductForm.tsx` (the full example).

Official docs: https://react-hook-form.com/get-started · https://zod.dev

---

## The 4 steps of every form

### 1. Write the rules (`src/schemas/product.schema.ts`)

```ts
import { z } from "zod";

export const productSchema = z.object({
  code: z.string().trim().min(1, "Code is required.").max(20, "Use 20 characters or fewer."),
  category: z.string().min(1, "Pick a category."),
  price: z.number({ error: "Price is required." }).min(0, "Price can't be negative."),
  is_active: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;   // the type, for free
```

### 2. Create the form

```tsx
const { control, handleSubmit, reset } = useForm<ProductFormValues>({
  resolver: zodResolver(productSchema),
  mode: "onTouched",              // show a field's error once the user leaves it
});
```

### 3. Add fields

Each `Form*` field takes `control` and the field's `name`. It shows its own error message.

```tsx
<FormInput control={control} name="code" label="Code" isRequired />
<FormSelect control={control} name="category" label="Category" options={PRODUCT_CATEGORIES} />
<FormNumberInput control={control} name="price" label="Price" minValue={0} />
<FormTextarea control={control} name="description" label="Description" />
<FormSwitch control={control} name="is_active">Active</FormSwitch>
```

All the HeroUI props still work (`isReadOnly`, `description`, `startContent`, ...).

### 4. Submit

```tsx
const save = async (values: ProductFormValues) => {
  const result = await post("products", values, { invalidate: "products" });
  if (result.ok) onClose();
};

<Button onPress={() => handleSubmit(save)()}>Save</Button>
```

`handleSubmit(save)` runs zod first. `save` only runs if every field passes, and if any fails, the errors appear under the fields.

## Filling the form (edit mode)

```tsx
useEffect(() => {
  if (isOpen) reset({ code: product.code, name: product.name, ... });
}, [isOpen, product, reset]);
```

`reset()` replaces all the values. The kit uses it each time the drawer opens.

## Zod cheat sheet (zod 4)

```ts
z.string().trim().min(1, "Required.")          // required text (trim: spaces alone don't count)
z.string().max(500)                             // optional text, may be ""
z.email("Enter a valid email.")                 // email
z.number({ error: "Required." }).min(0)         // number (empty number fields give undefined)
z.number().int("Whole numbers only.")           // whole number
z.boolean()                                     // switch / checkbox
z.enum(["Cash", "Card"])                        // one of these
z.string().optional()                           // may be missing (undefined)
z.string().nullable()                           // may be null
z.array(z.string()).min(1, "Pick at least one.") // multi-select
```

A rule that compares two fields (e.g. "passwords match"):

```ts
const schema = z
  .object({ password: z.string().min(8), confirm: z.string() })
  .refine((v) => v.password === v.confirm, { message: "Passwords don't match.", path: ["confirm"] });
```

> Zod 4 note: older guides online write `required_error: "..."` and `z.string().email()`. In zod 4 these are `{ error: "..." }` and `z.email()`.

## Browser rules and API rules

The API checks everything again (`rules()` in the Laravel controller), because anyone can call the API without our form. Keep both sets of rules the same.

When the API rejects something only it can know (e.g. "The code has already been taken."), `useCrud` shows it as a toast and the drawer stays open.

## Adding a new kind of field

Copy `src/components/form/FormInput.tsx`. The pattern is a `<Controller>` that hands `field.value`, `field.onChange` and `fieldState.error` to a HeroUI component. Then export it from `src/components/form/index.ts`.
