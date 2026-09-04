# Salt & Ember project scaffold design

## Objective

Create a minimal, production-oriented frontend scaffold for the Salt & Ember public website while preserving the repository's existing documentation, ignored local directories, and phase-one boundaries.

## Repository handling

- Work in place; do not run `create-next-app` against the non-empty repository.
- Preserve all existing documentation, assets, `plugins/`, `.kilo/`, and unrelated files.
- Merge framework ignore rules into the existing `.gitignore`. Retain `plugins/` and `.kilo/`.
- Replace the zero-byte `package.json` and 95-byte stub `package-lock.json`; do not merge with either stub.
- Use npm and record exact resolved versions in the regenerated lockfile.

## Framework and dependencies

Install the latest patched Next.js release within major version 16 with compatible React 19 and React DOM versions.

Runtime dependencies:

- `next` 16.x
- `react` 19.x
- `react-dom` 19.x
- `gsap` 3.13 or newer
- `@gsap/react`, as required by `PROJECT_CONTEXT.md`

Development dependencies:

- `typescript` in strict mode
- `@types/node`, `@types/react`, and `@types/react-dom`
- Tailwind CSS 4 and `@tailwindcss/postcss`
- `eslint` and the matching Next.js 16 `eslint-config-next`

Initialize shadcn/ui through the current CLI after the Next.js and Tailwind scaffold exists. It may add its required utility dependencies and must create valid `components.json` and `lib/utils.ts` files. Add no UI components in this task.

Do not install Supabase, authentication, EmailJS, backend persistence, Motion or Framer Motion, form libraries, analytics, or other speculative packages. GSAP and `@gsap/react` are deliberate forward dependencies because the source-of-truth brief mandates them for the later motion pass; they will not be used in the static scaffold.

## Configuration and source files

Create or replace only the minimal files required for a runnable App Router project:

- `package.json` and `package-lock.json`
- `tsconfig.json` and `next-env.d.ts`
- `next.config.ts`
- `eslint.config.mjs`
- `postcss.config.mjs`
- `components.json`
- `app/layout.tsx`, `app/page.tsx`, and `app/globals.css`
- `lib/utils.ts`

Merge framework output rules into `.gitignore`.

Package scripts:

- `dev`: `next dev`
- `build`: `next build`
- `start`: `next start`
- `lint`: `eslint .`
- `type-check`: `tsc --noEmit`

The initial page will be a small semantic placeholder. It will not invent the eventual visual design, copy, interactions, routes, or component architecture. Any shadcn theme variables are initialization defaults; a later accepted concept will map them to the canonical tokens in `docs/brand.md`.

## Architectural constraints

- Use the App Router and React Server Components by default.
- Keep future browser-dependent GSAP and interactive state in narrow client components.
- Use direct imports and strict TypeScript; do not introduce `any`.
- Do not add real submission, storage, authentication, admin, ordering, payment, or account behavior.
- Do not prematurely scaffold all public routes during this package-and-foundation task.
- When the motion pass begins, register GSAP plugins and `useGSAP` once in `lib/gsap.ts`; do not create that integration before it is used.

## Installation sequence

1. Capture the current repository state and preserve unrelated files.
2. Generate a clean Next.js 16 reference scaffold in a temporary directory rather than targeting the repository root.
3. Integrate only the approved framework files and replace the package stubs.
4. Install the required runtime and development dependencies in the repository root.
5. Add the minimal App Router shell and strict configuration.
6. Initialize shadcn/ui without components and inspect every generated or changed file.
7. Merge `.gitignore`, retaining `plugins/` and `.kilo/`.
8. Remove temporary scaffold artifacts.
9. Review the final diff for overwritten user files or unexpected generated content.
10. Run fresh verification.

## Verification

Required checks:

1. `npm run lint`
2. `npm run type-check`
3. `npm run build`
4. `npm ls --depth=0`
5. `npm audit --audit-level=moderate`
6. Brief production-server HTTP smoke test when the environment permits

A smoke-test limitation will be reported explicitly rather than treated as a successful check.

## Risks and mitigations

- **Existing ignore rules lost:** merge `.gitignore` and verify both custom entries remain ignored.
- **Malformed package stubs:** replace both package files and let npm regenerate the lockfile.
- **Version drift:** query current package metadata during installation while constraining Next.js and Tailwind to the required major versions.
- **shadcn theme drift:** treat generated variables as scaffold defaults, not the Salt & Ember brand implementation.
- **Node lifecycle:** Node 20.14.0 satisfies Next.js 16's runtime minimum but is end-of-life; recommend Node 22 LTS separately.
- **Unapproved visual design:** keep the initial route deliberately minimal and defer visual work until concept acceptance.
- **Temporary scaffold leakage:** review the copied file list and delete the exact temporary directory after integration.

## Completion criteria

The setup is complete when all expected files exist, existing content remains intact, `plugins/` and `.kilo/` remain ignored, the dependency tree contains no deferred systems, and all required verification commands exit successfully.
