import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { SESSION_EXPIRED_EVENT } from "../services/apiClient";
import useCrud from "../hooks/useCrud";
import type { User } from "../types/auth";

/**
 * Who is signed in, for every page. Use it anywhere with:
 *
 *   const { user, login, logout } = useAuth();
 */
type AuthContextType = {
  user: User | null;
  /** True while we check, on page load, whether the user is still signed in. */
  loading: boolean;
  isAuthenticated: boolean;
  /** Signs in. Returns true when it worked (a wrong password shows a toast). */
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { get, post } = useCrud();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On page load: the cookie may still be valid, so ask the API who we are.
  useEffect(() => {
    get<User>("me")
      .then((result) => setUser(result.ok ? result.data : null))
      .finally(() => setLoading(false));
  }, [get]);

  // The API answered 401 somewhere (token expired): treat the user as signed out.
  useEffect(() => {
    const signOut = () => setUser(null);
    window.addEventListener(SESSION_EXPIRED_EVENT, signOut);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, signOut);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      // The API checks the password and sets the HttpOnly cookie; we get the user back.
      const result = await post<User>("auth/login", { email, password });
      if (result.ok) setUser(result.data);
      return result.ok;
    },
    [post]
  );

  const logout = useCallback(async () => {
    await post("logout", undefined, { toast: false });
    setUser(null);
  }, [post]);

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: user !== null, login, logout }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// The hook lives next to its provider on purpose; this only turns off a dev-reload hint.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
