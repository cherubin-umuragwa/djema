# AGENTS.md — AI Coding Agent Instructions
## Djema: Informal Skills & Services Marketplace

> This document defines how the AI coding agent must work within this project.
> Read this file before reading any other document. Read all six documents before writing any code.

---

## 1. Project Overview

Djema is a web-based platform connecting informal service requesters with skilled workers in Kampala, Uganda. Built for the PreDevFest Hackathon with a 24-hour build window.

**The platform does two things:**
1. A guest posts a service request → AI matches them with nearby registered providers → they contact each other via WhatsApp or email.
2. When no match is found → the request is posted publicly → providers browse the board and contact the requester.

**SDG alignment:** SDG 8 — Decent Work and Economic Growth.

---

## 2. Source of Truth — Document Hierarchy

When making any decision, consult documents in this order:

| Priority | Document | Governs |
|----------|---------|---------|
| 1 | `AGENTS.md` (this file) | How to work |
| 2 | `PRD.md` | What to build and why |
| 3 | `ARCHITECTURE.md` | How the system is structured |
| 4 | `DATABASE.md` | Data models, Firestore schema, security rules |
| 5 | `DESIGN_SYSTEM.md` | Every visual and UI decision |
| 6 | `IMPLEMENTATION_PLAN.md` | Order of work, phase tasks, cut line |

If any instruction in code conflicts with a document, the document wins. Fix the code, not the document.

---

## 3. Technology Stack

Do not introduce any library, framework, or tool not listed here without explicit approval.

### Frontend
| Tool | Version | Purpose |
|------|---------|---------|
| React | 18 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 5 | Build tool |
| Tailwind CSS | 3 | Styling |
| React Router | v6 | Routing |
| Zustand | 4 | State management |
| React Hook Form | 7 | Form handling |
| Zod | 3 | Schema validation |
| Lucide React | latest | Icons — the only icon library |
| browser-image-compression | latest | Client-side image compression |
| vite-plugin-pwa | latest | PWA support |
| @tensorflow/tfjs | latest | TF.js runtime for in-browser AI matching |
| @tensorflow-models/universal-sentence-encoder | latest | Semantic text embeddings for skill matching |

### Backend (Firebase Spark — free, no billing required)
| Tool | Purpose |
|------|---------|
| Firebase Authentication | Provider auth (email/password + Google) |
| Cloud Firestore | Primary database |
| Firebase Storage | Photo uploads |
| Firebase Hosting | Frontend deployment |
| Google Analytics for Firebase | Usage tracking |

> **Not used (require billing account):** Cloud Functions, Vertex AI, Google Maps API, Google Places API.

### Location
| Tool | Purpose |
|------|---------|
| Nominatim (OpenStreetMap) | Free geocoding — converts place name text to lat/lng. No API key. No billing. |

### Not used — do not introduce
- Redux, MobX, Recoil, Jotai (Zustand is sufficient)
- Axios (use native fetch or Firebase SDK)
- Styled-components, Emotion, CSS Modules (Tailwind only)
- Next.js, Remix (Vite SPA only)
- Prisma, Drizzle, any SQL ORM (Firestore only)
- Any UI component library (shadcn, Chakra, MUI, Ant Design) — build from scratch using Tailwind
- Any emoji library
- Any animation library (Framer Motion, GSAP) — use Tailwind transitions only
- Google Maps JavaScript API (requires billing)
- Google Places API (requires billing)
- Cloud Functions (requires billing for outbound network calls)

---

## 4. Directory Structure

Follow this structure exactly. Do not create directories or files outside of it without a documented reason.

```
djema/
├── public/
│   ├── manifest.json
│   └── icons/              # PWA icons (192px, 512px)
├── src/
│   ├── assets/             # Static assets (logo SVG)
│   ├── components/
│   │   ├── common/         # Button, Input, Badge, Toast, Skeleton, Modal, ProtectedRoute, LocationInput
│   │   ├── layout/         # Navbar, Footer, PageWrapper
│   │   ├── provider/       # ProviderCard, SkillPicker, AvailabilityToggle, ProviderForm
│   │   └── request/        # RequestCard, CategoryPicker, BoardFilters, MatchList
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useProviders.ts
│   │   └── useRequests.ts
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── PostRequestPage.tsx
│   │   ├── MatchResultsPage.tsx
│   │   ├── OpenBoardPage.tsx
│   │   ├── ProviderRegisterPage.tsx
│   │   ├── ProviderLoginPage.tsx
│   │   ├── ProviderDashboardPage.tsx
│   │   ├── ProviderProfilePage.tsx
│   │   └── NotFoundPage.tsx
│   ├── services/
│   │   ├── firebase.ts     # Firebase app init — import from here, nowhere else
│   │   ├── auth.ts         # All Firebase Auth calls
│   │   ├── firestore.ts    # All Firestore read/write helpers
│   │   ├── storage.ts      # All Firebase Storage upload helpers
│   │   └── matching.ts     # Client-side TF.js matching logic
│   ├── store/
│   │   ├── authStore.ts
│   │   └── requestStore.ts
│   ├── types/
│   │   ├── provider.ts
│   │   ├── request.ts
│   │   └── match.ts
│   ├── utils/
│   │   ├── whatsapp.ts     # WhatsApp deep link generator
│   │   ├── session.ts      # Guest session token (UUID + localStorage)
│   │   ├── location.ts     # Haversine distance (client-side)
│   │   ├── geocoding.ts    # Nominatim geocoding (place name → lat/lng)
│   │   └── validation.ts   # Shared Zod schemas
│   ├── App.tsx
│   └── main.tsx
├── scripts/
│   ├── seedCategories.ts
│   └── seedDemo.ts
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── firebase.json
├── .env.local              # Never committed
└── .env.example            # Committed — shows required keys, no values
```

---

## 5. Coding Conventions

### 5.1 TypeScript
- Strict mode enabled. No `any` types. Use `unknown` and narrow explicitly.
- All component props have explicit interfaces or type aliases.
- All Firestore document shapes are typed using interfaces in `src/types/`.
- Use `type` for unions and intersections. Use `interface` for object shapes.
- No non-null assertions (`!`) unless you have already narrowed the type.

### 5.2 React
- Functional components only. No class components.
- One component per file. File name matches the component name exactly.
- Component files use `.tsx`. Non-component TypeScript files use `.ts`.
- Props interfaces are defined in the same file as the component, above the component.
- No inline styles. All styling via Tailwind utility classes.
- No `useEffect` for data fetching — use Firestore real-time listeners inside custom hooks instead.
- All `useEffect` calls have a dependency array. No empty-array shortcuts without a comment explaining why.

### 5.3 Tailwind CSS
- Use only the classes defined in `tailwind.config.js` or Tailwind's default scale.
- No arbitrary values except `bg-[#25D366]` and `bg-[#128C7E]` for WhatsApp button colors.
- Font classes: `font-display` for Clash Display, `font-sans` for Plus Jakarta Sans.
- Do not mix semantic color names. Use `text-slate-900` not `text-black`. Use `bg-green-600` not `bg-primary`.
- No `!important` overrides.

### 5.4 Naming Conventions
- Components: `PascalCase` (e.g. `ProviderCard`)
- Hooks: `camelCase` prefixed with `use` (e.g. `useAuth`)
- Stores: `camelCase` suffixed with `Store` (e.g. `authStore`)
- Services: `camelCase` (e.g. `firestore.ts`)
- Types/Interfaces: `PascalCase` (e.g. `Provider`, `ServiceRequest`)
- Firestore collection names: `camelCase` plural (e.g. `providers`, `requests`, `matches`)
- Constants: `SCREAMING_SNAKE_CASE`
- Environment variables: `VITE_` prefix for frontend, without prefix for Cloud Functions

### 5.5 Imports
- Always use absolute imports from `src/` using the `@/` alias configured in `vite.config.ts`.
- Import Firebase instances from `@/services/firebase.ts` only — never re-initialize Firebase.
- Import Lucide icons individually: `import { MapPin } from 'lucide-react'` — never import the entire library.
- Group imports: external libraries → internal services/hooks → components → types → utils.

---

## 6. Firebase & Firestore Rules

### 6.1 Firestore
- Never call Firestore directly from a component. All Firestore access goes through functions in `src/services/firestore.ts` or hooks in `src/hooks/`.
- Always handle Firestore errors explicitly — never let them fail silently.
- Never store sensitive data (WhatsApp numbers, emails) in client-accessible state without checking the user is authenticated first.
- Firestore document IDs for `providers` collection = Firebase Auth UID. Never deviate from this.
- The `matches` collection is read-only from the client. It is written by Cloud Functions only.
- Always use Firestore Timestamps, not JavaScript `Date` objects, for time fields.

### 6.2 Matching (Client-side)
- Matching runs entirely in the browser using TensorFlow.js Universal Sentence Encoder.
- The matching service lives in `src/services/matching.ts`.
- Flow: fetch all available providers from Firestore → encode texts with TF.js → cosine similarity → haversine distance → weighted score → write top 10 to `matches/{requestId}`.
- The TF.js model is loaded once and cached. Show a loading state while the model loads on first visit.
- Never expose provider WhatsApp numbers or emails to the client before the match is confirmed — read them from the match result only, not from the raw providers collection directly in components.

### 6.3 Security Rules
- The `firestore.rules` file is the source of truth for access control.
- Never weaken rules for development convenience — use the emulator instead.
- Since Cloud Functions are not used, the `matches` collection is written by the client after running the matching algorithm. Update the `matches` write rule accordingly:
  ```
  matches: write = request owner (matching sessionToken) only
  ```

---

## 7. Design System Enforcement

The full specification is in `DESIGN_SYSTEM.md`. These are the rules the agent enforces on every line of JSX it writes:

### 7.1 Icons
- Import from `lucide-react` only.
- No emojis in JSX, string literals, placeholder text, alt text, or aria-labels.
- Every icon-only interactive element has an `aria-label`.
- Refer to the icon reference table in `DESIGN_SYSTEM.md` Section 5.3 for the correct icon per context.

### 7.2 Typography
- Headings (`h1`–`h3`): always include `font-display`.
- All other text: `font-sans` (the default in `tailwind.config.js`).
- No inline `style` overrides for font.
- No gradient text. No `bg-clip-text` anywhere.

### 7.3 Colors
- No dark backgrounds. The site background is always white or `bg-slate-100`.
- No `bg-purple-*`, `bg-violet-*`, `bg-indigo-*` used as brand colors.
- Hover states use a darker shade of the same color — never a glow or shadow.
- The only arbitrary color values allowed: `bg-[#25D366]` and `bg-[#128C7E]`.

### 7.4 Cards
- `bg-white rounded-2xl shadow-sm p-6` — no `border` on card containers.
- No nested card patterns (card inside card inside card).

### 7.5 Buttons
- `rounded-lg` always — never `rounded-full` on a button.
- Every button has a real `onClick` handler or `type="submit"`. No dead buttons.
- Loading state: `Loader2` icon with `animate-spin` + disabled state.

### 7.6 Spacing
- All padding and margin values from the approved spacing scale in `DESIGN_SYSTEM.md` Section 6.
- No arbitrary spacing values like `pt-[37px]`.

### 7.7 Layout
- No centered alignment on every section. Only the hero section is centered.
- No two consecutive sections with identical layout structure.
- Mobile-first: write base styles for mobile, then `md:` and `lg:` modifiers.

---

## 8. Security Requirements

- All environment variables containing API keys are stored in `.env.local` (never committed).
- `.env.example` is committed with key names but no values.
- The Google Maps API key is restricted to the production domain in GCP Console before deployment.
- Firestore security rules are deployed before any data is written to production.
- WhatsApp numbers and email addresses from requests are only readable by authenticated providers — enforced at the Firestore rules level, not just the UI level.
- No `console.log` statements that output user personal data (phone numbers, emails) in production builds. Use `console.log` freely in development Cloud Function code but strip or guard it before deploy.
- Input validation is applied at two layers: client-side (Zod via React Hook Form) and Firestore rules. Never rely on client-side validation alone.

---

## 9. Verification Requirements

After completing each task in `IMPLEMENTATION_PLAN.md`, verify before marking it done:

| Task type | Verification method |
|-----------|-------------------|
| New component | Renders without console errors. All variants render correctly. Works on 375px mobile viewport. |
| Form | Submits successfully. Validation errors show on invalid input. Submit button shows loading state. Success/error feedback shown. |
| Firebase Auth | Auth state persists on refresh. Protected routes block unauthenticated access. |
| Firestore write | Document visible in Firestore emulator with correct fields and types. |
| Cloud Function | Function appears in Firebase console. Logs show execution. No errors in logs. |
| Matching | `matches/{requestId}` document written with `results` array containing correctly scored providers. |
| WhatsApp button | `href` opens the correct `wa.me` URL with encoded pre-filled message. Opens in new tab. |
| Responsive layout | Tested at 375px, 768px, and 1280px. No horizontal scroll at any breakpoint. |
| Empty state | Triggered and renders correctly when the data source is empty. |
| Error state | Triggered and renders correctly when the operation fails. |

---

## 10. Dependency Management Rules

- Pin all dependency versions in `package.json`. No `^` or `~` version ranges.
- Use exact versions: `"lucide-react": "0.395.0"` not `"lucide-react": "^0.395.0"`.
- Never install a package to solve a problem that can be solved with Tailwind, Lucide, or the Firebase SDK.
- Before installing any new package, check if the functionality already exists in an approved dependency.
- Cloud Functions dependencies are in `functions/package.json` — keep them separate from the frontend.

---

## 11. Prohibited Shortcuts

These shortcuts are not acceptable under any circumstances, even under time pressure:

- No `// TODO` comments left in production code — either implement it or document it as out of scope.
- No commented-out code blocks left in files.
- No placeholder text, Lorem Ipsum, "Your company name", or sample addresses in any page.
- No `console.log` left in frontend production code.
- No empty `catch` blocks — always handle errors visibly.
- No `useEffect` with a missing dependency that causes lint warnings — fix the dependency array.
- No hardcoded Firebase project IDs, API keys, or collection names in component files — use constants from `src/services/firebase.ts` or environment variables.
- No direct Firestore calls from page components — always go through `src/services/firestore.ts` or hooks.
- No `any` type cast to avoid a TypeScript error — fix the type.

---

## 12. Git & Change Management

- Commit after completing each phase, not after individual tasks.
- Commit messages follow: `feat(phase-N): description of what was built`
  - Examples: `feat(phase-1): foundation — routing, shared components, Tailwind config`
  - Examples: `feat(phase-3): request posting and AI matching end to end`
- Never commit `.env.local`, Firebase service account keys, or any file containing secrets.
- The `.gitignore` must include: `.env.local`, `functions/.env`, `node_modules/`, `.firebase/`, `dist/`.

---

## 13. Consulting Other Documents

When writing code for a specific concern, always consult the relevant document first:

| I am writing... | Consult first |
|----------------|--------------|
| A new component | `DESIGN_SYSTEM.md` — colors, fonts, spacing, components, prohibited patterns |
| A Firestore query or write | `DATABASE.md` — collection structure, field names, types, security rules |
| A new page or route | `ARCHITECTURE.md` — routing structure, page list, auth requirements |
| A Cloud Function | `ARCHITECTURE.md` — function list, `DATABASE.md` — document structure |
| The matching algorithm | `ARCHITECTURE.md` — Section 4.3 matching flow |
| A new feature | `PRD.md` — does this feature exist in the PRD? Is it Must Have, Should Have, or out of scope? |
| Anything in Phase N | `IMPLEMENTATION_PLAN.md` — what are the exact tasks and exit criteria for this phase? |

---

## 14. Definition of Done

A task is done when:

1. The code is written and saved.
2. The app builds without TypeScript errors (`npm run build` exits 0).
3. The specific verification from Section 9 passes.
4. No new `console.error` warnings appear in the browser.
5. The feature works on a 375px mobile viewport.
6. The design matches `DESIGN_SYSTEM.md` — correct fonts, colors, spacing, no emojis, no prohibited patterns.

A phase is done when all tasks in that phase meet the Definition of Done AND the phase exit criteria in `IMPLEMENTATION_PLAN.md` pass.

---

## 15. Hackathon Context

This project is built for the **PreDevFest Hackathon in Kampala, Uganda**.

Judging criteria and how they are addressed:

| Criterion | Points | How Djema addresses it |
|-----------|--------|----------------------|
| SDG Impact | 30 | SDG 8 — Decent Work. Real users in Kampala. Specific problem with verifiable context. |
| Google Tools | 25 | Firebase Auth, Firestore, Storage, Hosting, Analytics (all free Spark plan) + TensorFlow.js (Google) for in-browser AI matching — used meaningfully, not name-dropped. |
| Technical Execution | 20 | Working demo of core loop: post request → AI match → WhatsApp contact. |
| Feasibility & Scale | 15 | Firebase serverless scales automatically. Architecture documented. Cost-conscious design. |
| Pitch | 10 | 3-minute story: problem (plumber in Kampala) → solution (Djema) → demo → next steps. |

**Demo priority:** The demo must show the core loop working live. If any feature risks breaking the demo, cut it. A working simple product beats a broken complex one.
