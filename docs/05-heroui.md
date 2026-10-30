# HeroUI

**What it is:** a library of ready-made, good-looking components (Button, Input, Select, Table, Modal, Drawer, Toast, ...). It's built on Tailwind, so you can still add Tailwind classes to them.

**Where we use it:** all over the UI. Our own components in `src/components/` are mostly HeroUI with the repeated parts wrapped up.

Official docs (each page has examples and a props table): https://www.heroui.com/docs/components/button

---

## Importing

```tsx
import { Button, Input, Select, SelectItem, useDisclosure } from "@heroui/react";
```

## The props you'll use everywhere

Most components share these:

| Prop | Values |
| --- | --- |
| `color` | `default`, `primary`, `secondary`, `success`, `warning`, `danger` |
| `variant` | `solid`, `flat`, `bordered`, `light`, `ghost` (buttons) / `flat`, `bordered`, `underlined` (inputs) |
| `size` | `sm`, `md`, `lg` |
| `isDisabled`, `isLoading`, `isRequired`, `isReadOnly`, `isInvalid` | `true` / `false` |
| `startContent`, `endContent` | something before/after, e.g. an icon |

```tsx
<Button color="primary" startContent={<Plus size={18} />} isLoading={isSaving} onPress={openAdd}>
  Add Product
</Button>
```

> **Use `onPress`, not `onClick`,** on HeroUI buttons. It works the same with mouse, touch and keyboard.

## Inputs

In forms, use **our** `Form*` wrappers (see [forms](08-forms-and-zod.md)), not HeroUI inputs directly. They connect the field to the form and show its error.

Outside forms (like the search box):

```tsx
<Input size="sm" placeholder="Search..." value={search} onValueChange={setSearch} isClearable />
```

`onValueChange` gives you the text directly, so there's no need for `event.target.value`.

## Select (dropdown)

HeroUI's Select works with a **set of keys**, even for a single choice:

```tsx
<Select
  aria-label="Category"
  selectedKeys={category ? [category] : []}
  onSelectionChange={(keys) => setCategory(String(Array.from(keys)[0] ?? ""))}
>
  {PRODUCT_CATEGORIES.map((option) => (
    <SelectItem key={option.value}>{option.label}</SelectItem>
  ))}
</Select>
```

In forms, `<FormSelect>` hides this for you.

## Opening and closing: `useDisclosure`

Modals and drawers get their open/closed state from `useDisclosure`:

```tsx
const drawer = useDisclosure();   // { isOpen, onOpen, onClose, onOpenChange }

<Button onPress={drawer.onOpen}>Open</Button>
<FormDrawer isOpen={drawer.isOpen} onClose={drawer.onClose} title="Add Product">...</FormDrawer>
```

Our wrappers: `FormDrawer` (side panel for forms) and `ConfirmModal` ("Are you sure?").

```tsx
<ConfirmModal
  isOpen={confirmDelete.isOpen}
  onOpenChange={confirmDelete.onOpenChange}
  onConfirm={handleDelete}
  isDestructive          // red "Delete" button
  title="Delete this product?"
/>
```

## Table

The building blocks are `Table > TableHeader > TableColumn` and `TableBody > TableRow > TableCell`.

You rarely write them yourself: `<DataTable>` (`src/components/table/DataTable.tsx`) already adds search, sorting, rows per page and paging. You give it columns and a `renderCell` function.

## Toasts (little pop-up messages)

```tsx
import { showToast } from "../utils/toast";

showToast("Saved.", "success");
showToast("Something went wrong.", "danger");
```

`useCrud` already shows the API's message after every save or delete, so you seldom call this yourself.

## Other handy components

| Component | For |
| --- | --- |
| `Card`, `CardBody` | a panel (see `DashboardPage`) |
| `Chip` | a small label / badge |
| `Tooltip` | text on hover |
| `Tabs`, `Tab` | tabs |
| `Spinner` | a loading circle |
| `Dropdown` | a menu (see the user menu in `Navbar`) |
| `Checkbox`, `RadioGroup`, `DatePicker` | more inputs |

## Theme

The brand color, the corner roundness and the border width are in `src/hero.ts`. Change `primary` there and every button, link and focus ring follows.

## Accessibility

A component with no visible label needs `aria-label`, e.g. `<Select aria-label="Category">` and icon-only buttons like the row actions. HeroUI warns in the browser console when one is missing.
