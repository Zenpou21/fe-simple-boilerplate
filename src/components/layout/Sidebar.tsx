import { NavLink } from "react-router-dom";
import { Boxes } from "lucide-react";
import routes from "../../routes";
import { APP_NAME } from "../../globals/apiConfig";

type SidebarProps = {
  /** Only used on phones; on desktop the sidebar is always shown. */
  isOpen: boolean;
  onClose: () => void;
};

/** The menu. Its items come from src/routes/index.ts. */
export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Dark backdrop behind the open menu on phones; a tap closes it. */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-divider bg-content1 transition-transform lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-divider px-5">
          <Boxes className="text-primary" size={24} />
          <span className="font-semibold">{APP_NAME}</span>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {routes.map(({ path, name, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                  isActive ? "bg-primary text-white" : "text-default-600 hover:bg-default-100"
                }`
              }
            >
              <Icon size={18} />
              {name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
