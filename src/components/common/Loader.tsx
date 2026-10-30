import { Spinner } from "@heroui/react";

/** Full-screen spinner, shown while we check whether the user is signed in. */
export default function Loader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner />
    </div>
  );
}
