import { Button, Modal, ModalBody, ModalContent, ModalFooter } from "@heroui/react";
import { AlertCircle, Trash2 } from "lucide-react";

type ConfirmModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  message?: string;
  /** For deletes: red icon and a red "Delete" button. */
  isDestructive?: boolean;
};

/**
 * "Are you sure?" before saving or deleting. Open it with HeroUI's useDisclosure():
 *
 *   const confirm = useDisclosure();
 *   <Button onPress={confirm.onOpen}>Delete</Button>
 *   <ConfirmModal isOpen={confirm.isOpen} onOpenChange={confirm.onOpenChange} onConfirm={handleDelete} isDestructive />
 */
export default function ConfirmModal({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading = false,
  title = "Are you sure?",
  message = "Please confirm to continue.",
  isDestructive = false,
}: ConfirmModalProps) {
  const Icon = isDestructive ? Trash2 : AlertCircle;

  return (
    <Modal size="sm" placement="center" backdrop="blur" hideCloseButton isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className="items-center pt-8 text-center">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full ${
                  isDestructive ? "bg-danger-50 text-danger" : "bg-primary-50 text-primary"
                }`}
              >
                <Icon size={26} />
              </div>
              <h2 className="mt-2 text-lg font-semibold">{title}</h2>
              <p className="text-sm text-default-500">{message}</p>
            </ModalBody>
            <ModalFooter className="justify-center">
              <Button variant="flat" onPress={onClose} isDisabled={isLoading}>
                Cancel
              </Button>
              <Button color={isDestructive ? "danger" : "primary"} onPress={onConfirm} isLoading={isLoading}>
                {isDestructive ? "Delete" : "Confirm"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
