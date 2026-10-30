import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import { useAuth } from "../context/AuthContext";

/** Pages for signed-in users only. Everyone else is sent to /login. */
export function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

/** The login page. A user who is already signed in goes straight to the dashboard. */
export function GuestRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}
