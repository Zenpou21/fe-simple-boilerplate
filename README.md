# Starter Kit

The frontend for the **Starter Kit** app (the Laravel API is in the `starter-kit-api` folder next to this one).
It uses the same setup as Navitrack, kept small so it is easy to learn from.

| What | Used for |
| --- | --- |
| **React 19 + TypeScript** | the UI |
| **Vite** | dev server and build |
| **HeroUI** | ready-made components (Table, Drawer, Input, Select, Modal, ...) |
| **Tailwind CSS 4** | styling with classes, e.g. `className="flex gap-2 p-4"` |
| **React Router** | pages and URLs |
| **SWR** | caching API reads, so lists refresh by themselves |
| **react-hook-form + zod** | forms and their validation |
| **lucide-react** | icons |

**New to any of these?** [`docs/`](docs/README.md) has a short guide for each tool: what it is, where this kit uses it, and how to use it.

---

## 1. Setup (first time)

Start the API first (see `starter-kit-api/README.md`). Then:

```bash
npm install
cp .env.example .env     # Windows cmd: copy .env.example .env
npm run dev              # open http://localhost:5173
```

Sign in with **admin@example.com** / **password**, then open **Products**.

> Open the app at `http://localhost:5173`, not `127.0.0.1`. The sign-in cookie only works when the app and the API use the same host name.

---

## 2. Folder map

```
src/
  main.tsx                    starts the app (providers)
  App.tsx                     login route + the signed-in pages
  routes/
    index.ts                  ★ the list of pages: adds them to the router AND the sidebar
    guards.tsx                PrivateRoute (signed-in only) / GuestRoute (login page)
  context/AuthContext.tsx     who is signed in: useAuth()
  services/apiClient.ts       the only fetch() to the API
  hooks/
    useCrud.ts                ★ create / update / delete (and one-off reads)
    useDataFetcher.ts         ★ cached reads (SWR)
    useServerTable.ts         page, sort, search and filter state of a table
  components/
    form/                     FormInput, FormNumberInput, FormSelect, FormSwitch, FormTextarea
    table/                    DataTable, RowActions (view/edit/delete), StatusDot
    common/                   FormDrawer, ConfirmModal, PageHeader, Loader
    layout/                   Layout, Sidebar, Navbar
  pages/
    Auth/LoginPage.tsx
    Dashboard/DashboardPage.tsx
    Products/                 ★ THE CRUD EXAMPLE
      ProductsPage.tsx          table + delete
      ProductForm.tsx           Add / View / Edit drawer
  types/product.ts            the shape of a product from the API
  schemas/product.schema.ts   the form's validation rules (zod)
  constants/product.ts        dropdown options
  utils/                      showToast(), formatMoney(), formatDateTime()
```

---

## 3. How data flows

```
Component ──► useCrud / useDataFetcher ──► apiClient ──► Laravel API
    ▲                                                        │
    └──────────── result.ok / result.data / toast ◄──────────┘
```

**Reading** (lists, details): `useDataFetcher`. The data is cached and refreshes when you come back to the tab.

```tsx
const { data, isLoading } = useDataFetcher<Product>(`products/${id}`);
```

**Tables**: `useServerTable` + `<DataTable>`. The API does the paging, search and sort.

```tsx
const table = useServerTable<Product>("products/list", { category });
<DataTable columns={columns} table={table} renderCell={renderCell} />
```

**Writing** (create, update, delete): `useCrud`. It never throws, so just check `result.ok`.
It shows the API's message as a toast. `invalidate` refreshes every cached read that starts with that path, so the table updates.

```tsx
const { post, put, remove, isLoading } = useCrud();
const result = await post("products", values, { invalidate: "products" });
if (result.ok) closeDrawer();
```

**Forms**: `useForm` + a zod schema + the `Form*` fields. Each field shows its own error.

```tsx
const { control, handleSubmit } = useForm<ProductFormValues>({ resolver: zodResolver(productSchema) });
<FormInput control={control} name="name" label="Name" isRequired />
```

**Who is signed in**: `const { user, logout } = useAuth();`

---

## 4. Add your own module (example: Customers)

Build the API part first (see the API README). Then:

1. **Type**: `src/types/customer.ts`, the fields the API returns.
2. **Schema**: `src/schemas/customer.schema.ts`, the form rules (copy `product.schema.ts`).
3. **Page**: copy `src/pages/Products/` to `src/pages/Customers/`, then rename and adjust:
   - `columns`: each `uid` must match a column key in the API's `onGetList`
   - `renderCell`: how special cells look (money, status, ...)
   - the paths: `"products/list"` → `"customers/list"`, `"products"` → `"customers"`
   - the form fields in `CustomerForm.tsx`
4. **Menu**: add one entry to `src/routes/index.ts`:

   ```ts
   { path: "/customers", name: "Customers", icon: Users, component: lazy(() => import("../pages/Customers/CustomersPage")) },
   ```

That's it: the page is in the router and the sidebar.

---

## 5. Commands

```bash
npm run dev       # dev server with hot reload
npm run build     # type-check + production build into dist/
npm run lint      # check the code style
npm run preview   # serve the built dist/ locally
```

## 6. Tips

- The tool guides: [`docs/`](docs/README.md).
- HeroUI components and their props: https://www.heroui.com/docs/components/table
- Tailwind classes: https://tailwindcss.com/docs
- Icons (search by name, then `import { Truck } from "lucide-react"`): https://lucide.dev/icons
- Change the brand color in `src/hero.ts`, and the app name in `.env` (`VITE_APP_NAME`).
- After editing `.env`, stop and restart `npm run dev`.
