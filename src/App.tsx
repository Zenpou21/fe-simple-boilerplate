import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Loader from "./components/common/Loader";
import LoginPage from "./pages/Auth/LoginPage";
import NotFoundPage from "./pages/Errors/NotFoundPage";
import { GuestRoute, PrivateRoute } from "./routes/guards";
import routes from "./routes";

/**
 * The URL map of the app.
 *   /login      -> anyone (signed-in users are sent to /dashboard)
 *   everything  -> signed-in users only, inside the Layout (sidebar + top bar)
 *
 * To add a page, add it to src/routes/index.ts, not here.
 */
export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />

      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {routes.map(({ path, component: Page }) => (
          <Route
            key={path}
            path={path}
            element={
              <Suspense fallback={<Loader />}>
                <Page />
              </Suspense>
            }
          />
        ))}
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
