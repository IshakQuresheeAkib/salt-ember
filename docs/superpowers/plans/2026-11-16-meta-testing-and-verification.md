# Meta Testing and Verification Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the end-to-end Meta Pixel and Conversions API (CAPI) Testing and Verification feature, including `META_TEST_EVENT_CODE` environment configuration, server-side test event dispatching, a standalone verification CLI script (`npm run verify:meta`), and automated test coverage.

**Architecture:** Extend the existing Next.js App Router CAPI implementation (`lib/meta-capi.ts`, `app/actions/meta-conversion.ts`, and `lib/pixel-tracker.ts`) with flexible token fallback (`META_CAPI_TOKEN` / `META_ACCESS_TOKEN`), caller-supplied `testEventCode` options with strict production safety guards (`NODE_ENV === "production"` strips test codes), a dedicated CLI verification script (`scripts/verify-meta-capi.mjs`) that tests Meta Graph API connectivity and verifies deduplication parameters, and comprehensive unit tests.

**Tech Stack:** Next.js 16 (App Router, Server Actions, `after()`), Node.js 22 built-in `node:test` and `node:crypto`, Meta Graph API (v22.0/v27.0).

**Spec:** Meta Pixel and Conversions API (CAPI) Integration Guide (Section 7: Testing and Verification; Section 8: Production Verification Checklist).

## Global Constraints

- Never expose `META_CAPI_TOKEN` or `META_ACCESS_TOKEN` to the browser or prefix with `NEXT_PUBLIC_`.
- When `NODE_ENV === "production"`, `test_event_code` MUST never be sent to Meta Graph API, avoiding sandbox routing of real conversion data.
- Always normalize Bangladesh phone numbers to E.164 without plus sign (`8801...`) before SHA-256 hashing.
- Never hash `_fbp`, `_fbc`, client IP address, or user agent.
- Client browser event and server CAPI event must share the exact same `event_id` and `event_name` for deduplication.
- All existing 84+ unit tests in `tests/*.test.mjs` must continue to pass with 0 failures.

## Review Focus

1. **Production leak of `test_event_code`**: If `NODE_ENV === "production"`, any `test_event_code` must be completely omitted from the Graph API payload, even if `META_TEST_EVENT_CODE` is set in the environment or passed in options.
2. **Token resolution flexibility**: Support both `META_CAPI_TOKEN` (the guide's naming) and `META_ACCESS_TOKEN` (existing codebase naming) seamlessly.
3. **Network resilience & diagnostics**: Verification tool and CAPI dispatcher must provide clear, actionable error messages (e.g. Graph API error codes, token permission issues, missing dataset IDs) without unhandled promise rejections.
4. **URL & Cookie test code detection**: In development/testing, capture `?test_event_code=` from query strings or environment so developers testing in Events Manager can verify browser + server deduplication in one flow.
5. **Clean test assertions**: Unit tests must execute fast using Node's native test runner (`node --test tests/*.test.mjs`) without requiring external network dependencies during standard CI runs.

---

### Task 1: Environment Documentation & Configuration for Meta Testing

**Files:**
- Modify: `.env.example:10-18`
- Modify: `.env:7-15`
- Test: `tests/meta-capi.test.mjs`

**Interfaces:**
- Consumes: Existing environment configuration.
- Produces: Standardized `.env.example` documenting `META_TEST_EVENT_CODE`, `META_CAPI_TOKEN`, and `META_ACCESS_TOKEN`.

- [ ] **Step 1: Write failing test in `tests/meta-capi.test.mjs` for `.env.example` specifications**

```javascript
test(".env.example documents META_TEST_EVENT_CODE and CAPI tokens with clear setup guidance", () => {
  const content = fs.readFileSync(".env.example", "utf8");
  assert.match(content, /META_TEST_EVENT_CODE\s*=/);
  assert.match(content, /META_CAPI_TOKEN\s*=/);
  assert.match(content, /META_ACCESS_TOKEN\s*=/);
  assert.match(content, /NODE_ENV\s*!==\s*["']production["']|production/i);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/meta-capi.test.mjs`
Expected: FAIL due to missing `META_CAPI_TOKEN` in `.env.example` or regex mismatch.

- [ ] **Step 3: Update `.env.example` and `.env`**

In `.env.example`, define:
```env
# Meta Pixel (Browser Client)
NEXT_PUBLIC_META_PIXEL_ID=your_meta_pixel_id

# Meta Conversions API (Server - keep private, never prefix with NEXT_PUBLIC_)
META_PIXEL_ID=your_meta_pixel_id
META_CAPI_TOKEN=your_meta_system_user_access_token
META_ACCESS_TOKEN=your_meta_system_user_access_token

# Meta Testing & Verification (Events Manager > Test Events tab)
# Active only when NODE_ENV !== "production". Remove or leave blank in production.
META_TEST_EVENT_CODE=TEST12345
```
Update `.env` with the same structure (keeping existing secrets intact).

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/meta-capi.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add .env.example .env tests/meta-capi.test.mjs
git commit -m "chore(analytics): add META_TEST_EVENT_CODE and token aliases to .env.example"
```

---

### Task 2: Enhance Server-Side CAPI Client with Verification Support

**Files:**
- Modify: `lib/meta-capi.ts`
- Test: `tests/meta-capi.test.mjs`

**Interfaces:**
- Consumes: `SendMetaServerEventOptions`
- Produces:
  ```typescript
  export interface SendMetaServerEventOptions {
    eventName: string;
    eventId: string;
    eventSourceUrl: string;
    clientUserAgent: string;
    clientIp?: string;
    phone?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    fbp?: string;
    fbc?: string;
    customData?: Record<string, unknown>;
    testEventCode?: string;
  }

  export interface SendMetaServerEventResult {
    success: boolean;
    skipped?: boolean;
    reason?: string;
    data?: unknown;
    error?: unknown;
  }

  export async function sendMetaServerEvent(
    opts: SendMetaServerEventOptions
  ): Promise<SendMetaServerEventResult>;
  ```

- [ ] **Step 1: Write failing tests in `tests/meta-capi.test.mjs` for CAPI verification enhancements**

```javascript
test("sendMetaServerEvent supports META_CAPI_TOKEN fallback, testEventCode option, and returns structured result", () => {
  const content = fs.readFileSync("lib/meta-capi.ts", "utf8");
  assert.match(content, /META_CAPI_TOKEN/);
  assert.match(content, /testEventCode\?: string/);
  assert.match(content, /SendMetaServerEventResult/);
});

test("test_event_code is strictly excluded when NODE_ENV is production", () => {
  const content = fs.readFileSync("lib/meta-capi.ts", "utf8");
  assert.match(
    content,
    /process\.env\.NODE_ENV\s*===\s*["']production["']/,
    "must verify production environment check"
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/meta-capi.test.mjs`
Expected: FAIL due to missing `META_CAPI_TOKEN` and `SendMetaServerEventResult` in `lib/meta-capi.ts`.

- [ ] **Step 3: Implement updates in `lib/meta-capi.ts`**

1. Support token resolution:
   ```typescript
   const accessToken = process.env.META_CAPI_TOKEN || process.env.META_ACCESS_TOKEN;
   ```
2. Support `testEventCode` parameter in `SendMetaServerEventOptions`:
   ```typescript
   const isProd = process.env.NODE_ENV === "production";
   const testEventCode = !isProd
     ? (opts.testEventCode || process.env.META_TEST_EVENT_CODE)?.trim()
     : undefined;
   ```
3. Return `SendMetaServerEventResult`:
   - Returns `{ success: false, skipped: true, reason: ... }` when credentials missing.
   - Returns `{ success: true, data }` when Graph API returns 200 OK.
   - Returns `{ success: false, error }` when Graph API returns error status.
4. Log clear test event diagnostics in non-production environments when `testEventCode` is attached.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/meta-capi.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/meta-capi.ts tests/meta-capi.test.mjs
git commit -m "feat(analytics): add testEventCode option and META_CAPI_TOKEN support to meta-capi"
```

---

### Task 3: Build Meta Conversions API Verification CLI Script

**Files:**
- Create: `scripts/verify-meta-capi.mjs`
- Modify: `package.json`
- Test: `tests/meta-capi.test.mjs`

**Interfaces:**
- Consumes: Environment variables (`META_PIXEL_ID`, `META_CAPI_TOKEN`, `META_TEST_EVENT_CODE`), CLI flags (`--code=<code>`, `--dry-run`, `--event=<name>`).
- Produces: CLI execution `npm run verify:meta` with color-coded diagnostics and formatted JSON outputs.

- [ ] **Step 1: Write failing test in `tests/meta-capi.test.mjs` for the verification script**

```javascript
test("verification script exists and validates Meta CAPI configuration and test event payload", () => {
  assert.ok(fs.existsSync("scripts/verify-meta-capi.mjs"), "scripts/verify-meta-capi.mjs must exist");
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  assert.equal(pkg.scripts["verify:meta"], "node scripts/verify-meta-capi.mjs");
  const scriptContent = fs.readFileSync("scripts/verify-meta-capi.mjs", "utf8");
  assert.match(scriptContent, /META_TEST_EVENT_CODE/);
  assert.match(scriptContent, /sha256/i);
  assert.match(scriptContent, /graph\.facebook\.com/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/meta-capi.test.mjs`
Expected: FAIL because `scripts/verify-meta-capi.mjs` does not exist yet.

- [ ] **Step 3: Implement `scripts/verify-meta-capi.mjs` and add `verify:meta` script to `package.json`**

1. Parse CLI arguments (`--code=`, `--dry-run`, `--event=`, `--phone=`, `--email=`).
2. Load `.env` and `.env.local` safely using Node.js without leaking secrets.
3. Validate presence of `META_PIXEL_ID` (or `NEXT_PUBLIC_META_PIXEL_ID`) and `META_CAPI_TOKEN` / `META_ACCESS_TOKEN`.
4. Validate `META_TEST_EVENT_CODE`. If missing and not `--dry-run`, provide step-by-step guidance on obtaining it from Events Manager.
5. Generate an event payload using canonical Bangladesh phone normalization (`8801...`), SHA-256 hashing, unhashed `_fbp`/`_fbc`, and `test_event_code`.
6. If `--dry-run`, output formatted payload and exit 0.
7. If active, POST to `https://graph.facebook.com/v22.0/{PIXEL_ID}/events?access_token={TOKEN}`.
8. Pretty-print response:
   - Green `[SUCCESS]` with `events_received`, `fbtrace_id`, and verification instructions in Meta Events Manager.
   - Red `[ERROR]` with Meta's error message, subcode, and remediation advice.
9. Add `"verify:meta": "node scripts/verify-meta-capi.mjs"` to `package.json`.

- [ ] **Step 4: Run verification script in dry-run mode and run unit test**

Run:
`node scripts/verify-meta-capi.mjs --dry-run`
`node --test tests/meta-capi.test.mjs`
Expected: PASS with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add scripts/verify-meta-capi.mjs package.json tests/meta-capi.test.mjs
git commit -m "feat(analytics): add verify:meta CLI tool for Meta CAPI testing and diagnostics"
```

---

### Task 4: Client & Server Action Test Event Verification Support

**Files:**
- Modify: `app/actions/meta-conversion.ts`
- Modify: `lib/pixel-tracker.ts`
- Test: `tests/meta-capi.test.mjs`

**Interfaces:**
- Consumes: Browser query parameters (`?test_event_code=...`) or cookies.
- Produces: Pass-through of test event code from browser to server action during manual browser testing (guarded by `NODE_ENV !== "production"`).

- [ ] **Step 1: Write failing test in `tests/meta-capi.test.mjs` for browser test event resolution**

```javascript
test("pixel-tracker extracts test_event_code query parameter in non-production environments", () => {
  const content = fs.readFileSync("lib/pixel-tracker.ts", "utf8");
  assert.match(content, /test_event_code/);
});

test("meta-conversion action accepts optional testEventCode parameter for testing", () => {
  const content = fs.readFileSync("app/actions/meta-conversion.ts", "utf8");
  assert.match(content, /testEventCode\?: string/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/meta-capi.test.mjs`
Expected: FAIL due to missing `test_event_code` handling in `pixel-tracker.ts` and `meta-conversion.ts`.

- [ ] **Step 3: Implement test event pass-through in `lib/pixel-tracker.ts` and `app/actions/meta-conversion.ts`**

1. In `lib/pixel-tracker.ts`:
   - Add helper `getMetaTestEventCode(): string | undefined` that inspects `window.location.search` for `?test_event_code=...`.
   - In `buildDishWhatsAppOrderUrl` and `trackOutboundContactClick`, pass `testEventCode` if present.
2. In `app/actions/meta-conversion.ts`:
   - Add optional `testEventCode?: string` to `DishCheckoutTrackParams` and `GeneralContactTrackParams`.
   - Forward `testEventCode` to `sendMetaServerEvent` (guarded by `NODE_ENV !== "production"`).

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/meta-capi.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/pixel-tracker.ts app/actions/meta-conversion.ts tests/meta-capi.test.mjs
git commit -m "feat(analytics): support test_event_code URL param for live browser testing"
```

---

### Task 5: Documentation Update and Full Test Suite Verification

**Files:**
- Modify: `PROJECT.md`
- Test: Full test suite (`npm test`) and type check (`npm run type-check`)

**Interfaces:**
- Consumes: Entire Meta CAPI feature set.
- Produces: Updated `PROJECT.md` documenting testing and verification workflow (Test Events tab, deduplication verification, CLI tool, and checklist).

- [ ] **Step 1: Write test verifying documentation includes Section 7 & 8 testing instructions**

```javascript
test("PROJECT.md documents Testing and Verification workflow and verify:meta CLI command", () => {
  const content = fs.readFileSync("PROJECT.md", "utf8");
  assert.match(content, /META_TEST_EVENT_CODE/);
  assert.match(content, /verify:meta/);
  assert.match(content, /Events Manager/);
  assert.match(content, /Deduplicated/);
});
```

- [ ] **Step 2: Update `PROJECT.md`**

In `PROJECT.md` under Section 5 (Analytics and tracking):
- Add subsection "Testing and verification workflow":
  1. Setting `META_TEST_EVENT_CODE` in `.env.local` from Events Manager > Test Events tab.
  2. Running `npm run verify:meta` to test backend CAPI connectivity and payload compliance.
  3. Opening the website with `?test_event_code=TEST12345` to test browser + server event deduplication.
  4. Checking Meta Events Manager to verify the green "Deduplicated" badge on matching `event_id`.
  5. Pre-production checklist (removing `META_TEST_EVENT_CODE` before launch).

- [ ] **Step 3: Run full verification suite**

Run:
```bash
npm test
npm run type-check
npm run verify:meta -- --dry-run
```
Expected: All tests pass, 0 type errors, dry run succeeds.

- [ ] **Step 4: Commit**

```bash
git add PROJECT.md tests/meta-capi.test.mjs
git commit -m "docs(analytics): update PROJECT.md with testing and verification procedures"
```

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-11-16-meta-testing-and-verification.md`. Please review the plan. Which execution approach would you prefer?

- **Subagent-driven** - A fresh subagent implements each task and a fresh reviewer checks it before the next one starts, then a whole-branch review at the end. Most thorough; costs a fresh context per task and per review.
- **Native** - I implement every task myself in this session, the way this harness runs work, then one fresh reviewer checks the changes. Cheapest and fastest; runs smoothly with high reliability.

For this plan I recommend **Native**, because the tasks are tightly coupled around Meta CAPI configuration, unit tests are fast (less than 1s), and direct step-by-step implementation in this session allows rapid iteration and verification. Does the plan capture what you want, and which approach should we use?
