import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import { LayoutDashboard, Package, type LucideIcon } from "lucide-react";

/**
 * Every page behind the login, in one list. Adding a page here adds it to the router (App.tsx)
 * AND to the sidebar (Sidebar.tsx), so this is the only file to touch for a new menu item.
 *
 * `lazy()` loads a page's code only when someone opens it, which keeps the first load small.
 */
export type AppRoute = {
  path: string;
  /** The label in the sidebar. */
  name: string;
  icon: LucideIcon;
  component: LazyExoticComponent<ComponentType>;
};

const routes: AppRoute[] = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: LayoutDashboard,
    component: lazy(() => import("../pages/Dashboard/DashboardPage")),
  },
  {
    path: "/products",
    name: "Products",
    icon: Package,
    component: lazy(() => import("../pages/Products/ProductsPage")),
  },
];

export default routes;
