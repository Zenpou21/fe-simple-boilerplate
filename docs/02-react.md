# React

**What it is:** the library that draws the screen. You build the UI out of **components**: functions that return what should appear. When their data changes, React redraws only what changed.

**Where we use it:** everything in `src/pages/` and `src/components/`. Version 19.

Official docs (very good, start with "Quick Start"): https://react.dev/learn

---

## Components

A component is a function whose name starts with a capital letter and returns JSX (HTML-like tags):

```tsx
export default function DashboardPage() {
  return <h1 className="text-xl font-semibold">Dashboard</h1>;
}
```

Use it like a tag: `<DashboardPage />`.

JSX differences from HTML:
- `className` instead of `class`.
- `{ }` puts JavaScript inside: `<span>{product.name}</span>`.
- Every tag closes: `<img />`, `<br />`.
- One parent element. Wrap siblings in `<> ... </>` if needed.

## Props: passing data in

```tsx
// a shorter version of src/components/common/PageHeader.tsx
export default function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}

// using it
<PageHeader title="Products" description="All products in the catalog." />
```

Props go one way, from parent to child. To let a child tell the parent something, pass a function, e.g. `onClose={drawer.onClose}`.

## State: data that changes

```tsx
const [category, setCategory] = useState("");   // starts as ""

setCategory("Furniture");                         // React redraws with the new value
```

From `ProductsPage.tsx`: the category dropdown sits in state, and every change reloads the table.

Never change state directly (`category = "x"` does nothing on screen). Always use the setter.

## Showing things conditionally

```tsx
{isView && <p>Created {formatDateTime(product.created_at)}</p>}   // only in View mode
{isView ? <Button>Edit</Button> : <Button>Save</Button>}           // one or the other
```

## Lists

```tsx
{PRODUCT_CATEGORIES.map((option) => (
  <SelectItem key={option.value}>{option.label}</SelectItem>
))}
```

Every item needs a unique `key`, usually the id.

## Events

```tsx
<Button onPress={openAdd}>Add Product</Button>          // HeroUI buttons use onPress
<input onChange={(event) => setName(event.target.value)} />
```

## Hooks

Functions that start with `use` are **hooks**. The ones you will meet:

| Hook | Use it for | Example in the kit |
| --- | --- | --- |
| `useState` | a value that changes | the selected product, the category filter |
| `useEffect` | do something after drawing, or when a value changes | `ProductForm`: fill the form when the drawer opens |
| `useCallback` / `useMemo` | keep the same function/value between redraws (for speed) | `renderCell` in `ProductsPage` |
| `useContext` | read app-wide data | `useAuth()` gives the signed-in user |
| our own | anything reusable | `useCrud`, `useDataFetcher`, `useServerTable` |

**Rules of hooks** (ESLint warns you):
1. Call hooks at the top of the component, not inside `if`, loops or after a `return`.
2. Only call them in components or in other hooks.

```tsx
useEffect(() => {
  if (isOpen) reset(toFormValues(product));
}, [isOpen, product, reset]);   // runs again when any of these change
```

The list at the end (the *dependency array*) must contain every value used inside. ESLint tells you when one is missing.

## Context: app-wide data

`src/context/AuthContext.tsx` keeps the signed-in user in one place:

```tsx
const { user, logout } = useAuth();
<span>Hello, {user?.name}</span>
```

Use context for things almost every page needs (the user, the theme). Use props for everything else.

## Thinking in React

1. Split the screen into boxes, and make each box a component.
2. Decide which data changes, and put it in state in the closest parent that needs it.
3. Pass data down as props and pass functions down for changes back up.

`ProductsPage` (owns the state) → `DataTable` (draws the rows) and `ProductForm` (edits one product) is exactly this.
