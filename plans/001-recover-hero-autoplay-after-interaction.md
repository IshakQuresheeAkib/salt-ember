# 001 — Recover hero autoplay after interaction

- **Status**: DONE
- **Commit**: 09addf2
- **Severity**: HIGH
- **Category**: Interruptibility and accessibility
- **Estimated scope**: 5 files, focused policy, control, styles, and regression coverage
- **Worktree note**: The commit stamp has uncommitted user changes in `components/hero-food-selector.tsx` and `app/globals.css`; preserve them. In particular, do not remove or rewrite the current SVG gradient or unrelated styling.

## Problem

The hero autoplay can remain stopped after a visitor clicks a category. The
component treats every focus event as a pause reason, including pointer-induced
focus, and only clears that reason when focus leaves the entire hero:

```tsx
// components/hero-food-selector.tsx:87-88 — current
const [isPointerHovered, setIsPointerHovered] = useState(false);
const [isFocusWithin, setIsFocusWithin] = useState(false);
```

```tsx
// components/hero-food-selector.tsx:111-115 — current
const shouldScheduleRotation =
  !isPointerHovered &&
  !isFocusWithin &&
  isDocumentVisible &&
  !reducedMotion;
```

```tsx
// components/hero-food-selector.tsx:434-440 — current
onPointerEnter={() => setIsPointerHovered(true)}
onPointerLeave={() => setIsPointerHovered(false)}
onFocusCapture={() => setIsFocusWithin(true)}
onBlurCapture={(event) => {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    setIsFocusWithin(false);
  }
}}
```

Clicking a category focuses its button. After the pointer leaves, focus remains
inside `.hero-art`, `isFocusWithin` remains `true`, and the effect at
`components/hero-food-selector.tsx:156-175` keeps returning before it creates
the next timer. This makes the intended accessibility pause look like an
intermittent animation failure.

The recovery and status control required by `PROJECT_CONTEXT.md:67` is also
absent from the current markup. Commit `2683baa` removed the
`isRotationPaused` state, `.hero-rotation-toggle` markup, and its CSS. Restoring
the old code verbatim is insufficient because the old focus gate also prevented
the Resume button from restarting autoplay while that button retained focus.

## Target

Use an explicit, user-visible pause latch for manual and keyboard-focus pauses,
while retaining temporary pause reasons for hover, document visibility, and
reduced motion:

```tsx
const [isRotationPaused, setIsRotationPaused] = useState(false);
const [isPointerHovered, setIsPointerHovered] = useState(false);

const shouldScheduleRotation =
  !isRotationPaused &&
  !isPointerHovered &&
  isDocumentVisible &&
  !reducedMotion;
```

Pointer-induced focus must not latch the rotation. Keyboard-visible focus must
pause it and expose the Resume state. Use the platform focus-visible heuristic
rather than global pointer/keyboard listeners:

```tsx
onFocusCapture={(event) => {
  if ((event.target as HTMLElement).matches(":focus-visible")) {
    setIsRotationPaused(true);
  }
}}
```

Do not keep `isFocusWithin` in `shouldScheduleRotation`. A user who explicitly
activates Resume must be able to resume while the control still has focus.

Restore a mandatory control after `.hero-categories`:

```tsx
<button
  type="button"
  className="hero-rotation-toggle"
  data-paused={isRotationPaused ? "true" : "false"}
  onClick={() => setIsRotationPaused((paused) => !paused)}
>
  {isRotationPaused ? "Resume rotation" : "Pause rotation"}
</button>
```

Restore the existing visual language rather than introduce a new motion style:

```css
.hero-rotation-toggle {
  min-height: 2.5rem;
  padding: 8px 12px;
  border: 1px solid var(--flameburst-orange);
  border-radius: 0.625rem;
  background: var(--midnight-shadow);
  color: var(--silver-mist);
  cursor: pointer;
  font: inherit;
  font-size: 11px;
  font-weight: 700;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background 0.2s ease;
}

.hero-rotation-toggle[data-paused="true"] {
  border-color: var(--flameburst-orange);
  color: var(--flameburst-orange);
}
```

The dish path, `0.8s` movement, `0.6s` fades, `0.8s` dwell, and Ember easing
must remain unchanged. This is a lifecycle/control fix, not a retiming pass.

## Repo conventions to follow

- Keep state and browser-event logic inside
  `components/hero-food-selector.tsx`; the hero is already the focused client
  boundary for this behavior.
- Keep component-specific visual rules in `app/globals.css` and consume the
  canonical `--flameburst-orange`, `--midnight-shadow`, and `--silver-mist`
  tokens.
- Follow the existing source-regression style in
  `tests/hero-food-orbit-direction.test.mjs`: `node:test`, `node:assert/strict`,
  and `readFile` with no new dependency.
- Preserve the existing temporary pause gates for pointer hover, hidden
  documents, and `prefers-reduced-motion`.

## Steps

1. Create `tests/hero-food-autoplay-state.test.mjs` first. Read
   `components/hero-food-selector.tsx` and assert that the component contains
   `isRotationPaused`, a `hero-rotation-toggle`, and a `:focus-visible` check;
   assert that `shouldScheduleRotation` does not contain `!isFocusWithin`.
   Run this test before implementation and retain the expected failing output
   as the reproduction.
2. In `components/hero-food-selector.tsx`, replace `isFocusWithin` with the
   explicit `isRotationPaused` latch. Remove the blur-capture cleanup because
   a keyboard-triggered pause must remain paused until the user explicitly
   resumes.
3. Gate autoplay on `!isRotationPaused`, keeping hover, visibility, and reduced
   motion unchanged. In `onFocusCapture`, latch pause only when the newly
   focused target matches `:focus-visible`.
4. Restore the pause/resume button after the category list. Its explicit click
   must toggle the latch even while the button retains focus. Use the changing
   command label (`Pause rotation` / `Resume rotation`) as the accessible name;
   do not combine that changing name with `aria-pressed`. Use `data-paused` for
   the visual-state selector.
5. Restore `.hero-rotation-toggle` and its pressed-state CSS in
   `app/globals.css`. Keep the current control layout and all unrelated CSS
   intact.
6. Run the focused test, then the repository checks and the feel checks below.

## Boundaries

- Do NOT change the SVG curve gradient or any current uncommitted hero styling.
- Do NOT change food data, imagery, text, DOM order, path geometry, easing,
  durations, or dwell timing.
- Do NOT remove hover, hidden-document, or reduced-motion pausing.
- Do NOT add a package or animation library.
- Do NOT edit `PROJECT_CONTEXT.md`; its current pause-control contract is the
  requirement this plan restores.
- If these excerpts no longer match the worktree, STOP and report the drift
  instead of improvising.

## Verification

- **Failing regression first**:
  `node --test tests/hero-food-autoplay-state.test.mjs` must fail on the current
  source because the explicit control and focus-visible policy are absent.
- **Focused mechanical checks**:
  `node --test tests/hero-food-autoplay-state.test.mjs tests/hero-composition.test.mjs`
  must pass after the change.
- **Known baseline drift**:
  `node --test tests/hero-food-orbit-direction.test.mjs tests/hero-food-orbit-exit-visibility.test.mjs`
  currently fails before this plan: the tests assert a `500ms` dwell and a
  `0.18s` fade while the component uses `800ms` and `0.6s`. Run and report
  these separately; do not change animation timing or those tests under this
  lifecycle plan.
- **Repository checks**: `npm run lint`, `npm run type-check`, and
  `npm run build` must exit 0.
- **Desktop feel check**:
  1. With normal motion enabled and the pointer outside the hero, observe at
     least three automatic category changes.
  2. Hover the hero for longer than two dwell cycles: rotation must pause.
     Move the pointer out: rotation must resume within one dwell interval.
  3. Click a category, move the pointer outside the hero, and leave focus on
     the clicked category: rotation must resume within one dwell interval.
  4. Tab into the category controls: rotation must pause and the button must
     read `Resume rotation`. Activate it with Space: rotation must resume even
     while focus remains on the button.
  5. Activate `Pause rotation`, move the pointer out, and wait three dwell
     cycles: the active category must not change. Activate `Resume rotation`:
     it must change within one dwell interval.
- **Lifecycle check**: switch to another tab for at least two dwell cycles and
  return. Rotation must resume from a coherent scene without overlapping or
  invisible plates.
- **Reduced-motion check**: emulate `prefers-reduced-motion: reduce`. Automatic
  path movement must remain off; category selection must still present the
  selected dish using the existing fade behavior.
- **Mobile feel check**: at widths below 800px, tapping a category and lifting
  the pointer must not permanently stop subsequent rotation. The restored
  control must remain at least `2.5rem` tall and must not obscure the category
  scroller.
- **Done when**: all checks pass, pointer-selected categories no longer latch
  autoplay off, keyboard users receive an explicit paused state and recovery
  control, and all other pause reasons retain their current behavior.
