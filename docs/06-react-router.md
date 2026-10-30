# React Router

**What it is:** it shows the right page for the URL (`/products` shows `ProductsPage`) without reloading the browser.

**Where we use it:** `src/App.tsx` (the URL map), `src/routes/index.ts` (the list of signed-in pages), `src/routes/guards.tsx` (who may open what), and `Sidebar` (links). Version 7.

Official docs: https://reactrouter.com/start/declarative/routing

---

## How the kit is wired

```
main.tsx       <BrowserRouter>           turns routing on
App.tsx        <Routes>
                 /login                  -> GuestRoute  -> LoginPage
                 (everything else)       -> PrivateRoute -> Layout (sidebar + top bar)
                     /                   -> redirect to /dashboard
                     routes/index.ts     -> one <Route> per entry
                 *                       -> NotFoundPage
```

- `PrivateRoute` sends signed-out users to `/login`.
- `GuestRoute` sends signed-in users away from `/login`.
- `Layout` draws the sidebar and top bar, and its `<Outlet />` is where the page appears.

## Add a page to the menu

One entry in `src/routes/index.ts`. It adds both the route and the sidebar link:

```ts
{
  path: "/customers",
  name: "Customers",
  icon: Users,
  component: lazy(() => import("../pages/Customers/CustomersPage")),
},
```

## Add a page that is NOT in the menu (e.g. a details page)

Add a `<Route>` inside the signed-in group in `App.tsx`, next to the `routes.map(...)`:

```tsx
<Route path="/products/:id" element={<ProductDetailsPage />} />
```

Read the `:id` part in the page:

```tsx
import { useParams } from "react-router-dom";

const { id } = useParams();                                   // "/products/12" -> "12"
const { data } = useDataFetcher<Product>(`products/${id}`);
```

## Links and moving between pages

```tsx
import { Link, NavLink, useNavigate } from "react-router-dom";

<Link to="/products">Back to products</Link>                // a normal link

<NavLink to="/products" className={({ isActive }) => isActive ? "text-primary" : ""}>
  Products                                                   // knows if it's the current page
</NavLink>

const navigate = useNavigate();
navigate("/dashboard");                                      // go there from code, e.g. after saving
navigate(-1);                                                // back
```

Don't use `<a href="/products">` for pages inside the app. It reloads the whole app.

## Query strings (`?tab=history`)

```tsx
import { useSearchParams } from "react-router-dom";

const [params, setParams] = useSearchParams();
const tab = params.get("tab") ?? "details";
setParams({ tab: "history" });
```

Good for things that should survive a reload or be shareable, like the open tab.
