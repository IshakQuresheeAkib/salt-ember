# Animation plans

| # | Plan | Severity | Status |
| --- | --- | --- | --- |
| 001 | [Recover hero autoplay after interaction](./001-recover-hero-autoplay-after-interaction.md) | HIGH | DONE |

## Recommended execution order

1. Execute plan 001 first. It is a self-contained hero lifecycle fix with no
   dependency on another plan.

## Dependencies

- Plan 001 has no plan dependencies. Preserve the current uncommitted changes
  in `components/hero-food-selector.tsx` and `app/globals.css` while executing
  it.
