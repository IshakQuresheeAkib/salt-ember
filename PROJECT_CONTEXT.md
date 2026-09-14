# Salt & Ember — Project Context

`PROJECT_CONTEXT.md` is the source of truth for the repository's current implementation and contribution rules. Derived documents must agree with it.

## Product boundary

Salt & Ember is a frontend-only, single-page restaurant concept for Sylhet, Bangladesh. The current homepage has Hero, Menu, Reviews, and Contact anchors only. It has no backend, database, authentication, CMS, ordering, delivery, payment, reservation, or private-event workflow.

Menu dishes, prices, testimonials, email address, and remote imagery remain sample content. The user-approved public details are the Baruthkhana Point, East Zindabazar, Sylhet location; +880 1704 083 376 for calls and WhatsApp; and the listed Facebook and Instagram destinations. Keep the hero and footer contact details in sync.

## Active stack

Use `package.json` as the authority for exact versions.

- Next.js 16 App Router and React 19
- strict TypeScript (`npm run type-check`)
- Tailwind CSS v4 with global tokens in `app/globals.css`
- GSAP, `@gsap/react`, ScrollTrigger, SplitText, MotionPathPlugin, and CustomEase
- Framer Motion for testimonial columns and `MotionConfig`
- `next/image` with remote patterns defined in `next.config.ts`

Use `npm run lint`, `npm run type-check`, and `npm run build`. `next lint` is unavailable in Next.js 16.

## Current structure

```
app/
  layout.tsx                 # fonts and page metadata
  page.tsx                   # homepage composition and header/footer
  globals.css                # token layer and component styling
components/
  header.tsx                 # site navigation and location link
  footer.tsx                 # contact and social links
  hero-section.tsx           # homepage hero composition
  hero-food-selector.tsx     # hero state, motion, pause control
  menu.tsx                   # category-filtered sample menu
  testimonials.tsx           # animated/static testimonial presentation
  ui/
    social-media.tsx         # social and contact link tooltips
    text-block-animation.tsx # GSAP line-reveal enhancement
lib/
  constants/testimonials.ts  # typed testimonial fixtures
  gsap.ts                    # one-time GSAP plugin registration
  types.ts                   # shared testimonial type
tests/                       # focused browser/source regression checks
```

## Canonical design tokens

Define brand values once in `app/globals.css`; component files consume variables or Tailwind token utilities rather than raw hex values.

| Token | Value | Role |
| --- | --- | --- |
| `silver-mist` | `#E4E4E4` | primary text and visible focus outline |
| `flameburst-orange` | `#FC5000` | actions, selected states, fine rules, and heat |
| `midnight-shadow` | `#050505` | page canvas and dark text on bright controls |

`surface`, `border`, and `muted-foreground` are semantic derived tokens. Do not reintroduce the retired amber palette or create another brand naming layer.

## Design and responsive rules

- Preserve The Ember Seam: an off-centre hero split and curved food path, not a generic orange-on-black template.
- Use Cormorant Garamond for display type and Inter for body/UI through `next/font`.
- Build from 340px upward. The current breakpoints include mobile styles at 800px and 480px; verify wider desktop and short-height layouts when changing composition.
- Use semantic HTML, visible focus, stable aspect ratios, and touch targets of at least 2.5rem where controls are present.
- Keep Tailwind for ordinary layout and states. Custom CSS is appropriate for token definitions, masks, gradients, complex shadows, and the component-specific visual system already in `globals.css`.

## Motion and accessibility rules

- GSAP owns the hero path transitions and text block reveals. Framer Motion owns testimonial column translation. Do not animate the same property on the same element from both systems.
- The hero rotation pauses while hovered, focused, hidden, manually paused, or when reduced motion is requested. The pause/resume button is mandatory while automatic rotation is active.
- `TextBlockAnimation` does not animate below 768px or under `prefers-reduced-motion`.
- Testimonial columns become a static, complete list under reduced motion. Duplicated cards in animated loops are hidden from assistive technology.
- Motion must remain progressive enhancement; no content or control may depend on a successful animation.

## Implementation rules

- Keep server components as the default and keep client boundaries focused on state, effects, browser APIs, or animation.
- Use stable keys and derive display values during render.
- Use `next/image` with useful alternatives for meaningful images and empty alternatives for decorative repeats.
- Do not add a package, service, or public claim without an approved need and matching documentation update.
- Preserve user-owned worktree changes. Do not commit, publish, deploy, or alter remote systems unless explicitly requested.

## Validation expectations

For source changes, run the relevant focused tests first, then lint, type-check, and production build as appropriate. For UI changes, also verify anchor navigation, menu filtering, the hero controls, testimonial reduced-motion presentation, keyboard focus, and desktop/mobile rendering in a browser.
