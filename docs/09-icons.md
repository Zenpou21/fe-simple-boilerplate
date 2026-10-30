# Icons: lucide-react

**What it is:** over 1,500 simple line icons, each one a React component.

**Where we use it:** the sidebar (`src/routes/index.ts`), buttons (`Plus` on "Add Product"), row actions (`Eye`, `Pen`, `Trash2`) and the search box.

Find icons (search by name, click to copy the name): https://lucide.dev/icons

---

## Using one

```tsx
import { Plus, Trash2, Truck } from "lucide-react";

<Truck />                                      // 24px, current text color
<Truck size={18} />                            // size in px
<Truck size={16} className="text-danger" />    // color through Tailwind
<Truck strokeWidth={1.5} />                    // thinner lines
```

The name on the website is in kebab-case (`trash-2`). In code it's PascalCase (`Trash2`).

## In buttons

```tsx
<Button color="primary" startContent={<Plus size={18} />}>Add Product</Button>

// icon-only: give it an aria-label so screen readers know what it does
<Button isIconOnly variant="light" aria-label="Delete">
  <Trash2 size={18} />
</Button>
```

## In the sidebar

Each entry in `src/routes/index.ts` has an `icon`. Pass the component itself, not `<Users />`:

```ts
import { Users } from "lucide-react";

{ path: "/customers", name: "Customers", icon: Users, component: ... }
```

Only the icons you import end up in the build, so importing many doesn't make the app bigger.
