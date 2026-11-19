# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Astro dev server
- `npm run build` / `npm run preview` — production build / serve it
- `npm run lint` — ESLint (flat config in `eslint.config.js`)
- `npm run typecheck` — `astro check` (covers `.astro` and `.tsx`)
- `npm run format` — Prettier (`ts`, `tsx`, `astro`; uses the Astro and Tailwind plugins)

Requires Node >=22.23.4. There is no test runner configured.

## Architecture

Astro 7 site with React islands, Tailwind CSS v4 (via `@tailwindcss/vite`, no `tailwind.config`), and shadcn/ui. It is still close to the starter template: one page, one layout, one component.

- `src/pages/` — file-based routes (`.astro`). `src/layouts/main.astro` is the shared shell and imports `src/styles/global.css`.
- React components render as islands only when given a `client:*` directive in an `.astro` file (e.g. `<Button client:load />`). Without one they render as static HTML with no interactivity.
- `@/*` maps to `src/*` (see `tsconfig.json`).
- `src/styles/global.css` holds the theme: Counsel palette tokens (see DESIGN.md) mapped onto the shadcn variables, light only, 0px radius. Fonts are Hanken Grotesk (headings) and Inter (body) via `@fontsource-variable`.

## shadcn/ui specifics

- Config is in `components.json`: style `base-nova`, which builds on **Base UI** (`@base-ui/react`), not Radix. Don't write Radix-style APIs such as `asChild`; check the Base UI primitive's API instead.
- Add components with `npx shadcn@latest add <name>`. They go in `src/components/ui/`.
- Class merging uses `cn` from the `cn` npm package (`import { cn } from "cn"`), as in `button.tsx`. `src/lib/utils.ts` also exists, so check which one a file uses before adding imports.
- In `.astro` files, pass classes to React components as `className` (see `index.astro`).
