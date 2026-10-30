/// <reference types="vite/client" />

// The values you can read with import.meta.env (they come from .env).
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_API_URL: string;
}
