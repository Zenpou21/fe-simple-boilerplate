# Vite

**What it is:** the tool that runs the app while you code (with instant reload when you save) and builds it into plain files for a real server.

**Where we use it:** `vite.config.ts`, `index.html`, `.env`, and the `npm run dev` / `npm run build` commands.

Official docs: https://vite.dev/guide/

---

## Running the app

```bash
npm run dev       # http://localhost:5173, reloads on every save
```

If port 5173 is busy, Vite picks the next free one (5174, ...) and prints it. Then update `BASE_URL` in the API's `.env`, or the browser blocks the requests (CORS).

## Environment variables (`.env`)

Settings that change per computer or server live in `.env`, not in the code:

```env
VITE_APP_NAME="Simple Boilerplate"
VITE_API_URL=http://localhost:8000
```

Read them in code with `import.meta.env`:

```ts
// src/globals/apiConfig.ts
export const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/`;
```

Rules:
- Only names that start with **`VITE_`** reach the code. Others are ignored on purpose.
- **Restart `npm run dev` after editing `.env`.** Vite reads it only at start.
- Everything in `VITE_` variables ends up in the browser, where anyone can read it. Never put passwords or secret keys there.
- `.env` is not committed (it's in `.gitignore`). `.env.example` is the template that is committed. When you add a variable, add it to both.
- To add a typed variable, also add it to `src/vite-env.d.ts`.

`index.html` can use them too: `<title>%VITE_APP_NAME%</title>`.

## Building for a server

```bash
npm run build     # type-check, then write the site to dist/
npm run preview   # serve dist/ locally to try the built version
```

Upload the contents of `dist/` to any web server. It is just HTML, JS and CSS.

The server must send `index.html` for every URL (e.g. `/products`), because React Router handles the URLs inside the browser.

## What `vite.config.ts` does here

- `plugins: [react(), tailwindcss()]` turns on React (JSX, fast refresh) and Tailwind.
- `server.port` is the dev port.
- `manualChunks` puts big libraries (React, HeroUI, ...) in their own files so browsers cache them between deploys.

Pages in `src/routes/index.ts` use `lazy(() => import(...))`, so Vite gives each page its own small file that loads only when someone opens it.

## Importing files

```ts
import ProductForm from "./ProductForm";            // our own file (no extension needed)
import { Button } from "@heroui/react";             // a package from node_modules
import "@fontsource/poppins/latin-400.css";         // CSS: Vite adds it to the page
```
