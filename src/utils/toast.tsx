import { addToast } from "@heroui/toast";

type ToastColor = "default" | "primary" | "success" | "warning" | "danger";

/**
 * Shows a small message in the top-right corner. A plain function (not a hook), so you can call
 * it from anywhere:
 *
 *   showToast("Saved!", "success");
 *
 * A message with "|" in it (e.g. several validation errors) is shown as a bulleted list.
 */
export function showToast(message: string, color: ToastColor = "default") {
  const description = message.includes("|") ? (
    <ul className="ml-3 list-disc text-xs">
      {message.split("|").map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  ) : (
    <span className="text-xs">{message}</span>
  );

  addToast({ description, color });
}
