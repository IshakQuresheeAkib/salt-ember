# Design Document: Food Menu Card Glassmorphism & Component Extraction

## 1. Intent & Purpose
Extract the inline `FoodMenuCard` from `components/food-menu-section.tsx` into a standalone, reusable, high-craft component `components/food-menu-card.tsx`.
Elevate its visual styling to an award-winning dark glassmorphism aesthetic tailored to Salt & Ember's charcoal and ember palette (`#0b2228`, `#e4e4e4`, `#e36414`).

## 2. Goals
- Extract `FoodMenuCard` into `components/food-menu-card.tsx` with clean TypeScript typing.
- Implement an authentic frosted glass effect:
  - Multi-tier background blur (`backdrop-blur-xl`).
  - Dark translucent backing (`bg-white/[0.04]` over `bg-surface/40` or gradient wash) with specular inner highlight.
  - Fine specular border (`border border-white/10 hover:border-orange/40`).
  - Subtle ember radial glow on hover (`group-hover:shadow-[0_24px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(227,100,20,0.15)]`).
- Replace light-theme neutral text colors with crisp high-contrast silver/white typography:
  - Dish name in `text-silver font-heading` with warm hover shift `group-hover:text-orange`.
  - Description in `text-muted-foreground`.
  - Price in `text-silver font-bold`.
- Ensure clean interactive state for the favorite button and responsive image sizes.
- Verify that `components/food-menu-section.tsx` imports and renders `FoodMenuCard`.

## 3. Non-Goals
- Modifying category tabs, category definitions, or dataset items in `food-menu-data.ts`.
- Changing the layout grid structure in `FoodMenuSection`.

## 4. Constraints
- Must not introduce horizontal scrollbar bugs.
- Must honor reduced motion settings.
- Must preserve image optimization and fallback states.
- No emojis anywhere in code, comments, or output.
