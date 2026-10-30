import { Button, Tooltip } from "@heroui/react";
import { Eye, Pen, Trash2 } from "lucide-react";

export type RowAction = "View" | "Edit" | "Delete";

type RowActionsProps = {
  onAction: (action: RowAction) => void;
  /** Which buttons to show. Default: all three. */
  actions?: RowAction[];
};

const BUTTONS: Record<RowAction, { icon: React.ReactNode; className: string }> = {
  View: { icon: <Eye size={18} />, className: "text-primary" },
  Edit: { icon: <Pen size={18} />, className: "text-warning" },
  Delete: { icon: <Trash2 size={18} />, className: "text-danger" },
};

/**
 * The View / Edit / Delete icon buttons in a table row's ACTION column.
 *
 *   <RowActions onAction={(action) => openRow(product, action)} />
 */
export default function RowActions({ onAction, actions = ["View", "Edit", "Delete"] }: RowActionsProps) {
  return (
    <div className="flex items-center justify-center">
      {actions.map((action) => (
        <Tooltip key={action} content={action} delay={300} closeDelay={0}>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            aria-label={action}
            className={BUTTONS[action].className}
            onPress={() => onAction(action)}
          >
            {BUTTONS[action].icon}
          </Button>
        </Tooltip>
      ))}
    </div>
  );
}
