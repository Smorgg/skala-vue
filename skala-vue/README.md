# skala-vue

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm ci
```

This project uses Node.js `22.18.0`. The version is pinned in `.nvmrc` so that
macOS and Windows can use the same runtime.

### macOS

Using `nvm`:

```sh
nvm install
nvm use
npm ci
```

### Windows

Install Git, VS Code, and a Node version manager such as `nvm-windows`, then run
the following commands in PowerShell:

```powershell
git clone https://github.com/Smorgg/Vue.git
cd Vue\skala-vue
nvm install 22.18.0
nvm use 22.18.0
npm ci
npm run dev
```

If `nvm` is not used, install Node.js `22.18.0` directly and verify the version:

```powershell
node --version
npm --version
```

Use `npm ci` after cloning or pulling dependency changes. It installs the exact
versions recorded in `package-lock.json`.

### Environment Variables

Create a local environment file from the committed example:

```sh
cp .env.example .env
```

In Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Keep `.env` local and never commit secrets. Variables prefixed with `VITE_` are
included in client-side code and must not contain secret values.

### Editor Consistency

- Open the `skala-vue` folder in VS Code and install the recommended extensions.
- Enable VS Code Settings Sync to share personal extensions, keyboard shortcuts,
  and editor settings between computers.
- `.editorconfig` keeps indentation and formatting consistent.
- `.gitattributes` keeps line endings as LF on macOS and Windows.

### Daily Git Workflow

Before starting work:

```sh
git pull
npm ci
```

After finishing work:

```sh
git add .
git commit -m "Describe the change"
git push
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
