# passoff

Монорепо на pnpm workspaces:

- `cms/` — Strapi 5 (http://localhost:1337, админка на `/admin`)
- `web/` — Next.js 16 (http://localhost:3000)

## Установка (Windows)

```powershell
winget install OpenJS.NodeJS.LTS
winget install pnpm.pnpm
```

## Запуск

```bash
pnpm install
pnpm dev          # оба сервера сразу
pnpm dev:cms      # только Strapi
pnpm dev:web      # только Next
```