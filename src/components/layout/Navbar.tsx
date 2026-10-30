import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { LogOut, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

/** The top bar: menu button (phones) and the user's name with a Sign out option. */
export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-divider bg-content1 px-4">
      <Button isIconOnly variant="light" className="lg:hidden" onPress={onMenuClick} aria-label="Open menu">
        <Menu size={20} />
      </Button>
      <div className="flex-1" />

      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <button className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-default-100">
            <Avatar name={user?.name} size="sm" color="primary" />
            <span className="hidden text-sm sm:block">{user?.name}</span>
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Account">
          <DropdownItem key="email" isReadOnly className="opacity-70">
            {user?.email}
          </DropdownItem>
          <DropdownItem key="logout" color="danger" startContent={<LogOut size={16} />} onPress={logout}>
            Sign out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </header>
  );
}
