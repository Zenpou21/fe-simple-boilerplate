# TypeScript

**What it is:** JavaScript plus *types*. You say what shape your data has, and the editor underlines mistakes (a typo in a field name, a number where text is expected) before you even run the app.

**Where we use it:** every file in `src/` is `.ts` (plain code) or `.tsx` (code with JSX/HTML-like tags).

Official docs: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html

---

## The 6 things you need

### 1. Describe your data with `type`

`src/types/product.ts` says what a product from the API looks like:

```ts
export type Product = {
  id: number;
  code: string;
  price: number;
  description: string | null; // text OR null (the API sends null when it's empty)
  is_active: boolean;
};
```

Now `product.prise` is a red error in the editor, and `product.` shows a list of the real fields.

### 2. Optional fields: `?`

```ts
type TableColumn = {
  name: string;
  uid: string;
  sortable?: boolean; // may be left out
};
```

### 3. "One of these values": unions

```ts
export type FormMode = "Add" | "View" | "Edit";

let mode: FormMode = "Add";   // ok
mode = "Delete";              // error: not one of the three
```

### 4. Typing function inputs (props)

```tsx
type PageHeaderProps = {
  title: string;
  description?: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) { ... }
```

### 5. Generics: `<Product>`

Some functions work for any type, and you tell them which one in `< >`:

```ts
const { data } = useDataFetcher<Product>(`products/${id}`);
//      data is a Product (or undefined while loading)

const table = useServerTable<Product>("products/list");
//    table.items is Product[]
```

### 6. Let zod write the type for you

```ts
export type ProductFormValues = z.infer<typeof productSchema>;
```

The form's type comes from its validation rules, so the two can never disagree. See [forms and zod](08-forms-and-zod.md).

---

## Common situations

| You see | Means | Fix |
| --- | --- | --- |
| `Property 'x' does not exist on type 'Product'` | the field isn't in the type | add it to `types/product.ts` (if the API really sends it) |
| `'data' is possibly 'undefined'` | data hasn't loaded yet | `data?.name` or `if (!data) return <Loader />;` |
| `Type 'string' is not assignable to type 'number'` | wrong kind of value | convert it: `Number(value)` |
| `Object is possibly 'null'` | the value can be null | check first: `if (product) { ... }` |

- `?.` reads a field only if the thing exists: `product?.name`.
- `??` gives a fallback when a value is null or undefined: `product?.name ?? "--"`.

## Checking the whole project

The editor checks the file you have open. To check everything:

```bash
npm run build   # runs `tsc -b` first; any type error stops the build
```

Avoid `any`. It switches the checks off, and the mistakes come back as bugs later.
