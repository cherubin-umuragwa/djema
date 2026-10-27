# DESIGN_SYSTEM.md — UI/UX & Design Specification
## Djema: Informal Skills & Services Marketplace

---

## 1. Design Principles

1. **Radically simple** — Every screen should be so clear that a first-time smartphone user in Kampala completes it without reading any instructions.
2. **Breathing room** — Whitespace is not wasted space. The site should feel like it can breathe, not like it is trying to show everything at once.
3. **Warm and specific** — This is a platform for real people in Kampala. The copy, visuals, and layout should reflect that specific context, not generic SaaS language.
4. **Action-first** — The most important action on every screen is the most prominent element. No hunting.
5. **Intentional** — Every element on every page exists for a reason. If there is no reason, it is removed.
6. **Consistent** — One font pairing, one color system, one spacing scale, one corner radius logic, one nav height, across every page and every state.

---

## 2. Brand Identity

### 2.1 Name & Tagline
- **Name:** Djema
- **Tagline:** *"Find the help you need, get the work you deserve."*
- **Tone:** Direct, warm, specific. Written for someone in Kampala, not Silicon Valley.

### 2.2 Logo
- Clash Display bold wordmark.
- Optional geometric mark: two overlapping circles (connection between two people).
- Single-color only. No gradients, no shadows, no glow on the logo.

---

## 3. Color Palette

### 3.1 Primary

| Name | Hex | Usage |
|------|-----|-------|
| Djema Green | `#16A34A` | Primary buttons, brand accent, success indicators |
| Djema Green Dark | `#15803D` | Button hover and active states |
| Djema Green Light | `#DCFCE7` | Success message backgrounds |

Green is chosen for its cultural meaning across East Africa — growth, opportunity, action. It has a direct connection to this project's identity and SDG alignment.

### 3.2 Neutrals

| Name | Hex | Usage |
|------|-----|-------|
| Slate 900 | `#0F172A` | All headings |
| Slate 700 | `#334155` | Body text |
| Slate 500 | `#64748B` | Secondary text, captions, metadata |
| Slate 300 | `#CBD5E1` | Borders, dividers |
| Slate 200 | `#E2E8F0` | Disabled backgrounds, subtle separators |
| Slate 100 | `#F1F5F9` | Page-level backgrounds |
| White | `#FFFFFF` | Card surfaces, form inputs, modal backgrounds |

### 3.3 Semantic

| Name | Hex | Usage |
|------|-----|-------|
| Error | `#DC2626` | Errors and destructive actions |
| Error Background | `#FEE2E2` | Error message backgrounds |
| Warning | `#D97706` | Warnings, request expiry notices |
| Warning Background | `#FEF3C7` | Warning message backgrounds |
| Info | `#2563EB` | Informational text and links |
| Info Background | `#DBEAFE` | Info message backgrounds |

### 3.4 WhatsApp

| Name | Hex | Usage |
|------|-----|-------|
| WhatsApp Green | `#25D366` | WhatsApp button background only |
| WhatsApp Dark | `#128C7E` | WhatsApp button hover |

**Color rules:**
- No gradients anywhere — not on backgrounds, text, buttons, or borders.
- No glow effects, no blurred circles, no translucent frosted-glass layers.
- No dark/black backgrounds with neon or violet accents.
- Light background (`#F1F5F9` or white) throughout the entire site.
- The only color exception is `#25D366` for the WhatsApp button.

---

## 4. Typography

### 4.1 Font Pairing

| Role | Font | Weights | Source |
|------|------|---------|--------|
| **Display / Headings** | **Clash Display** | 500, 600, 700 | [Fontshare](https://www.fontshare.com/fonts/clash-display) — free |
| **Body / UI** | **Plus Jakarta Sans** | 400, 500, 600 | [Google Fonts](https://fonts.google.com/specimen/Plus+Jakarta+Sans) — free |

**Clash Display** is geometric and high-contrast — it gives Djema an unmistakable identity in headings without relying on any color tricks. **Plus Jakarta Sans** is warm, humanist, and highly legible at small sizes on low-resolution mobile screens.

No third font is ever introduced for any reason.

### 4.2 Type Scale

| Token | Size | Font | Weight | Usage |
|-------|------|------|--------|-------|
| `display-hero` | 48px | Clash Display | 700 | Hero headline only |
| `display-xl` | 36px | Clash Display | 700 | Page hero titles |
| `display-lg` | 30px | Clash Display | 600 | Page section titles (H1) |
| `display-md` | 24px | Clash Display | 600 | Section headings (H2) |
| `display-sm` | 20px | Clash Display | 500 | Sub-headings, card titles (H3) |
| `body-lg` | 18px | Plus Jakarta Sans | 500 | Lead paragraphs, important labels |
| `body-md` | 16px | Plus Jakarta Sans | 400 | Default body text |
| `body-sm` | 14px | Plus Jakarta Sans | 400 | Secondary text, captions, metadata |
| `body-xs` | 12px | Plus Jakarta Sans | 500 | Tags, badges, timestamps |

**Minimum on main content: 16px.** Never smaller.

### 4.3 Tailwind Config

```js
fontFamily: {
  display: ['Clash Display', 'system-ui', 'sans-serif'],
  sans:    ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
}
```

### 4.4 Typography Rules

- **No gradient text.** Headings are `text-slate-900`. Full stop.
- **No title case on every heading.** Use sentence case for headings unless it is a proper noun or the brand name.
- **No generic phrases.** Headings describe the specific product and the specific user. No "Empowering the next generation", "Seamless experience", "Innovate the future", or any variation. Every heading is written for someone in Kampala who needs a plumber.
- **Alignment is not always centered.** Hero headings may be centered. Body sections use left-aligned text. Not every section is centered — visual variety is intentional.
- **No repeated sentence structures across sections.** Each section earns its own format: some need a paragraph, some a list, some a table, some just a heading and a single line.

---

## 5. Iconography

### 5.1 Library

**[Lucide React](https://lucide.dev/) exclusively.** No other icon library. No emojis anywhere on the platform — not in UI copy, category labels, status messages, buttons, headings, empty states, or notifications.

### 5.2 Sizing & Style

| Context | Size | Stroke Width | Color |
|---------|------|-------------|-------|
| Navbar icons | 20px | 1.5 | `text-slate-600` |
| Button leading icon | 16px | 1.5 | Inherits button text color |
| Card metadata | 16px | 1.5 | `text-slate-400` |
| Feature/section icons | 24px | 1.5 | `text-green-600` |
| Empty state | 48px | 1.5 | `text-slate-300` |
| Status indicator | 16px | 2 | Semantic color |

Icons are never placed inside rounded squares or decorated containers. They appear directly in context — next to text, inside buttons, or standalone in empty states.

### 5.3 Icon Reference

| Context | Lucide Icon |
|---------|------------|
| Location | `MapPin` |
| Service request | `ClipboardList` |
| Person / Provider | `User`, `UserCheck` |
| Plumber / tools | `Wrench` |
| Electrician | `Zap` |
| Carpenter | `Hammer` |
| Painter | `Paintbrush` |
| Tailor | `Scissors` |
| WhatsApp / Message | `MessageCircle` |
| Email | `Mail` |
| Search | `Search` |
| Filter | `SlidersHorizontal` |
| Duration | `Clock` |
| Date | `Calendar` |
| Upload | `Upload` |
| Photo | `Image` |
| Available | `CheckCircle2` |
| Unavailable | `XCircle` |
| Success | `CheckCircle2` |
| Error | `AlertCircle` |
| Warning | `AlertTriangle` |
| Info | `Info` |
| Close | `X` |
| Menu | `Menu` |
| Edit | `Pencil` |
| Distance | `Navigation` |
| AI Match | `Sparkles` |
| Navigate | `ChevronRight`, `ArrowRight` |
| Loading | `Loader2` (with `animate-spin`) |
| No results | `SearchX` |
| No connection | `WifiOff` |
| Sign out | `LogOut` |
| Settings | `Settings` |

---

## 6. Spacing

### 6.1 Spacing Scale

All spacing uses Tailwind's 4px base unit. The following tokens are the approved values:

| Token | Value | Usage |
|-------|-------|-------|
| `2` | 8px | Tight internal spacing (badge padding, icon gaps) |
| `3` | 12px | Compact elements |
| `4` | 16px | Standard component internal padding |
| `6` | 24px | Card padding, close component groups |
| `8` | 32px | Section internal padding |
| `12` | 48px | Between major content blocks within a section |
| `16` | 64px | Between full-width sections |
| `24` | 96px | Top padding on major page sections |

**Spacing rules:**
- All section vertical padding must come from this scale. No arbitrary values like `pt-[37px]`.
- Consistent section padding: major sections use `py-16` or `py-24`. No mixing `py-20` on one section and `py-14` on another without a documented reason.
- Heading-to-paragraph gap: always `mt-4` (16px). Never tighter, never much looser.

### 6.2 Whitespace Philosophy

The site should feel like it is breathing. This means:
- Sections have generous top and bottom padding.
- Text lines are not crammed together — use `leading-relaxed` on body paragraphs.
- Not every cm² of screen is filled with content.
- Cards in a grid have `gap-6` or `gap-8` between them, not `gap-2` or `gap-3`.
- A full-width section with a single short sentence and a lot of space around it is intentional and acceptable.

---

## 7. Corner Radius Logic

Not everything gets the same radius. Radius is applied based on what the element is:

| Element type | Radius | Tailwind |
|--------------|--------|---------|
| Page sections, full-width bands | None | — |
| Large cards | 16px | `rounded-2xl` |
| Small cards, panels | 12px | `rounded-xl` |
| Buttons | 8px | `rounded-lg` |
| Input fields | 8px | `rounded-lg` |
| Badges, tags | 6px | `rounded-md` |
| Avatars, profile photos | Full circle | `rounded-full` |
| Image thumbnails | 8px | `rounded-lg` |

**Rules:**
- No pill-shaped buttons (`rounded-full` on rectangular buttons).
- No 24–32px radius on cards.
- No rounded containers inside rounded containers.
- The radius on a card and its internal button are different — card is `rounded-2xl`, button inside is `rounded-lg`.
- Sections (full-width background bands) have no border-radius.

---

## 8. Layout Principles

### 8.1 Grid

- **Mobile:** Single column, `px-4`, full-width content.
- **Tablet (md):** Two-column grids where appropriate.
- **Desktop (lg):** Up to three-column grids. Max content width `max-w-5xl` centered.

### 8.2 Alignment

- Not everything is centered.
- Hero headings on the homepage: centered.
- Body sections, lists, cards, forms: left-aligned.
- Metadata inside cards: left-aligned.
- Call-to-action at the end of a section: left-aligned (not always centered).

### 8.3 Section Variety

Each section on a page has its own layout format chosen for what it is communicating:

| Section type | Layout format |
|-------------|---------------|
| Hero | Full-width, large headline, real product context |
| How it works | Numbered list or horizontal steps — not cards |
| Service categories | Icon + label grid (functional, not decorative) |
| Open board | Card grid with filters |
| Impact / SDG | Editorial text section, real stats, left-aligned |
| Provider profile | Two-column: photo + info |
| Form | Single column, generous spacing |
| Footer | Multi-column text links, no decorative elements |

**No section repeats the same structure as the one before it.** If section 2 uses three cards in a row, section 3 uses something else — a list, a table, a full-width statement, a two-column editorial layout.

### 8.4 Page Structure

```
Navbar (fixed, h-16, white, border-bottom)
│
└─ Page content (pt-16 to clear fixed navbar)
   │
   ├─ Section A (py-24)
   ├─ Section B (py-16, different background)
   ├─ Section C (py-16)
   └─ ...
│
Footer (py-12)
```

---

## 9. Component Conventions

### 9.1 Buttons

| Variant | Class pattern | Usage |
|---------|--------------|-------|
| Primary | `bg-green-600 text-white hover:bg-green-700 rounded-lg px-5 py-2.5 font-semibold text-sm` | One per screen — the main action |
| Secondary | `border border-green-600 text-green-600 hover:bg-green-50 rounded-lg px-5 py-2.5 font-semibold text-sm` | Secondary action alongside primary |
| WhatsApp | `bg-[#25D366] text-white hover:bg-[#128C7E] rounded-lg px-5 py-2.5 font-semibold text-sm` | WhatsApp contact only |
| Ghost | `text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg px-4 py-2 text-sm` | Tertiary actions, nav links |
| Danger | `bg-red-600 text-white hover:bg-red-700 rounded-lg px-5 py-2.5 font-semibold text-sm` | Destructive, used sparingly |
| Disabled | `opacity-50 cursor-not-allowed pointer-events-none` | Any variant |

- Minimum touch target: 44×44px.
- Focus ring: `focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`.
- Loading state: `Loader2 animate-spin` inline (16px) + "Loading…" label, button disabled.
- Every button navigates somewhere, submits something, or triggers a clear action. No dead buttons.
- No glow on hover. Hover is `bg-green-700` (darker), not a glow or shadow expansion.

### 9.2 Form Inputs

```css
border border-slate-300 bg-white rounded-lg px-4 py-3
text-base text-slate-900 font-sans w-full
focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
transition-colors duration-150
```

- Label: `font-sans font-medium text-sm text-slate-700 mb-1.5 block`
- Visible `<label>` on every input. Never placeholder-only.
- Error state: `border-red-500 focus:ring-red-500`
- Error message below field: `text-red-600 text-sm mt-1.5 flex items-center gap-1.5` + `<AlertCircle size={14} />`
- Required fields: asterisk `*` in label, `text-red-500`
- Character counter for textareas: `text-slate-400 text-xs text-right mt-1`
- Every form submission produces a visible response: success message, error message, or loading state. No silent submissions.

### 9.3 Cards

Cards are white surfaces with a very subtle shadow. They are not wireframe boxes.

```css
bg-white rounded-2xl shadow-sm p-6
```

No `border` property on card containers. The shadow defines the boundary.
Hover state for interactive cards: `hover:shadow-md transition-shadow duration-150`.
Internal dividers use `border-t border-slate-100` — not card outlines.

**Provider Card:**
- Avatar: `w-12 h-12 rounded-full object-cover` (or initials fallback on `bg-slate-100`)
- Name: `font-display font-semibold text-slate-900 text-lg`
- Location: `MapPin` icon (16px, `text-slate-400`) + `text-slate-500 text-sm`
- Skills: badge chips, `rounded-md`
- Availability: `CheckCircle2` (green, 16px) or `XCircle` (slate, 16px) + label
- Distance (match results): `Navigation` icon + distance in km
- Match quality (match results): thin `h-1 bg-green-500 rounded-full` progress bar with label
- Actions: [WhatsApp button] [Email ghost button] — side by side

**Request Card (Open Board):**
- Service badge: Lucide icon (16px) + category label
- Description: first sentence in `font-display font-medium text-slate-900`, rest in `text-sm text-slate-600 line-clamp-2`
- Metadata: one row — `MapPin` location · `Clock` hours · `Calendar` posted time — `text-xs text-slate-500`
- Photo thumbnail (if exists): `w-16 h-16 rounded-lg object-cover` float right
- Action: [Contact on WhatsApp] button full-width at bottom

### 9.4 Badges

```css
inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium font-sans
```

`rounded-md` not `rounded-full`. Categories are not hashtags.

| Variant | Classes |
|---------|---------|
| Green | `bg-green-100 text-green-700` |
| Slate | `bg-slate-100 text-slate-600` |
| Amber | `bg-amber-100 text-amber-700` |
| Red | `bg-red-100 text-red-700` |

### 9.5 Navbar

- `fixed top-0 w-full h-16 bg-white border-b border-slate-200 z-30`
- Same height on every page without exception.
- Same design language on every page without exception.
- Left: Djema wordmark (`font-display font-bold text-xl text-slate-900`)
- Right (guest): "Post a Request" (primary button) + "Sign in as Provider" (ghost)
- Right (authenticated): "Browse Requests" (ghost) + avatar dropdown (`User` icon or photo, 36px circle)
- Dropdown: Dashboard · Edit Profile · Sign Out (`LogOut` icon)
- Mobile: `Menu` icon (20px) → full-height right slide-over panel

### 9.6 Modals

```css
/* Backdrop */
fixed inset-0 bg-black/40 backdrop-blur-sm z-40

/* Panel */
bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 z-50
```

`X` icon close button top-right. Focus trapped inside. Close on Escape and backdrop click.

---

## 10. Page Specifications

### 10.1 Home Page (`/`)

The hero is built around the product — what it does, for whom, and where. Not a floating dashboard mockup or abstract illustration.

**Hero section:**
- Left-aligned headline in Clash Display: *"The fastest way to find a plumber, electrician, or any skilled worker in Kampala"* — specific, not generic
- One sentence subtext in Plus Jakarta Sans, `text-slate-600`
- One primary CTA: "Post a Request"
- One secondary text link: "Are you a provider? Register here →"
- No badge above the heading, no gradient on any word, no second button labeled "Learn More"
- Background: white or very light slate — no gradient, no blob shapes

**How it works:**
- Numbered steps in a horizontal layout on desktop, vertical on mobile
- Format: number + heading + one short sentence
- No card containers around each step

**Service categories:**
- Icon grid: Lucide icon + label per category
- Clickable → navigates to `/post-request` with the category pre-selected
- Not in floating cards — in a clean grid on a light background

**Impact section:**
- Left-aligned editorial section
- Real numbers with context, not generic statistics
- Example: *"Kampala has over 1.6 million informal workers with no digital presence. Djema gives them one."*
- SDG 8 alignment stated directly and briefly

**No sections containing:**
- Testimonials from unverifiable people
- Client logos from organizations that haven't worked with Djema
- Generic statistics (10k+ users, 99.9% satisfaction) before launch
- Scrolling partner carousels

### 10.2 Post Request Page (`/post-request`)

Single-column form with generous spacing between fields.

Fields in order:
1. Service type — icon + label grid, tap to select (selection: green border + green text)
2. Description — `<textarea>` with character counter, `placeholder="Describe what you need done and any relevant details"`
3. Location — Google Places Autocomplete, `MapPin` leading icon
4. Estimated hours — `<select>`: 0.5h / 1h / 2h / 4h / 8h / Other
5. Photo — optional, click area with `Upload` icon and "Add a photo (optional)" label

Submit: [Find Matches] primary button

Loading state after submit:
- `Loader2 animate-spin` (32px, green) centered
- `font-sans text-slate-600 text-base mt-4` — "Finding skilled people near you in Kampala…"
- No full-screen takeover — just the area below the form

### 10.3 Match Results Page (`/matches/:requestId`)

**State A — matches found:**
- Heading: "We found [n] providers near you" (`font-display text-2xl`)
- Subtext: "Here are the best matches based on skill and distance."
- Provider cards in a list (single column on mobile, two columns on desktop)
- Cards sorted by `finalScore` descending

**State B — no matches:**
- Heading: "No providers found yet"
- Paragraph: 2 sentences, plain and direct — no guilt-tripping the user
- Form: WhatsApp number (required) + Email (optional)
- [Post Publicly] primary button
- Short note: "Your request will be visible to registered providers who check the board."

### 10.4 Open Requests Board (`/board`)

- Page title left-aligned: "Open Requests" (`font-display text-3xl`)
- Filter row: service type `<select>` + location `<input>` + [Apply filters] ghost button
- Card grid: 1 col mobile, 2 col md, 3 col lg, `gap-6`
- Load more: `<button>` at bottom, text "Load more requests" — not infinite scroll
- Empty state: `SearchX` icon (48px, slate-300) + "No open requests right now." + [Post a Request] button

### 10.5 Provider Register (`/register`)

Step indicator: plain text — "Step 1 of 2" right-aligned above the form. No dots, no progress bars.

**Step 1 — Account:**
- Email field
- Password field (show/hide toggle via `Eye`/`EyeOff` icon)
- Confirm password
- [Continue] primary button
- Divider: thin `border-slate-200` line with "or" in center
- [Continue with Google] secondary button

**Step 2 — Profile:**
- Display name
- Skills (chip multi-select — tap to toggle, max 10)
- Location (Places Autocomplete)
- WhatsApp number
- Bio (textarea, 500 char)
- Profile photo (optional — `Upload` icon area)
- [Complete Registration] primary button

### 10.6 Provider Login (`/login`)

Simple centered card (`max-w-sm`):
- Heading: "Welcome back" (Clash Display)
- Email + password + [Sign In]
- [Sign in with Google]
- Link: "New provider? Register here →"

### 10.7 Provider Dashboard (`/dashboard`)

Left-aligned layout, no hero treatment:
- `font-display text-2xl` — "Welcome back, [Name]"
- Availability row: label + toggle switch + status text ("Available for work" / "Not available")
- Divider
- Section: "Open requests that match your skills" — left-aligned heading, then card grid
- [View all on the board →] text link at bottom

---

## 11. States

### Loading
| Context | Pattern |
|---------|---------|
| Lists and card grids | Skeleton shimmer — grey animated blocks matching the shape of real content |
| Form submission | `Loader2 animate-spin` (32px, green) centered + status message below |
| Button action | Inline `Loader2 animate-spin` (16px) inside button + disabled |

### Empty
Lucide icon (48px, `text-slate-300`) + short plain sentence + one CTA button. No illustration, no decorative elements.

### Error
| Scope | Pattern |
|-------|---------|
| Field-level | Red border + `AlertCircle` (14px) + red message directly below field |
| Form-level | Red banner at top of form: `AlertCircle` + message |
| Page-level | Red banner below navbar: `AlertCircle` + message + Retry button |
| Network | Toast (bottom-right, 5s): `WifiOff` (16px) + "Check your connection and try again." |

### Success
| Scope | Pattern |
|-------|---------|
| Non-critical (profile saved) | Toast (bottom-right, 4s): `CheckCircle2` (16px, green) + message |
| Critical (request posted) | Full-width section: `CheckCircle2` (48px, green) + heading + 1–2 sentences + next step CTA |

### 404
`SearchX` (48px, `text-slate-300`) + "Page not found." (`font-display text-xl`) + [Go to homepage] button.

---

## 12. Animations

Animations exist to communicate state, guide attention, or confirm an interaction. They do not exist for decoration.

**Permitted animations:**
| Use case | Animation |
|----------|-----------|
| Button loading | `Loader2 animate-spin` |
| Toast enter/exit | Slide in from bottom-right, fade out |
| Modal enter | Fade in + scale from 0.97 to 1 |
| Skeleton loading | Pulse shimmer (Tailwind `animate-pulse`) |
| Page transitions | None — instant navigation |

**Prohibited animations:**
- Cards lifting on scroll (`IntersectionObserver` scroll-trigger lift)
- Glow following the cursor
- Background shapes moving continuously
- Every element sliding in from a different direction on scroll
- Button glow on hover
- Any animation that plays automatically without user interaction and serves no functional purpose

All animations respect `prefers-reduced-motion: reduce`.

---

## 13. Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Color contrast | WCAG AA — 4.5:1 for body, 3:1 for large text |
| Focus rings | `focus:ring-2 focus:ring-green-500 focus:ring-offset-2` on all interactive elements |
| Touch targets | Min 44×44px |
| Alt text | All `<img>` have descriptive `alt` attributes |
| Form labels | Visible `<label>` on every input — no placeholder-only |
| ARIA | `role="dialog"` modals, `role="navigation"` nav, `aria-live` for async updates |
| Icon-only buttons | Always have `aria-label` |
| Keyboard | All flows fully keyboard-operable |
| Reduced motion | All transitions wrapped in `prefers-reduced-motion` check |

---

## 14. Prohibited Patterns — Hard Rules

These are documented as hard rules for the coding agent. None of these patterns appear in the codebase under any circumstance.

### Visual
- No emojis anywhere — not in JSX, not in copy, not in placeholder text, not in alt text.
- No gradient backgrounds, gradient text, or gradient borders.
- No glow effects on buttons, cards, or borders.
- No blurred circle shapes or abstract blobs in backgrounds.
- No frosted glass (`backdrop-blur` used only on modal overlays).
- No dark background with neon/violet accents anywhere on the site.
- No decorative 3D shapes or floating dashboard mockups if not necessary.
- No scrolling partner logo carousels if not necessary.

### Layout
- No small pill-shaped badge above every section heading.
- No three identical feature cards in every section.
- No icons sitting inside rounded-square containers if not necessary for visual purposes.
- No card inside a card inside a card.
- No centered alignment on every section — only the hero is centered if not necessary for visual purposes.
- No section repeating the same structure as the one before it if not necessary for visual purposes.
- No arbitrary spacing values — all padding/margin from the approved scale.

### Typography & Copy
- No gradient text on headings.
- No title case on every heading — sentence case unless proper noun.
- No generic filler phrases: "seamless", "cutting-edge", "innovative", "revolutionize", "elevate", "empower", "unlock", "transform", "next generation", "journey starts here".
- No overuse of em dashes. Use periods and short sentences.
- No identical sentence structure across all sections.
- No Lorem Ipsum, "Your company name here", placeholder addresses, or sample content left in production.

### Functionality
- No dead buttons — every button has a real, working action.
- No unverified testimonials or fake client logos.
- No generic statistics without context — "10,000+ users" before the platform has launched just use of goals when the platform still hasn't yet received real testimonies.
- No broken form submissions — every form produces a visible response.
- No mobile layout that is just a shrunken desktop layout.

### Consistency
- The navbar height is `h-16` on every page. Not `h-14` on login and `h-16` on homepage.
- Buttons are `rounded-lg` on every page. Not `rounded-full` on one page and `rounded-lg` on another.
- Colors come from the defined palette only. No `text-green-500` in one file and `text-green-600` in another for the same semantic purpose.
- One font for headings (Clash Display), one font for everything else (Plus Jakarta Sans), on every page.
