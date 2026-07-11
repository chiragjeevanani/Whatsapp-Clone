# Next.js Performance Optimization — Whatsapp-Clone Frontend

## Audit Summary

Full codebase audit across **14 source files** (9 pages, 2 components, 1 layout, 1 CSS, 1 config). Total source size: **~530KB** of JavaScript + 10KB CSS.

---

## 🔴 CRITICAL Findings (Highest Impact)

### 1. All Four Tab Pages Rendered Simultaneously (SwipeNavigation)

**File:** [SwipeNavigation.js](file:///d:/Github/Whatsapp-Clone/frontend/src/components/SwipeNavigation.js)

**Problem:** Lines 116–127 render `<ChatsPage />`, `<UpdatesPage />`, `<CommunitiesPage />`, and `<CallsPage />` *all at once* inside the swipe container — even if the user only sees one tab. These are 4 massive components (45KB + 87KB + 67KB + 39KB = **238KB** of JSX) all mounted, all running their `useEffect` hooks, all holding state.

**Impact:** ~4× the initial render cost, ~4× the memory usage, ~4× the DOM nodes. This is **the #1 performance bottleneck** in the entire app.

**Fix:** Lazy-render only adjacent tabs (current ± 1) and unmount distant tabs. Use `React.memo` on each page component to prevent re-renders when props haven't changed.

**Estimated improvement:** 60-70% reduction in initial render time, ~60% reduction in DOM nodes.

---

### 2. Massive Monolithic Page Components (No Code Splitting)

| Page | Lines | Size | Sub-views inside |
|------|-------|------|-----------------|
| [chats/[id]/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/chats/%5Bid%5D/page.js) | 2,464 | 128KB | Chat, Media Gallery, Wallpaper Picker, Forward, Contact Card, Message Info |
| [updates/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/updates/page.js) | 1,548 | 87KB | Status Viewer, Channels, Create Channel Wizard, Privacy Settings, Starred |
| [communities/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/communities/page.js) | 1,321 | 67KB | Community List, Intro, Form, Info Page |
| [settings/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/settings/page.js) | 1,016 | 60KB | Account, Privacy, Chats, Notifications, Storage sub-pages |
| [chats/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/chats/page.js) | 1,026 | 45KB | Chat List, Select Contact, Locked Chats, Archived Chats, Quick Profile |
| [calls/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/calls/page.js) | 894 | 39KB | Call List, Dialer, Schedule, Select Contact, Add Favourite |

**Problem:** Each page file contains multiple sub-views rendered conditionally via state. The entire file (all sub-views) is parsed and loaded even if only one sub-view is shown. No `React.lazy` / `dynamic()` is used anywhere.

**Fix:** Extract sub-views into separate components loaded with `next/dynamic`. E.g., the Wallpaper Picker, Media Gallery, Channel Wizard, and Contact selectors should all be dynamically imported.

**Estimated improvement:** 40-50% reduction in initial JS parse/compile per route.

---

### 3. Zero `next/image` Usage (~40+ raw `<img>` tags)

**Problem:** The codebase has **40+ raw `<img>` elements** across all pages but `next/image` is imported only in [page.js (home)](file:///d:/Github/Whatsapp-Clone/frontend/src/app/page.js) and **never even used there** (the welcome page uses `<img>` too). This means:
- No automatic image optimization (WebP/AVIF)
- No lazy loading (all images load eagerly)
- No responsive `srcset`
- No blur placeholder
- No size optimization
- Large LCP penalty

**Fix:** Replace all `<img>` with `next/image` where feasible. For external URLs (unsplash, googleusercontent), configure `remotePatterns` in `next.config.mjs`. For avatar images, use `sizes` prop and blur placeholders.

**Estimated improvement:** 30-50% reduction in image payload, significantly better LCP.

---

### 4. Render-Blocking Google Fonts (Two External Stylesheets)

**File:** [layout.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/layout.js) lines 42-49

**Problem:** Two `<link>` tags load Google Fonts externally:
1. Material Symbols Outlined (variable weight + fill, **~1.2MB** of icon font)
2. Inter (4 weights, **~100KB**)

These are render-blocking resources that delay First Contentful Paint. Meanwhile, `next/font` is already configured for Geist fonts but Inter is loaded *again* via external stylesheet.

**Fix:**
- Replace the Inter `<link>` with `next/font/google` (already have the pattern for Geist)
- For Material Symbols, load via `next/font/google` or use `font-display: swap` + `preload` + `crossorigin`
- Remove duplicate Inter loading

**Estimated improvement:** 200-500ms faster FCP, eliminates FOIT/FOUT.

---

## 🟠 HIGH Impact Findings

### 5. Duplicated Theme Detection Logic (×3 pages)

**Files:** [chats/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/chats/page.js) L22-33, [communities/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/communities/page.js) L65-76, [settings/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/settings/page.js) L41-54

**Problem:** Three pages independently read `localStorage.getItem("theme")`, check `prefers-color-scheme`, and toggle `document.documentElement.classList`. The layout already has a `beforeInteractive` script doing this. This creates:
- Hydration flash (theme applied after mount)
- Redundant work
- Race conditions between pages

**Fix:** Create a shared `useTheme` hook or context. The `beforeInteractive` script in layout handles the initial flash. Pages should only read the theme state, not re-apply it.

---

### 6. Duplicated `toggleTheme` Function (×3 pages)

**Files:** Same as above — identical 10-line `toggleTheme` functions in 3 files.

**Fix:** Extract to a shared hook/utility that all pages can import.

---

### 7. `window.dispatchEvent(CustomEvent)` for Navigation Hiding

**Files:** [chats/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/chats/page.js) L35-41, [updates/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/updates/page.js) L47-53, [communities/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/communities/page.js) L78-84, [SwipeNavigation.js](file:///d:/Github/Whatsapp-Clone/frontend/src/components/SwipeNavigation.js) L33-39

**Problem:** Custom DOM events used for component communication instead of React state/context. This bypasses React's rendering system, is hard to debug, and causes extra event listener overhead.

**Fix:** Lift the `hideNavbar` state into a lightweight context or pass it through SwipeNavigation's render props.

---

### 8. Unused Import: `Image` from `next/image`

**File:** [page.js (home)](file:///d:/Github/Whatsapp-Clone/frontend/src/app/page.js) line 3

**Problem:** `Image` is imported but never used. Tree shaking should handle this but it adds confusion.

**Fix:** Remove unused import.

---

### 9. Unused Import: `Navigation` Component (×4 pages)

**Files:** [chats/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/chats/page.js) L5, [updates/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/updates/page.js) L5, [communities/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/communities/page.js) L5, [calls/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/calls/page.js) L5

**Problem:** Navigation is imported in 4 page files but used **only** in SwipeNavigation. These are dead imports.

**Fix:** Remove the unused `Navigation` imports from all 4 pages.

---

### 10. Missing `next.config.mjs` Image Domains Configuration

**File:** [next.config.mjs](file:///d:/Github/Whatsapp-Clone/frontend/src/app/../../../next.config.mjs)

**Problem:** No `images.remotePatterns` configured. When we add `next/image`, external domains need to be whitelisted.

**Fix:** Add `remotePatterns` for `lh3.googleusercontent.com`, `images.unsplash.com`.

---

## 🟡 MEDIUM Impact Findings

### 11. No `React.memo` on Any Component

**Problem:** Navigation and SwipeNavigation accept props but are not memoized. Every parent re-render causes these to re-render too.

**Fix:** Wrap `Navigation` in `React.memo`. The tabs array should be moved outside the component (it's recreated every render).

---

### 12. Inline Object/Array Allocations on Every Render

**File:** [Navigation.js](file:///d:/Github/Whatsapp-Clone/frontend/src/components/Navigation.js) L11-16

**Problem:** The `tabs` array is recreated on every render. The `transition` objects in motion components are also recreated.

**Fix:** Hoist `tabs` to module scope (it's static). Hoist `transition` config objects to module scope.

---

### 13. Scroll Listener Without Throttle (Settings Page)

**File:** [settings/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/settings/page.js) L45-53

**Problem:** Raw `window.addEventListener("scroll", handleScroll)` with no throttle/debounce. Fires on every pixel scrolled.

**Fix:** Use `requestAnimationFrame` throttle or passive listener with throttle.

---

### 14. Resize Listener Without Debounce

**File:** [SwipeNavigation.js](file:///d:/Github/Whatsapp-Clone/frontend/src/components/SwipeNavigation.js) L45-59

**Problem:** `window.addEventListener("resize", handleResize)` fires continuously during resize.

**Fix:** Debounce the resize handler or use `ResizeObserver`.

---

### 15. Repeated Filter Computations in Render

**File:** [chats/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/chats/page.js) L617 and L624-631

**Problem:** `chats.filter(c => c.isArchived).length` is computed inline during render. The main chat list also filters twice (locked + archived, then active filter). These run on every render.

**Fix:** Memoize filtered lists with `useMemo`.

---

### 16. Missing `useCallback` on Event Handlers

**Problem:** `handleChatClick`, `handlePinSubmit`, `handleTabChange`, `handleDragEnd`, `toggleTheme`, `toggleFollow` etc. are recreated on every render. When passed as props, they cause child re-renders.

**Fix:** Wrap with `useCallback`.

---

### 17. Large Inline Data Objects in Components

**Files:** [chats/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/chats/page.js) (chats array L57-263, contacts L265-315), [calls/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/calls/page.js) (callsList), [chats/[id]/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/chats/%5Bid%5D/page.js) (chatsData)

**Problem:** Large data arrays/objects are defined inside the component function (or as initial `useState` values), causing them to be re-created on every render.

**Fix:** Move static data to module scope or separate data files. Use `useState(() => initialData)` lazy initializer for `useState`.

---

### 18. Framer Motion Bundle Size

**Problem:** `framer-motion` (v12.41) is ~130KB minified. It's used in 3 files but only for basic animations (swipe, pill slide, presence). Most of the library is unused.

**Fix:** Use `motion` subpackage import `from "framer-motion/m"` or the lightweight `motion` package for smaller bundle. Consider `"framer-motion/dom"` for non-React animations.

---

### 19. Missing `loading="lazy"` on Below-the-Fold Images

**Problem:** All `<img>` tags lack `loading="lazy"`. Images in chat lists, contact lists, and status cards are loaded eagerly even when off-screen.

**Fix:** Adding `next/image` will handle this, but for any remaining `<img>` tags, add `loading="lazy"` and `decoding="async"`.

---

### 20. CSS: Duplicate Dark Mode Selectors

**File:** [globals.css](file:///d:/Github/Whatsapp-Clone/frontend/src/app/globals.css)

**Problem:** Multiple selectors target the same properties:
- `.dark .bg-primary-container` appears at L356 and L414
- `.dark [class*="text-[#0f8b5d]"]` appears at L366 and L396
- `.dark [class*="bg-[#e6f5ef]"]` appears at L331 and L391

**Fix:** Deduplicate the CSS rules.

---

### 21. `suppressHydrationWarning` Masking Issues

**File:** [layout.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/layout.js) L28-30

**Problem:** Both `<html>` and `<head>` have `suppressHydrationWarning`. While the `<html>` one is necessary for the theme class, the `<head>` one may mask legitimate hydration errors.

**Fix:** Keep on `<html>` only.

---

## ⚪ LOW Impact Findings

### 22. `useRouter` Import in Welcome Page

**File:** [page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/page.js) — uses `useRouter` + `"use client"` just for `router.push("/login")`. Could use a `<Link>` styled as a button instead, avoiding the client component boundary.

### 23. CSS `@utility` font-family Redundancy

Every `@utility font-*` rule repeats `font-family: 'Inter', sans-serif;`. Since `body` already sets this, these are unnecessary.

### 24. No Viewport Meta Tag Optimization

Missing `viewport-fit=cover` for mobile Safari notch handling (the `pb-safe` class suggests awareness of safe areas).

### 25. `eslint.config.mjs` — No Perf-Related ESLint Rules

Consider adding `eslint-plugin-react-hooks` exhaustive deps rule.

---

## Proposed Changes

### Phase 1: Critical Optimizations (Biggest Gains)

---

#### SwipeNavigation — Lazy Tab Rendering

##### [MODIFY] [SwipeNavigation.js](file:///d:/Github/Whatsapp-Clone/frontend/src/components/SwipeNavigation.js)
- Wrap each page import with `next/dynamic` using `{ ssr: false }`
- Only render current tab ± 1 (adjacent tabs for smooth swiping)
- Add `React.memo` wrapper on each dynamically imported page
- Debounce the resize handler

---

#### next.config.mjs — Image Optimization Config

##### [MODIFY] [next.config.mjs](file:///d:/Github/Whatsapp-Clone/frontend/next.config.mjs)
- Add `images.remotePatterns` for external image domains (googleusercontent, unsplash)

---

#### Layout — Font Loading Optimization

##### [MODIFY] [layout.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/layout.js)
- Remove duplicate external Inter font `<link>` (already using `next/font`)
- Add `preload` and `crossorigin` to Material Symbols font
- Remove unused `suppressHydrationWarning` from `<head>`

---

### Phase 2: Component Optimizations

---

#### Navigation — Memoization & Static Data

##### [MODIFY] [Navigation.js](file:///d:/Github/Whatsapp-Clone/frontend/src/components/Navigation.js)
- Hoist `tabs` array and `transition` objects to module scope
- Wrap component in `React.memo`
- Wrap `onTabChange` handler callback references with `useCallback` (caller-side)

---

#### Chats Page — useMemo, useCallback, Static Data

##### [MODIFY] [chats/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/chats/page.js)
- Move `contactsList` to module scope
- Use lazy initializer for `useState(chats)`: `useState(() => initialChats)`
- Move initial chats data to module scope
- Memoize filtered chat lists with `useMemo`
- Wrap event handlers with `useCallback`
- Remove unused `Navigation` import
- Remove duplicate theme detection (use shared hook)
- Add `loading="lazy"` to `<img>` tags

---

#### Updates, Communities, Calls, Settings Pages — Same Patterns

##### [MODIFY] [updates/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/updates/page.js)
##### [MODIFY] [communities/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/communities/page.js)
##### [MODIFY] [calls/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/calls/page.js)
##### [MODIFY] [settings/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/settings/page.js)
- Remove unused `Navigation` imports
- Remove duplicate theme detection code
- Move static data to module scope
- Add `loading="lazy"` and `decoding="async"` to `<img>` tags
- Wrap event handlers with `useCallback`
- Add `useMemo` for filtered/computed lists

---

#### Welcome Page — Remove Unused Import, Use Link

##### [MODIFY] [page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/page.js)
- Remove unused `Image` import from `next/image`
- Add `loading="lazy"` to the hero image

---

### Phase 3: CSS Optimization

##### [MODIFY] [globals.css](file:///d:/Github/Whatsapp-Clone/frontend/src/app/globals.css)
- Remove duplicate dark mode selectors
- Remove redundant `font-family` from `@utility` rules
- Add `will-change` hints for animated properties

---

### Phase 4: Scroll & Resize Performance

##### [MODIFY] [settings/page.js](file:///d:/Github/Whatsapp-Clone/frontend/src/app/settings/page.js)
- Throttle the scroll listener with `requestAnimationFrame`
- Add `{ passive: true }` to scroll listener

---

## Verification Plan

### Automated Tests
```bash
npm run build   # Verify no build errors, check bundle sizes
npm run lint    # Verify no lint errors
```

### Manual Verification
- Navigate between all tabs — swipe and click
- Verify dark mode toggle works from Chats, Communities, Settings
- Verify locked chats PIN modal works
- Verify all images load correctly
- Verify animations remain smooth
- Check devtools Performance tab for reduced render time
- Check Network tab for reduced initial requests

---

## Expected Results Summary

| Metric | Before (Estimated) | After (Estimated) | Improvement |
|--------|-------------------|-------------------|-------------|
| Initial DOM Nodes | ~8,000+ (4 pages) | ~2,500 (1-2 pages) | **~70% reduction** |
| Initial JS Parse | ~530KB | ~150KB (active tab) | **~72% reduction** |
| FCP | ~2.5-3.5s | ~1.2-1.8s | **~50% faster** |
| LCP | ~3.5-5s | ~1.8-2.5s | **~40% faster** |
| Memory Usage | ~80-120MB | ~30-50MB | **~60% reduction** |
| Image Payload | Full size | Optimized WebP | **~40-60% smaller** |
| Framer Motion overhead | Loaded on all tabs | Loaded only when needed | **~130KB saved** |
| Bundle (First Load) | ~250-350KB | ~120-180KB | **~50% reduction** |

> [!IMPORTANT]
> **Phase 1 alone** (lazy tab rendering + font optimization) will deliver the majority of the gains. The swipe navigation fix is the single most impactful change.

> [!WARNING]
> All changes preserve existing UI design, animations, dark mode, routing, and business logic. No visual differences expected.
