# SWR

**What it is:** a small library for **reading** data from an API. It remembers (caches) each answer, so:
- the same data is never requested twice at once,
- going back to a page shows the old data instantly while it checks for new data,
- data refreshes by itself (when you come back to the tab, and every 30 seconds).

The name comes from "stale-while-revalidate": show the stale (cached) data while checking for fresh data.

**Where we use it:** wrapped in our `useDataFetcher` hook (`src/hooks/useDataFetcher.ts`), which `useServerTable` uses for tables. The app-wide settings are in `src/globals/swrConfig.ts`.

Official docs: https://swr.vercel.app/docs/getting-started

---

## Reading data

```tsx
import useDataFetcher from "../../hooks/useDataFetcher";

const { data, isLoading, error, refresh } = useDataFetcher<Product>(`products/${id}`);

if (isLoading) return <Loader />;
if (error) return <p>{error.message}</p>;
return <h1>{data?.name}</h1>;
```

- The **path is the cache key**. Two components asking for `products/12` share one request.
- `data` is `undefined` until the first answer arrives.
- `refresh()` asks again right now.

## Waiting before loading

Pass `null` instead of a path, and SWR doesn't request anything yet:

```tsx
// Only load when a product is chosen
const { data } = useDataFetcher<Product>(selectedId ? `products/${selectedId}` : null);
```

## Refreshing after a change

After a save, cached reads still have the old data. Tell them to reload with `invalidate`:

```tsx
const { post } = useCrud();
await post("products", values, { invalidate: "products" });
// reloads every cached read whose path starts with "products/",
// e.g. "products/list?page=2..." and "products/12"
```

You can also call `invalidateQueries("products")` yourself (from `useDataFetcher.ts`).

## Reading vs writing: which hook?

| Need | Use |
| --- | --- |
| show data on the screen (list, details, dropdown options) | `useDataFetcher` (cached, auto-refresh) |
| a table with paging | `useServerTable` (uses `useDataFetcher`) |
| create, update or delete | `useCrud().post / put / remove` |
| a one-off read on a button press (e.g. "check stock") | `useCrud().get` |

## The settings (`src/globals/swrConfig.ts`)

| Setting | Here | Means |
| --- | --- | --- |
| `refreshInterval` | 30000 | reload shown data every 30 s |
| `revalidateOnFocus` | true | reload when you come back to the tab |
| `dedupingInterval` | 5000 | the same path within 5 s uses one request |

Change one read only by passing options:

```tsx
useDataFetcher("dashboard/stats", { refreshInterval: 5000 });     // every 5 s
useDataFetcher("settings", { refreshInterval: 0 });                // never on a timer
```

`keepPreviousData: true` (used by tables) keeps the old page on screen while the next page loads, so the table doesn't flicker.
