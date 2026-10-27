# IMPLEMENTATION_PLAN.md — Development Roadmap
## Djema: Informal Skills & Services Marketplace

---

## 1. Overview

**Total build window: 24 hours.**

The build is structured in **5 phases** with a hard cut line at Hour 18. Everything before Hour 18 is the working demo. Everything after is polish and deployment.

If something has to be dropped, it gets dropped from the bottom of the priority list — the core loop (post request → AI match → WhatsApp contact) is never sacrificed.

---

## 2. 24-Hour Schedule

| Hours | Phase | Goal |
|-------|-------|------|
| 0–3 | Phase 1 — Foundation | Project running, design system in code, routing, shared components |
| 3–6 | Phase 2 — Provider Auth & Profile | Register, login, profile saved to Firestore |
| 6–12 | Phase 3 — Request + AI Matching | Core product loop working end to end |
| 12–15 | Phase 4 — Open Requests Board | Public board, provider contacts requester |
| 15–18 | Phase 5 — Dashboard + Polish | Provider dashboard, availability, states |
| 18–21 | Phase 6 — Demo Data + QA | Seed providers, test full flow on real device |
| 21–24 | Phase 7 — Deploy | Firebase Hosting live, PWA, final checks |

**Hard rule: At Hour 18, stop adding features. Whatever is not done gets cut.**

---

## 3. Development Environment Setup

Complete before the clock starts:

```bash
# Scaffold
npm create vite@latest djema -- --template react-ts
cd djema

# Core dependencies
npm install firebase react-router-dom zustand
npm install react-hook-form zod @hookform/resolvers
npm install lucide-react browser-image-compression

# Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# PWA
npm install -D vite-plugin-pwa

# Firebase
firebase init
# Select: Firestore, Functions, Hosting, Storage, Emulators

# Cloud Functions
cd functions && npm install firebase-admin firebase-functions @google-cloud/aiplatform
```

**Required before Hour 0:**
- Firebase project created (`djema-dev`)
- Google Cloud project with Vertex AI API enabled
- Google Maps API key with Places API enabled
- `.env.local` with all keys
- Firebase emulators confirmed running locally

---

## 4. Phase 1 — Foundation (Hours 0–3)

**Goal:** Running app. Design system in code. All shared components. Routing.

### Tasks

| # | Task | File | Done when |
|---|------|------|-----------|
| 1.1 | Tailwind config — fonts + color palette | `tailwind.config.js` | Clash Display + Plus Jakarta Sans render |
| 1.2 | Firebase app init | `src/services/firebase.ts` | No console errors |
| 1.3 | Route definitions | `src/App.tsx` | All routes resolve |
| 1.4 | Navbar | `src/components/layout/Navbar.tsx` | Renders on all pages |
| 1.5 | Footer | `src/components/layout/Footer.tsx` | Renders correctly |
| 1.6 | PageWrapper | `src/components/layout/PageWrapper.tsx` | Consistent max-width + padding |
| 1.7 | Button (all variants) | `src/components/common/Button.tsx` | Primary, secondary, WhatsApp, ghost, danger |
| 1.8 | Input + Label | `src/components/common/Input.tsx` | Default, error, disabled states |
| 1.9 | Badge | `src/components/common/Badge.tsx` | All color variants |
| 1.10 | Toast | `src/components/common/Toast.tsx` | Appears and dismisses |
| 1.11 | Skeleton | `src/components/common/Skeleton.tsx` | Pulse animation |
| 1.12 | Firestore security rules | `firestore.rules` | Deploy without errors |
| 1.13 | Storage security rules | `storage.rules` | Deploy without errors |
| 1.14 | Seed 16 categories | `scripts/seedCategories.ts` | Visible in Firestore emulator |

**Exit criteria:** `npm run dev` runs clean. Firebase emulators connect. All pages load (may be empty).

---

## 5. Phase 2 — Provider Auth & Profile (Hours 3–6)

**Goal:** A provider can register, log in, and have a profile in Firestore.

### Tasks

| # | Task | File | Done when |
|---|------|------|-----------|
| 2.1 | Firebase Auth — email/password | `src/services/auth.ts` | Register + login work |
| 2.2 | Firebase Auth — Google Sign-In | `src/services/auth.ts` | Google flow completes |
| 2.3 | `useAuth` hook + `authStore` | `src/hooks/useAuth.ts` | Auth state persists on refresh |
| 2.4 | Provider Register — Step 1 (account) | `src/pages/ProviderRegisterPage.tsx` | Account created in Firebase Auth |
| 2.5 | Provider Register — Step 2 (profile) | `src/pages/ProviderRegisterPage.tsx` | Document written to `providers/{uid}` |
| 2.6 | Skills multi-select chip picker | `src/components/provider/SkillPicker.tsx` | Up to 10 skills selectable |
| 2.7 | Google Places Autocomplete input | `src/components/common/LocationInput.tsx` | Returns `locationName` + `GeoPoint` |
| 2.8 | Profile photo upload | `src/services/storage.ts` | URL saved in provider document |
| 2.9 | Provider Login page | `src/pages/ProviderLoginPage.tsx` | Login → redirects to dashboard |
| 2.10 | Protected route wrapper | `src/components/common/ProtectedRoute.tsx` | Unauth → redirects to login |
| 2.11 | TypeScript types for Provider | `src/types/provider.ts` | All fields typed |

**Exit criteria:** Register a new provider from scratch. Profile visible in Firestore emulator. Refresh keeps session. `/dashboard` without auth → redirects to login.

---

## 6. Phase 3 — Request Posting & AI Matching (Hours 6–12)

**Goal:** Guest posts a request. AI matches it. Results appear. WhatsApp contact works.
This is the most complex phase and carries the highest risk. Do not skip steps.

### Tasks

| # | Task | File | Done when |
|---|------|------|-----------|
| 3.1 | TypeScript types for Request + Match | `src/types/request.ts`, `src/types/match.ts` | All fields typed |
| 3.2 | Post Request page form | `src/pages/PostRequestPage.tsx` | Validates and submits |
| 3.3 | Category picker grid | `src/components/request/CategoryPicker.tsx` | Single selection highlights green |
| 3.4 | Photo upload on request | `src/pages/PostRequestPage.tsx` | Compresses + uploads |
| 3.5 | Session token + localStorage | `src/utils/session.ts` | UUID generated, persists in localStorage |
| 3.6 | Write request to Firestore | `src/services/firestore.ts` | Document created with all fields |
| 3.7 | `onRequestCreated` Cloud Function | `functions/src/onRequestCreated.ts` | Fires on `requests/{id}` creation |
| 3.8 | Fetch candidate providers in function | `functions/src/onRequestCreated.ts` | Filters by skill overlap + `available: true` |
| 3.9 | Vertex AI embedding integration | `functions/src/matching/embeddings.ts` | Returns vector for a text string |
| 3.10 | Cosine similarity | `functions/src/matching/similarity.ts` | Returns score 0–1 |
| 3.11 | Haversine distance | `functions/src/matching/haversine.ts` | Returns distance in km |
| 3.12 | Weighted scoring + top 10 ranking | `functions/src/matching/ranking.ts` | Returns sorted array |
| 3.13 | Write results to `matches/{requestId}` | `functions/src/onRequestCreated.ts` | Document created with results array |
| 3.14 | Match Results page — real-time listener | `src/pages/MatchResultsPage.tsx` | Results appear without page refresh |
| 3.15 | Provider Card component | `src/components/provider/ProviderCard.tsx` | All match fields displayed |
| 3.16 | WhatsApp deep link generator | `src/utils/whatsapp.ts` | Opens `wa.me` URL with pre-filled message |
| 3.17 | "No matches" state + contact form | `src/pages/MatchResultsPage.tsx` | Saves contact info + sets `isPublic: true` |
| 3.18 | Matching loading state | `src/pages/MatchResultsPage.tsx` | Spinner + message while function runs |

**Exit criteria:** Post a request → see spinner → results within 3s. Each card has WhatsApp button that opens a correct pre-filled message. "No matches" path writes contact info and sets `isPublic: true`. Cloud Function logs show no errors.

---

## 7. Phase 4 — Open Requests Board (Hours 12–15)

**Goal:** Providers browse and contact requesters from the public board.

### Tasks

| # | Task | File | Done when |
|---|------|------|-----------|
| 4.1 | Open Board page | `src/pages/OpenBoardPage.tsx` | Lists public open requests |
| 4.2 | Request Card component | `src/components/request/RequestCard.tsx` | All fields displayed |
| 4.3 | Filter bar — service type + location | `src/components/request/BoardFilters.tsx` | Filters update list |
| 4.4 | Firestore query (`isPublic == true AND status == "open"`) | `src/hooks/useRequests.ts` | Correct documents returned |
| 4.5 | "Load more" pagination | `src/pages/OpenBoardPage.tsx` | Loads next 10 |
| 4.6 | WhatsApp contact from board | `src/components/request/RequestCard.tsx` | Correct provider → requester message |
| 4.7 | Empty state | `src/pages/OpenBoardPage.tsx` | `SearchX` icon + message + CTA |

**Exit criteria:** A logged-in provider can see all public requests. Filter by service type returns correct results. WhatsApp button opens correct message.

---

## 8. Phase 5 — Dashboard & Polish (Hours 15–18)

**Goal:** Provider dashboard works. All loading/error/empty states handled across the app.

### Tasks

| # | Task | File | Done when |
|---|------|------|-----------|
| 5.1 | Provider Dashboard — full implementation | `src/pages/ProviderDashboardPage.tsx` | Welcome, availability toggle, request feed |
| 5.2 | Provider Profile Edit page | `src/pages/ProviderProfilePage.tsx` | Changes save to Firestore |
| 5.3 | Availability toggle with optimistic UI | `src/components/provider/AvailabilityToggle.tsx` | Updates Firestore instantly |
| 5.4 | 404 page | `src/pages/NotFoundPage.tsx` | Renders on unknown routes |
| 5.5 | All empty states | Across pages | No blank screens on empty data |
| 5.6 | All error states | Across pages | No silent failures |
| 5.7 | Mobile responsiveness pass | All pages | No horizontal scroll, all targets ≥44px |
| 5.8 | Navbar mobile slide-over menu | `src/components/layout/Navbar.tsx` | Works on 375px viewport |

**Exit criteria:** Provider can toggle availability. No blank screens anywhere. App works on a 375px mobile viewport without horizontal scroll.

---

## 9. Phase 6 — Demo Data & QA (Hours 18–21)

**Goal:** The demo is ready to run. Real data in Firestore. Full flow tested on a device.

### Tasks

| # | Task | Done when |
|---|------|-----------|
| 6.1 | Seed 8 demo providers with realistic Kampala profiles | Visible in production Firestore |
| 6.2 | Seed 3 demo open requests | Visible on the board in production |
| 6.3 | Pre-compute `skillEmbedding` for all seeded providers | Stored in each provider document |
| 6.4 | Test full requester flow on a real Android device | Request posted → match returned → WhatsApp opens |
| 6.5 | Test full provider flow on a real Android device | Login → see board → contact requester on WhatsApp |
| 6.6 | Test "no matches" flow | Contact info saved, request appears on board |
| 6.7 | Verify Cloud Function logs in Firebase console | No errors, latency < 3s |
| 6.8 | Verify all Lucide icons render correctly (no missing icons) | Visual scan of all pages |
| 6.9 | Verify no emojis appear anywhere in the UI | Visual scan of all pages |

**Demo provider seed data (Kampala-realistic):**
```
1. Grace Nakato — Electrician — Ntinda, Kampala
2. Moses Ssemakula — Plumber — Wandegeya, Kampala
3. Sarah Akello — Cleaner / House Help — Kisaasi, Kampala
4. David Ouma — Carpenter — Bukoto, Kampala
5. Fatuma Nabirye — Tailor / Seamstress — Kalerwe, Kampala
6. Joseph Mugisha — Painter — Naguru, Kampala
7. Christine Namutebi — Beautician / Hairdresser — Bwaise, Kampala
8. Robert Ssekandi — IT / Computer Repair — Makerere, Kampala
```

---

## 10. Phase 7 — Deploy (Hours 21–24)

**Goal:** Live URL on Firebase Hosting. App installable as PWA.

### Tasks

| # | Task | Done when |
|---|------|-----------|
| 7.1 | Production Firebase project setup (`djema-prod`) | Project exists with all services enabled |
| 7.2 | Deploy Firestore security rules to production | Rules active |
| 7.3 | Deploy Storage security rules to production | Rules active |
| 7.4 | Deploy Cloud Functions to production | Functions visible in Firebase console |
| 7.5 | Deploy React app to Firebase Hosting | Live URL accessible |
| 7.6 | Configure Vite PWA + manifest | App installable on Android Chrome |
| 7.7 | Test the live URL on a phone | Full demo flow works end to end |
| 7.8 | Confirm no console errors in production | Browser DevTools clean |
| 7.9 | Note the live URL for the pitch | URL ready to share |

---

## 11. Feature Dependencies

```
Phase 1 (Foundation)
    │
    ├── Phase 2 (Auth + Profile)
    │       │
    │       └── Phase 3 (Request + AI Matching) ← needs providers in DB
    │                   │
    │                   └── Phase 4 (Open Board) ← needs public requests
    │                               │
    │                               └── Phase 5 (Polish)
    │                                           │
    │                                           └── Phase 6 (QA + Demo Data)
    │                                                       │
    │                                                       └── Phase 7 (Deploy)
```

---

## 12. Cut Line — What Gets Dropped If Time Runs Out

If Phase 3 runs over, cut in this order (least important first):

| Cut order | Feature | Impact |
|-----------|---------|--------|
| Cut 1st | Profile photo upload | Provider has initials avatar instead — acceptable |
| Cut 2nd | Google Sign-In | Email/password still works — acceptable |
| Cut 3rd | Photo upload on requests | Request works without a photo — acceptable |
| Cut 4th | "Load more" pagination on board | Show all results — acceptable for demo scale |
| Cut 5th | Provider Profile Edit page | Provider sets profile once at registration — acceptable |
| **Never cut** | Post request + AI match + results | Core demo — no demo without this |
| **Never cut** | WhatsApp contact button | Most important action in the product |
| **Never cut** | Open Requests Board | Required for no-match scenario in demo |
| **Never cut** | Provider registration | AI has nothing to match without providers |

---

## 13. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Vertex AI latency > 3s | Medium | Pre-store `skillEmbedding` on providers. Only embed the request live. |
| Vertex AI quota hit during demo | Low | One embedding call per request — quota is not a concern at demo scale. |
| Phase 3 runs over time | High | Start Phase 3 at Hour 6 sharp. Do not over-engineer embeddings — a working simple version beats a perfect broken one. |
| No demo providers in DB | High | Seed data task is in Phase 6. Do not skip it. |
| Cloud Function cold start delay | Medium | Accept on first call. Warm it up once before demo by posting a test request. |
| Mobile layout broken | Medium | Test on a real Android device at Hour 19, not just DevTools. |
| Google Maps API key invalid | Low | Test Places Autocomplete locally before Hour 0. |

---

## 14. Non-Goals (v1 — Not Built in 24 Hours)

- In-platform payments
- Rating/review system
- Real-time in-app chat
- Push notifications
- Native mobile apps
- Admin dashboard
- Provider identity verification
- Multi-language UI
- Request expiry scheduled function (deferred — not visible in demo)
