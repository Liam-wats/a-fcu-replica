## Goal

Make the entire app responsive (320 → 1440px), redesign the admin panel for mobile, and streamline the onboarding flow — all while staying aligned with A+FCU's visual language (brand-green primary, brand-cream surfaces, serif headings + sans body, rectangular cards with thin borders).

## 1. Onboarding Flow — streamline + responsive

**Reduce 6 steps → 4 steps.** The current sequence has redundancy that can be merged:

```text
Before: Goals → Personal → Address → Account → Online Banking → Review
After:  Goals → About You (Personal + Address) → Account + Login → Review
```

- Merge **Personal** + **Address** into a single "About You" step (one scrollable form, two clearly-labeled sections). These are short and always filled together.
- Merge **Account** selection + **Online Banking credentials** into one step ("Choose your account & set up login"). Picking an account and creating a login go together at the end.
- Keep **Goals** and **Review** as standalone steps.
- Update `STEP_META` in `src/context/JoinContext.tsx`, route files under `src/routes/join/*`, and the sidebar in `src/routes/join/index.tsx`.

**Mobile UX in `/join`:**
- Sidebar (`StepSidebar`) becomes a **horizontal step bar at top** below `lg` breakpoint — compact dots/numbers + current step label only, with progress fill.
- Form padding reduced on mobile (`px-4 py-6` vs `px-8 py-10`).
- Selection cards in `StepGoals` / `StepAccount`: full-width on mobile (`grid-cols-1 sm:grid-cols-2`), larger tap targets (min-height 64px), icons sized for touch.
- Sticky bottom action bar on mobile holding Back / Continue buttons so they're always reachable.
- Inputs: `text-base` on mobile (prevents iOS zoom), 44px min height.

## 2. Admin Panel — full responsive redesign

**Layout (`src/routes/admin.tsx`):**
- Convert fixed `w-60` sidebar to a **slide-over drawer** below `lg` (off-canvas, hamburger trigger in a new top app-bar).
- Add mobile top bar: hamburger + "Admin Console" title + sign-out icon.
- Sidebar stays persistent at `lg+`.

**Applications page (`src/routes/admin/index.tsx`):**
- Table → **card list on mobile** (each application becomes a card with reference #, name, status chip, submitted date, and a "View" CTA). Switch via `hidden md:table` / `md:hidden grid`.
- Filter/search controls collapse into a single `Filters` toggle button on mobile.
- `EditDrawer`: change `w-[520px] max-w-full` to `w-full sm:w-[520px]` and make it full-screen on mobile with a sticky header + sticky save bar at the bottom. Tabs become scrollable horizontal pills.
- Inner forms: `grid-cols-2` → `grid-cols-1 sm:grid-cols-2`. Transaction / alert sub-forms stack on mobile.

## 3. Site-wide responsiveness pass

Audit and fix the following recurring issues:
- `HeroCarousel`: verify the split layout collapses to single column < lg, image height clamps, controls don't overlap text on small screens.
- `FeaturedRates`, `CategoryCards`, `AwardsGrid`, `LatestArticles`: confirm `grid-cols-{1|2|3|4}` ladders at sm/md/lg breakpoints.
- `Footer`, `UtilityBar`: stack on mobile, hide non-essential utility links < md.
- Replace any fixed `min-w` / pixel widths with `max-w-full` + responsive widths.
- Standardize container: continue using `max-w-6xl mx-auto px-4 sm:px-6 lg:px-10`.

## 4. Design alignment & a11y polish

- Keep brand tokens in `src/styles.css` (no new ad-hoc colors).
- Ensure focus-visible rings on all interactive elements (`focus-visible:ring-2 focus-visible:ring-brand-green/40`).
- Buttons / inputs: 44×44 minimum tap target on mobile.
- ARIA: `aria-current="step"` on active onboarding step, `aria-label` on icon-only admin buttons, `role="dialog"` + focus trap for the admin drawer.

## Technical notes

- Breakpoints used: Tailwind defaults — `sm 640`, `md 768`, `lg 1024`, `xl 1280`. Test at 320, 480, 768, 1024, 1440.
- No backend changes. Onboarding step merge is purely route + context level; existing `JoinContext` shape (personal, address, account, credentials) stays intact, just collected across fewer screens.
- Routes to delete: `src/routes/join/address.tsx`, `src/routes/join/credentials.tsx`. Repurpose `personal.tsx` → "About You" and `account.tsx` → "Account & Login".
- `StepProgress.tsx` gets a `variant: "vertical" | "horizontal"` prop for the responsive sidebar.

## Out of scope

- No changes to authentication, DB schema, or admin permissions.
- No new features added to the onboarding flow (only consolidation).
- Visual identity stays as-is — this is a responsiveness + flow pass, not a redesign.
