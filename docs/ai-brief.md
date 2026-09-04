# Salt & Ember Shared AI Brief

Use this brief at the start of every v0, Bolt, Claude, Gemini, Codex, or Cursor task. The GitHub repository is the only source of truth. Read the relevant existing files before proposing or changing code.

## Project

Build Salt & Ember, a premium dine-in restaurant website for Sylhet, Bangladesh. It combines a dark editorial food-storytelling experience with practical menu, reservation, private-event, and staff-admin workflows.

## Required stack

- Current patched Next.js 16.x, App Router, TypeScript strict mode.
- Tailwind CSS v4, shadcn/ui, GSAP and ScrollTrigger, Supabase, and Vercel.
- Server Components by default. DOM-dependent GSAP logic belongs only in focused client components.

## Design system

- Dark obsidian and charcoal foundation; warm ivory text; ember red, chilli orange, and amber accents.
- Mood: fire meets flavour; premium, warm, editorial, distinctive.
- Use the Salt & Ember logo for colour grading, but do not copy the supplied inspiration site.
- Use Tailwind for normal responsive UI. Custom CSS is allowed only for sophisticated visual effects such as pseudo-elements, masks, texture, gradients, and complex shadows.
- Build mobile-first and support 340px through large desktop and short-height laptops.

## Product boundaries

- Public pages: Home, Menu, About, Reservations, Gallery, Contact.
- No online ordering, delivery, payments, loyalty programme, or diner accounts at launch.
- Reservations are requests with pending, confirmed, and cancelled statuses and operate in Asia/Dhaka.
- Private events require a dedicated enquiry flow.
- Staff roles: admin and editor; use Supabase Auth and Row Level Security.
- Admin scope: menu, gallery, hours and contact settings, reservation statuses, and event enquiries. Do not create a generic page-builder CMS.

## Engineering and quality rules

- Do not use any; use precise types or unknown at external boundaries.
- Do not replace configuration, introduce packages, modify database schema, or change unrelated files without explicitly stating why.
- Do not expose Supabase privileged keys to the browser.
- Validate public submissions server-side and preserve RLS.
- Avoid fixed dimensions that break responsiveness.
- Use semantic HTML, visible focus styles, keyboard-accessible controls, accurate image alt text, and prefers-reduced-motion support.
- GSAP owns scroll, pinning, and parallax. Do not animate the same DOM property with another animation library.
- Do not use scroll-jacking, motion-dependent content, or autoplay video without an image or poster fallback.
- Use next/image and keep image and animation payloads proportionate.

## Collaboration rule

Work on one focused feature at a time. Use a short-lived feature branch, review the diff, run lint, type, and build checks, validate the Vercel preview, then merge to protected main. Preview deployments must not send real emails or write to production reservation data.

## Task response format

Before coding, state the files to change, dependencies needed, implementation approach, and any risk or missing requirement. Keep the change scoped. After coding, report validation performed and any remaining limitation.
