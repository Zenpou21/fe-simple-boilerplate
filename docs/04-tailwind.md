# Tailwind CSS

**What it is:** styling by adding small class names instead of writing CSS files. `className="flex gap-2 p-4"` means display flex, gap of 0.5rem and padding of 1rem.

**Where we use it:** the `className` of almost every element. Version 4: the setup is in `src/index.css` (there is no `tailwind.config.js` in v4).

Official docs (search box top-left, type what you want, e.g. "padding"): https://tailwindcss.com/docs

---

## Cheat sheet

| What | Classes |
| --- | --- |
| Spacing (1 = 0.25rem = 4px) | `p-4` padding, `px-4` left+right, `py-2` top+bottom, `m-2` margin, `mt-4` margin-top |
| Size | `w-full`, `w-52`, `max-w-xs`, `h-10`, `min-h-screen` |
| Row of items | `flex items-center gap-3` |
| Column of items | `flex flex-col gap-3` |
| Push to the right | `ml-auto` or `justify-between` on the parent |
| Grid | `grid grid-cols-2 gap-3` |
| Text | `text-sm`, `text-xl`, `font-medium`, `font-semibold`, `whitespace-nowrap`, `truncate` |
| Colors | `text-danger`, `text-default-500`, `bg-content1`, `bg-primary` |
| Borders | `border border-divider rounded-lg` |
| Show/hide | `hidden`, `block` |

## Phone first, then bigger screens

A class with no prefix applies to **all** sizes. Prefixes apply from that width **up**:

| Prefix | From |
| --- | --- |
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |

```tsx
// One column on phones, two from 640px up
<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

// Full width on phones, 13rem from 640px up
<Select className="w-full sm:w-52" />

// Sidebar hidden on phones, always shown from 1024px
<aside className="hidden lg:block">
```

So design for the phone first, then add `sm:` / `lg:` for wider screens.

## Colors come from the theme

Use HeroUI's theme names instead of fixed colors, so a theme change updates everything:

| Name | For |
| --- | --- |
| `primary` | brand color (buttons, links), set in `src/hero.ts` |
| `success` / `warning` / `danger` | green / orange / red states |
| `default-50` ... `default-900` | grays, from light to dark |
| `foreground` | normal text |
| `content1` | card / panel background |
| `divider` | thin borders |

Example: `text-default-500` gives gray secondary text, and `bg-danger-50 text-danger` gives a soft red badge.

## Hover, focus and dark mode

```tsx
<a className="text-default-600 hover:text-primary">...</a>
<div className="bg-white dark:bg-black">...</div>
```

## Classes that depend on a value

```tsx
<span className={product.stock === 0 ? "text-danger" : ""}>{product.stock}</span>
```

## Tips

- Install the **Tailwind CSS IntelliSense** extension in VS Code. It autocompletes class names and shows the CSS on hover.
- A value Tailwind doesn't have: square brackets, e.g. `w-[340px]`.
- Don't build class names from pieces, like `` `text-${color}` ``. Tailwind only includes classes it can find written out in full in the code.
- If many elements repeat the same long class list, make a component instead of copying it.
