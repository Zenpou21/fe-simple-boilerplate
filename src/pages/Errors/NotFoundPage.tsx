import { Button } from "@heroui/react";
import { Link } from "react-router-dom";

/** Shown for any URL that isn't in App.tsx. */
export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center">
      <h1 className="text-5xl font-semibold text-primary">404</h1>
      <p className="text-default-500">This page does not exist.</p>
      <Button as={Link} to="/" color="primary" variant="flat">
        Go home
      </Button>
    </div>
  );
}
