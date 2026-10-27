# ARCHITECTURE.md — Architecture Document
## Djema: Informal Skills & Services Marketplace

---

## 1. Architecture Overview

Djema follows a **serverless architecture** using Firebase free tier (Spark plan) for all backend services and React for the frontend. No billing account is required — every service used runs on Firebase's free Spark plan.

> **Billing constraint:** This build uses only services available on Firebase Spark (free) plan. Vertex AI, Cloud Functions outbound network calls, Google Maps API, and Google Places API all require a billing account and are therefore **not used**. See Section 2.3 for free replacements.

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                        │
│           React SPA (PWA) — Firebase Hosting            │
│                                                         │
│   ┌─────────────────────────────────────────────────┐  │
│   │         TF.js Universal Sentence Encoder         │  │
│   │   (AI matching runs entirely in the browser)     │  │
│   └─────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS (Firebase SDK)
┌────────────────────────▼────────────────────────────────┐
│             FIREBASE SPARK (FREE) SERVICES               │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Firebase   │  │    Cloud     │  │   Firebase    │  │
│  │    Auth     │  │  Firestore   │  │   Storage     │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
│                                                         │
│            Firebase Hosting (free tier)                 │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### 2.1 Frontend
| Concern | Choice | Reason |
|---------|--------|--------|
| Framework | **React 18** | Fast development, large ecosystem, PWA support |
| Language | **TypeScript** | Type safety, better maintainability |
| Styling | **Tailwind CSS** | Utility-first, fast UI, small bundle |
| Routing | **React Router v6** | Industry standard for React SPAs |
| State management | **Zustand** | Lightweight, no boilerplate |
| Forms | **React Hook Form + Zod** | Performant forms with schema validation |
| Build tool | **Vite** | Fast dev server and optimized production builds |
| PWA | **Vite PWA plugin** | Service worker, installability, offline shell |
| Location input | **Plain text input + Nominatim geocoding** | Free, no API key, no billing account required |

### 2.2 Backend (Serverless — Firebase Spark free tier)
| Concern | Choice | Reason |
|---------|--------|--------|
| Authentication | **Firebase Authentication** | Email/password + Google Sign-In, free tier |
| Database | **Cloud Firestore** | Real-time, NoSQL, scalable, free tier |
| File storage | **Firebase Storage** | Photo uploads, free tier |
| Hosting | **Firebase Hosting** | CDN-backed, HTTPS, free tier |
| Analytics | **Google Analytics for Firebase** | Usage tracking, free |

> **Not used (require billing account):** Cloud Functions, Vertex AI, Google Maps API, Google Places API.

### 2.3 AI / Intelligence Layer — Client-side (No Billing Required)
| Concern | Choice | Reason |
|---------|--------|--------|
| Skill matching | **TensorFlow.js — Universal Sentence Encoder** | Semantic text similarity, runs entirely in the browser, completely free |
| Proximity scoring | **Haversine distance (client-side)** | Pure JavaScript, no API calls, accurate great-circle distance |
| Match ranking | **Weighted score = skill_score × 0.6 + proximity_score × 0.4** | Computed client-side after fetching providers from Firestore |

**Why client-side matching works for this project:**
- At hackathon scale (dozens to hundreds of providers), fetching all available providers from Firestore and running TF.js in the browser is fast enough (< 3 seconds).
- No server roundtrip, no cold start latency, no billing.
- **Production upgrade path:** When the platform scales, move matching to Cloud Functions + Vertex AI embeddings — the algorithm is identical, only the execution environment changes.

### 2.4 Third-party Integrations
| Integration | Purpose | Cost |
|-------------|---------|------|
| **WhatsApp Deep Link** (`https://wa.me/{phone}?text=...`) | One-tap contact between requester and provider | Free |
| **Nominatim (OpenStreetMap)** | Geocoding location text → lat/lng coordinates | Free, no key |
| **TensorFlow.js Universal Sentence Encoder** | In-browser semantic text embeddings for matching | Free, no key |

---

## 3. Frontend Architecture

### 3.1 Application Structure

```
src/
├── assets/               # Static assets (logo, icons)
├── components/           # Reusable UI components
│   ├── common/           # Button, Input, Card, Badge, Modal, Spinner
│   ├── layout/           # Navbar, Footer, PageWrapper
│   ├── request/          # RequestForm, RequestCard, MatchList
│   └── provider/         # ProviderCard, ProviderProfile, ProviderForm
├── pages/                # Route-level page components
│   ├── HomePage.tsx
│   ├── PostRequestPage.tsx
│   ├── MatchResultsPage.tsx
│   ├── OpenBoardPage.tsx
│   ├── ProviderRegisterPage.tsx
│   ├── ProviderLoginPage.tsx
│   ├── ProviderDashboardPage.tsx
│   ├── ProviderProfilePage.tsx
│   └── NotFoundPage.tsx
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Firebase Auth state
│   ├── useProviders.ts   # Firestore provider queries
│   └── useRequests.ts    # Firestore request queries
├── services/             # Firebase + API integrations
│   ├── firebase.ts       # Firebase app init
│   ├── auth.ts           # Auth helpers
│   ├── firestore.ts      # Firestore CRUD helpers
│   ├── storage.ts        # Firebase Storage upload helpers
│   └── matching.ts       # Calls matching Cloud Function
├── store/                # Zustand state slices
│   ├── authStore.ts
│   └── requestStore.ts
├── types/                # TypeScript interfaces and types
│   ├── provider.ts
│   ├── request.ts
│   └── match.ts
├── utils/                # Pure utility functions
│   ├── whatsapp.ts       # WhatsApp deep link generator
│   ├── location.ts       # Distance helpers
│   └── validation.ts     # Shared Zod schemas
├── App.tsx               # Root component + Router setup
└── main.tsx              # Entry point
```

### 3.2 Routing Structure

| Route | Component | Auth Required |
|-------|-----------|---------------|
| `/` | `HomePage` | No |
| `/post-request` | `PostRequestPage` | No |
| `/matches/:requestId` | `MatchResultsPage` | No |
| `/board` | `OpenBoardPage` | No (view) |
| `/register` | `ProviderRegisterPage` | No |
| `/login` | `ProviderLoginPage` | No |
| `/dashboard` | `ProviderDashboardPage` | Yes (Provider) |
| `/profile/edit` | `ProviderProfilePage` | Yes (Provider) |
| `/providers/:id` | `ProviderPublicProfile` | No |

### 3.3 Authentication Flow

```
User visits protected route
        │
        ▼
   useAuth() hook checks Firebase Auth state
        │
   ┌────┴────┐
   │ Logged  │──Yes──► Render protected page
   │   In?   │
   └────┬────┘
        │ No
        ▼
   Redirect to /login
        │
        ▼
   Login page → Firebase Auth
        │
        ▼
   Auth state updates → redirect to /dashboard
```

---

## 4. Backend Architecture

### 4.1 Cloud Firestore Collections

```
firestore/
├── providers/            # Registered service providers
├── requests/             # Service requests (posted by clients)
├── matches/              # AI match results (linked to a request)
└── categories/           # Service categories (plumber, electrician…)
```

Full schema is defined in `DATABASE.md`.

### 4.2 Cloud Functions

> **Not used in this build.** Cloud Functions require the Firebase Blaze (pay-as-you-go) plan to make outbound network calls. Since no billing account is available, all logic that would have run in Cloud Functions now runs client-side.

**Production upgrade path:** When a billing account is available, move the matching trigger to a Cloud Function (`onRequestCreated`) calling Vertex AI — the algorithm is identical.

### 4.3 Matching Algorithm Flow — Client-side with TF.js

```
1. User submits request form
        │
        ▼
2. Client writes request document to Firestore
        │
        ▼
3. Client navigates to MatchResultsPage
        │
        ▼
4. Client fetches all providers where available = true
   from Firestore (one query)
        │
        ▼
5. TF.js Universal Sentence Encoder loads in browser
   (cached after first load via service worker)
        │
        ▼
6. For each candidate provider:
   a. Encode request.description + request.serviceType → vector
   b. Encode provider.bio + provider.skills.join(', ') → vector
   c. Cosine similarity → skill_score (0–1)
   d. Haversine(request.location, provider.location) → distanceKm
   e. proximity_score = Math.max(0, 1 - distanceKm / 50)
      (50km max radius — scores 0 beyond 50km)
   f. final_score = (skill_score × 0.6) + (proximity_score × 0.4)
        │
        ▼
7. Filter: final_score ≥ 0.4 (lower threshold for client-side)
        │
        ▼
8. Sort descending, take top 10
        │
        ▼
9. Write results to matches/{requestId} in Firestore
        │
        ▼
10. MatchResultsPage renders results
        │
   ┌────┴─────────────────────┐
   │ results.length > 0 ?     │
   └──┬───────────────────────┘
      │ Yes                  │ No
      ▼                      ▼
Show provider list    Prompt for contact info
                      → isPublic: true → Open Board
```

### 4.4 Firestore Security Rules (Summary)

```
providers:
  - read: public (anyone can view provider profiles)
  - create/update/delete: only the authenticated owner (providers/{uid})

requests:
  - read: public (for Open Board)
  - create: anyone (no auth required to post)
  - update/delete: only the original requester (by session token stored at creation) OR admin

matches:
  - read: only authenticated providers OR the requester (by session token)
  - write: only Cloud Functions (service account)

categories:
  - read: public
  - write: admin only
```

---

## 5. Data Flow Between Components

### 5.1 Post a Request (Happy Path — Matches Found)

```
React Form (PostRequestPage)
    │  form submit
    ▼
firestore.ts → addDoc("requests", payload)
    │
    ▼
Navigate to MatchResultsPage
    │
    ▼
Fetch all available providers from Firestore (client-side)
    │
    ▼
TF.js Universal Sentence Encoder → cosine similarity (skill_score)
Haversine distance → proximity_score
Weighted final_score computed for each provider
    │
    ▼
Top 10 results written to matches/{requestId}
    │
    ▼
Render ProviderCard list with WhatsApp + Email buttons
```

### 5.2 Post a Request (No Matches — Open Board)

```
matches/{requestId}.results = []
    │
    ▼
MatchResultsPage shows "No matches found" UI
    │  requester enters WhatsApp + email
    ▼
firestore.ts → updateDoc("requests/{id}", { contactInfo, isPublic: true })
    │
    ▼
Request appears on OpenBoardPage (query: isPublic == true AND status == "open")
    │
    ▼
Provider sees request → clicks "Contact on WhatsApp"
    │
    ▼
whatsapp.ts → generates wa.me deep link with pre-filled message
    │
    ▼
Opens WhatsApp on provider's device
```

---

## 6. Authentication & Authorization

| Actor | Auth Method | Capabilities |
|-------|-------------|-------------|
| Service Requester (guest) | None — session-based token stored in localStorage | Post a request, view matches for their own request |
| Service Provider | Firebase Auth (email/password or Google Sign-In) | Full provider dashboard, browse Open Board, contact requesters |
| Admin (future) | Firebase Auth with custom claims (`role: admin`) | Moderate requests and providers |

**Session token for guest requesters:** On request creation, a UUID is generated client-side and stored in `localStorage`. This token is saved in the request document. The requester's browser uses it to read their own match results. This avoids requiring an account while still keeping results semi-private.

---

## 7. Deployment Architecture

```
Developer machine
    │  git push
    ▼
GitHub repository
    │
    ▼
Firebase CLI (manual deploy for hackathon)
  firebase deploy --only hosting        → Firebase Hosting (CDN, free)
  firebase deploy --only firestore:rules → Firestore rules
  firebase deploy --only storage:rules  → Storage rules
```

- **No Cloud Functions deployed** — all logic is client-side (no billing required).
- **Environments:** Local (Firebase emulator suite, free) → Production (`djema-prod`, Firebase Spark free plan).
- **Local development:** Firebase Emulator Suite (Auth, Firestore, Storage) — fully offline, free.

---

## 8. Important Technical Decisions & Constraints

| Decision | Rationale |
|----------|-----------|
| **No billing account — Spark plan only** | All services used are on Firebase free tier. No Cloud Functions, no Vertex AI, no Google Maps API. |
| **Client-side matching with TF.js** | TensorFlow.js Universal Sentence Encoder runs in the browser — semantic matching with zero API cost. Production upgrade: move to Cloud Functions + Vertex AI when billing is available. |
| **Nominatim for geocoding** | Free OpenStreetMap geocoding API — no key, no billing. Converts "Ntinda, Kampala" → lat/lng. |
| **No Google Maps embed** | Replaced with a simple text display of location names. No API key needed. |
| Firestore over Realtime Database | Better querying, offline capability, structured data model. |
| Guest requests (no auth) | Reduces friction — forcing signup kills conversion for informal users. |
| WhatsApp as primary communication | Dominant messaging platform in Uganda and East Africa. |
| React + Vite over Next.js | No SSR needed. Simpler and faster for hackathon. |
| Firebase Spark (free) plan | Auth, Firestore (1GB storage, 50k reads/day), Storage (5GB), Hosting (10GB/month) — sufficient for demo and early growth. |

---

## 9. Non-Goals (Architecture)

- No microservices or containerized workloads (overkill for this stage).
- No GraphQL (Firestore SDK is sufficient).
- No Redis or separate caching layer (Firestore client-side cache handles this).
- No WebSockets (Firestore real-time listeners replace this).
- No payment gateway integration (v1 out of scope).
