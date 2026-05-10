# A+ FCU Visual Replica — Plan

A static, pixel-faithful replica of aplusfcu.org. Homepage will be fully built; key inner pages get matching layout shells with real nav/footer and placeholder body content. All images and the logo are hotlinked directly from `aplusfcu.org` (per your choice — note this is fine for local/personal use but should not be redeployed publicly).

## Routes

```text
src/routes/
  __root.tsx          shared shell (top utility bar, header, mega menu, footer)
  index.tsx           full homepage
  accounts.tsx        inner-page shell + intro
  loans.tsx           inner-page shell + intro
  services.tsx        inner-page shell + intro
  contact-us.tsx      contact info + branches list
  locations.tsx       branch/ATM placeholder list
```

Each route gets its own `head()` with route-specific title + meta description.

## Global chrome (in `__root.tsx`)

- **Top utility bar** (white): Join · Rates · Locations · Contact Us (dropdown) · Search · green Login button on the right
- **Main header**: A+ logo (left, hotlinked SVG/PNG from their CDN) + horizontal nav with hover dropdowns: Accounts, Loans, Services, Business, Who We Are, Guidance
- **Mobile**: hamburger → full-screen slide-in menu, accordions per section, login + utility links at bottom
- **Footer**: green band with tagline "Banking on each other. Building stronger communities.®", "I'm looking for…" search input, Popular Searches list, social icons, NCUA / Equal Housing logos, copyright, routing # 314977104
- **External-link interstitial modal** (re-creating their "you're leaving A+FCU" dialog) wired to any outbound link

## Homepage sections (top → bottom)

1. **Hero carousel** — full-width, yellow background with diagonal white angle overlay (`angle_hero-homepage.png`). 3 slides:
   - Mortgage offer — "Enjoy our limited-time mortgage offer." → Get Details
   - Personal Loan — "A+ Personal Loan rates as low as 9.49% APR.*" → Apply Online
   - Cash Back — "Over $25 million earned in cash back!*" → Here's How
   - Auto-advance every ~6s, prev/next + pause/play controls, "1/3" counter, dot indicators
2. **Online Banking login card** — overlaps hero bottom-left: Login ID, Password, green Log In button, secondary links (Become a Member, Enroll, Forgot ID/Password, Unlock). Static — submit is a no-op with a toast.
3. **Download A+ Mobile App** — App Store + Google Play badges
4. **Today's Featured Rates** — heading + intro + "View All Rates" link, then 5 rate cards in a row (Mortgage Purchase, Auto Purchase, Share Certificate, Home Equity, Mortgage Refi) each with colored SVG icon, product name, term, APR/APY
5. **Online Services** content block — image left, "Online Services" eyebrow, heading "Convenient Online Tools…", paragraph, three CTA links (Direct Deposit, Manage Your Cards, Credit Score)
6. **Find out about…** — 6 pill links (Join A+FCU, Find Rates, Make A Payment, Get The App, A+ Gives, Careers)
7. **About A+FCU** content block (image flipped right)
8. **Awards logo grid** — 10 award badges in a responsive grid
9. **A+FCU Loans** content block + 3 CTA links
10. **Two side-by-side category cards** — Accounts, Online Banking, each with hero image + icon + heading + 3 sub-links
11. **Latest Articles** — 3 blog cards with image, title, excerpt + "Visit Blog" link
12. Footer (from root)

## Design tokens (`src/styles.css`)

Sampled from the live site:

- `--brand-green` ~ `oklch(0.46 0.13 152)` (their primary green ≈ `#1f7a3a`)
- `--brand-green-dark` for hover/header bar
- `--brand-yellow` ~ `oklch(0.88 0.17 95)` (hero background ≈ `#f9c52b`)
- `--brand-cream` page bg sections
- `--ink` near-black text
- Body font: a Georgia-style serif for headings (their headings are a serif display), Inter/system sans for body. Closest free pairing: **Source Serif 4** (headings) + **Inter** (body), loaded from Google Fonts in `__root.tsx` head.
- Radii small (4–6px), generous section padding, max content width ~1200px

## Components

```text
src/components/
  layout/Header.tsx
  layout/UtilityBar.tsx
  layout/MegaMenu.tsx
  layout/MobileMenu.tsx
  layout/Footer.tsx
  layout/ExternalLinkModal.tsx
  home/HeroCarousel.tsx
  home/OnlineBankingLogin.tsx
  home/MobileAppCTA.tsx
  home/FeaturedRates.tsx
  home/RateCard.tsx
  home/ContentBlock.tsx        (reusable image+text band, supports flip)
  home/PillLinks.tsx
  home/AwardsGrid.tsx
  home/CategoryCards.tsx
  home/LatestArticles.tsx
```

`ContentBlock` is reused by Online Services, About A+FCU, and A+FCU Loans sections.

## Carousel implementation

Use `embla-carousel-react` (already-friendly with shadcn `Carousel` patterns). Autoplay plugin, loop, custom prev/next/pause buttons, slide counter, fade-in on slide change.

## Data

All copy, rate values, image URLs, and link hrefs hard-coded into a single `src/data/site.ts` so the homepage components stay declarative and the inner pages can reuse the nav structure.

## Out of scope (will not build)

- Working login / online banking integration
- Real branch locator with map
- Functional search
- Blog post detail pages
- Business / Who We Are / Guidance inner pages (nav links will land on a generic placeholder page that matches the layout)

## Verification

After build, I'll open the preview, screenshot the homepage at desktop (1440) and mobile (390), compare side-by-side with `aplusfcu.org`, and tighten spacing/typography until it visually matches.
