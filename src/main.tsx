/**
 * The app starts here. This file only wraps <App /> in "providers": components that give every
 * page something it can use. You rarely need to change it.
 *
 *   BrowserRouter  -> page URLs (react-router-dom)
 *   SWRConfig      -> caching rules for API reads (see globals/swrConfig.ts)
 *   HeroUIProvider -> the UI component library (buttons, tables, drawers, ...)
 *   AuthProvider   -> who is signed in (see context/AuthContext.tsx)
 */
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { SWRConfig } from "swr";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import swrConfig from "./globals/swrConfig";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <SWRConfig value={swrConfig}>
      <HeroUIProvider>
        {/* Where showToast() messages appear. */}
        <ToastProvider placement="top-right" toastProps={{ variant: "flat", timeout: 3000 }} />
        <AuthProvider>
          <App />
        </AuthProvider>
      </HeroUIProvider>
    </SWRConfig>
  </BrowserRouter>
);
