import type { ReactNode } from "react";

const COLORS = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  default: "bg-default-400",
};

/**
 * A colored dot with a label, for status columns.
 *
 *   <StatusDot color={product.is_active ? "success" : "default"}>Active</StatusDot>
 */
export default function StatusDot({ color, children }: { color: keyof typeof COLORS; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${COLORS[color]}`} />
      {children}
    </span>
  );
}
