# npm, ESLint and handy tools

## npm: packages and scripts

**npm** comes with Node.js (install Node 20 or newer from https://nodejs.org). It downloads the libraries listed in `package.json` into `node_modules/`.

```bash
npm install                  # download everything in package.json (after cloning, or after a pull that changed it)
npm install dayjs            # add a library (goes into "dependencies")
npm install -D prettier      # add a tool only needed while coding ("devDependencies")
npm uninstall dayjs          # remove one
npm outdated                 # see which libraries have newer versions
```

- `package.json` lists the libraries you asked for. `package-lock.json` records the exact versions installed. **Commit both.**
- Never commit `node_modules/`. It's rebuilt by `npm install`, and it's already in `.gitignore`.
- `"^19.0.0"` means "19.0.0 or any newer 19.x".

The scripts in `package.json`:

```bash
npm run dev       # start the dev server
npm run build     # type-check and build into dist/
npm run lint      # ESLint
npm run preview   # try the built dist/
```

## ESLint: catching mistakes

ESLint reads the code and warns about bugs and bad habits: unused variables, a missing `useEffect` dependency, hooks inside an `if`. The rules are in `eslint.config.js`.

```bash
npm run lint
```

Run it before committing, and fix every warning. With the VS Code ESLint extension, the warnings show as you type.

## VS Code extensions worth installing

| Extension | Why |
| --- | --- |
| **ESLint** | lint warnings in the editor |
| **Tailwind CSS IntelliSense** | autocomplete and preview for class names |
| **Prettier** | formats the code when you save (optional) |
| **PHP Intelephense** | for the Laravel API |

## Debugging in the browser (F12)

- **Console** shows errors and your `console.log(...)`. Remove the logs when done.
- **Network** shows every API call. Click one to see:
  - **Headers:** the URL and method.
  - **Payload:** what was sent.
  - **Response:** what the API answered. Look here first when a save fails; the `message` usually says why.
  - Status `401` = not signed in, `404` = not found, `422` = a validation rule failed, `500` = a bug in the API (check `storage/logs/laravel.log` in the API).
- **Application → Cookies** shows `auth_token` when you're signed in. You can't read it from JavaScript, by design.
- Install **React Developer Tools** (Chrome/Edge extension) to see components, their props and their state.

## Git (the basics)

```bash
git status                       # what changed
git add .                        # stage everything
git commit -m "Add customers"    # save a snapshot
git pull                         # get others' changes
git push                         # send yours
```

`.env`, `node_modules/` and `dist/` are ignored on purpose.
