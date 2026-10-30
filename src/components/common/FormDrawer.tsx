import type { ReactNode } from "react";
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from "@heroui/react";

type FormDrawerProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  /** The buttons at the bottom (Close, Edit, Save, ...). */
  footer: ReactNode;
  children: ReactNode;
};

/**
 * The panel that slides in from the right with a form: used for Add, View and Edit.
 * See pages/Products/ProductForm.tsx for a full example.
 */
export default function FormDrawer({ title, isOpen, onClose, footer, children }: FormDrawerProps) {
  return (
    <Drawer
      isOpen={isOpen}
      // Closing (Esc, backdrop click, the X) goes through onClose so the form can reset.
      onOpenChange={(open) => !open && onClose()}
      radius="none"
      size="md"
    >
      <DrawerContent>
        <DrawerHeader className="border-b border-divider text-base font-semibold">{title}</DrawerHeader>
        <DrawerBody className="py-4">{children}</DrawerBody>
        <DrawerFooter className="justify-between border-t border-divider">{footer}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
