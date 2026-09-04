# Project Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Install and configure the approved Salt & Ember Next.js 16 frontend foundation without overwriting existing repository content or adding deferred systems.

**Architecture:** Generate a disposable reference scaffold in a dedicated temporary directory, integrate only the approved framework files into the existing repository, then initialize shadcn/ui and verify the resulting application. The public UI remains a minimal Server Component shell; visual design, routes, fixtures, forms, and animation integration are deferred.

**Tech Stack:** npm, Next.js 16, React 19, strict TypeScript, Tailwind CSS 4, shadcn/ui, GSAP 3.13+, `@gsap/react`, ESLint flat config

**Spec:** `docs/superpowers/specs/2026-09-05-project-scaffold-design.md`

## Global Constraints

- Do not create any further Git commits.
- Retain `plugins/` and `.kilo/` in `.gitignore`.
- Replace the zero-byte `package.json` and 95-byte `package-lock.json`; do not merge with the stubs.
- Use the latest patched Next.js 16.x and compatible React 19 packages resolved by npm.
- Use Tailwind CSS 4 and `@tailwindcss/postcss`; do not add `tailwind.config.js`.
- Install both `gsap` 3.13+ and `@gsap/react`, but do not create animation integration code yet.
- Initialize shadcn/ui without adding components.
- Do not install Supabase, authentication, EmailJS, Motion or Framer Motion, form libraries, analytics, or backend packages.
- Preserve existing documentation, assets, local directories, and unrelated files.
- Treat shadcn theme variables as scaffold defaults rather than an implemented brand concept.

---

### Task 1: Generate and integrate the framework scaffold

**Files:**
- Replace: `package.json`
- Replace: `package-lock.json`
- Create: `tsconfig.json`
- Create: `next-env.d.ts`
- Create: `next.config.ts`
- Create: `eslint.config.mjs`
- Create: `postcss.config.mjs`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Modify: `.gitignore`

**Interfaces:**
- Produces: a runnable Next.js 16 App Router shell and npm dependency manifest
- Consumes: the repository state and constraints in the approved scaffold specification

- [x] **Step 1: Capture the current state and confirm protected content**

Run:

```powershell
git status --short
Get-Item package.json, package-lock.json | Select-Object Name, Length
Get-Content -Raw .gitignore
rg --files docs
```

Expected: no unrelated working-tree changes; package sizes are 0 and 95 bytes; both custom ignore entries are present.

- [x] **Step 2: Confirm the generator and package versions**

Run:

```powershell
node --version
npm --version
npm view next@16 version --json
npm view react@19 version --json
npm view react-dom@19 version --json
npm view gsap version
npm view @gsap/react version
npx create-next-app@16 --help
```

Expected: Node satisfies Next.js 16's minimum; npm returns current versions; the generator documents the required flags.

- [x] **Step 3: Generate a disposable reference scaffold**

Run the supported equivalents confirmed by the help output:

```powershell
npx create-next-app@16 codex-next-scaffold --typescript --tailwind --eslint --app --empty --import-alias "@/*" --use-npm --disable-git --yes
```

Expected: `codex-next-scaffold` contains a clean Next.js 16 App Router project and its own install succeeds.

- [x] **Step 4: Integrate only approved generated files**

Copy the generated package manifests, TypeScript, Next.js, ESLint, PostCSS, and `app` foundation into the repository. Do not copy the generated README, public assets, editor settings, Git metadata, or generated `.gitignore`.

Expected integrated file set:

```text
package.json
package-lock.json
tsconfig.json
next-env.d.ts
next.config.ts
eslint.config.mjs
postcss.config.mjs
app/layout.tsx
app/page.tsx
app/globals.css
```

- [x] **Step 5: Replace the generated demo with a minimal semantic shell**

Use this page shape:

```tsx
export default function Home() {
  return (
    <main>
      <h1>Salt & Ember</h1>
      <p>Frontend foundation</p>
    </main>
  );
}
```

Set layout metadata to the project name and a short factual description. Keep it a Server Component and add no invented product claims, hero treatment, navigation, or client boundary.

- [x] **Step 6: Merge framework ignores**

Retain the original entries and add the generated framework rules. Confirm the result contains at least:

```gitignore
plugins/
.kilo/
node_modules/
.next/
out/
.env*
!.env.example
.vercel/
*.tsbuildinfo
next-env.d.ts
```

Run:

```powershell
git check-ignore plugins .kilo node_modules .next
```

Expected: every path is reported as ignored.

### Task 2: Install project-specific dependencies and initialize shadcn/ui

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `components.json`
- Create: `lib/utils.ts`
- Modify: `app/globals.css`
- Remove: `components/ui/button.tsx` if seeded by the current initializer

**Interfaces:**
- Consumes: the Tailwind v4 App Router scaffold from Task 1
- Produces: installed GSAP packages and a valid shadcn/ui project with no added UI components

- [x] **Step 1: Install the source-of-truth motion dependencies**

Run:

```powershell
npm install "gsap@^3.13.0" @gsap/react
npm pkg set "scripts.type-check=tsc --noEmit"
```

Expected: both packages appear under runtime dependencies and `type-check` is present under scripts.

- [x] **Step 2: Initialize shadcn/ui and remove the seeded example component**

Run:

```powershell
npx shadcn@latest init --defaults
```

The current CLI seeds `components/ui/button.tsx`. Remove that exact generated file, remove its empty directories, and uninstall only its component-specific dependencies:

```powershell
npm uninstall @base-ui/react class-variance-authority lucide-react
npx shadcn@latest info --json
```

Expected: `components.json`, `lib/utils.ts`, and `app/globals.css` remain; the shadcn component inventory is empty and no `components/ui/*` file remains.

- [x] **Step 3: Inspect the resolved shadcn configuration**

Run:

```powershell
npx shadcn@latest info --json
```

Expected: framework is Next.js App Router, RSC is enabled, Tailwind version is v4, aliases resolve under `@/`, and the installed component list is empty.

- [x] **Step 4: Inspect every generated or modified setup file**

Run:

```powershell
Get-Content -Raw package.json
Get-Content -Raw tsconfig.json
Get-Content -Raw next.config.ts
Get-Content -Raw eslint.config.mjs
Get-Content -Raw postcss.config.mjs
Get-Content -Raw components.json
Get-Content -Raw app/layout.tsx
Get-Content -Raw app/page.tsx
Get-Content -Raw app/globals.css
Get-Content -Raw lib/utils.ts
```

Expected: strict TypeScript, flat ESLint, Tailwind v4 PostCSS integration, Server Component shell, correct aliases, and no deferred technology references.

### Task 3: Remove temporary artifacts and verify the scaffold

**Files:**
- Remove: `codex-next-scaffold/`
- Review: all uncommitted implementation changes

**Interfaces:**
- Consumes: the configured scaffold from Tasks 1 and 2
- Produces: a clean, verified working tree containing only the approved uncommitted project foundation

- [x] **Step 1: Resolve and remove only the disposable scaffold**

Verify the absolute temporary path is inside the repository, then remove that exact directory. Do not use a broad path, wildcard, or unresolved variable.

Expected: `codex-next-scaffold` no longer exists and no repository file was removed.

- [x] **Step 2: Run static verification**

Run:

```powershell
npm run lint
npm run type-check
npm run build
npm ls --depth=0
npm audit --audit-level=moderate
```

Expected: lint, type-check, build, and dependency-tree commands exit successfully; audit reports no moderate-or-higher vulnerability. Any audit finding is investigated rather than auto-fixed blindly.

- [x] **Step 3: Run a production HTTP smoke test**

Start `npm run start` on an available local port after the production build, request the root URL, confirm HTTP 200 and the text `Salt & Ember`, then stop the exact spawned process.

Expected: the built application serves the minimal page successfully.

- [x] **Step 4: Review scope and preservation**

Run:

```powershell
git status --short
git diff --check
git diff -- .gitignore package.json tsconfig.json next.config.ts eslint.config.mjs postcss.config.mjs app components.json lib
rg -n "supabase|emailjs|framer-motion|motion/react|next-auth|@auth" package.json package-lock.json app lib components.json
git check-ignore plugins .kilo
```

Expected: no temporary scaffold remains; the deferred-dependency search returns no matches; both custom directories remain ignored; all implementation changes remain uncommitted.
