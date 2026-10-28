# Djema

**Djema** is a web platform that connects people who need informal services with skilled workers nearby in Kampala, Uganda.

The word *Djema* is Swahili, widely used in Goma (DRC) and across East Africa, meaning *informal jobs*.

---

## The problem

Kampala has over 1.6 million informal workers — plumbers, electricians, carpenters, cleaners, tailors, and more — with no digital presence. Platforms like LinkedIn and Upwork require formal credentials, bank accounts, and polished CVs. Most skilled workers in East Africa are locked out before they even start. People who need services rely entirely on word of mouth, which is slow and unreliable.

## The solution

Djema removes those barriers. A person who needs a plumber types what they need and where they are. An AI matching algorithm finds registered providers nearby whose skills match the request. The requester contacts the provider directly on WhatsApp — no middlemen, no platform fees, no bank card required.

---

## Features

- **Post a request** — no account required. Describe the service, location, and estimated duration.
- **AI-powered matching** — TensorFlow.js Universal Sentence Encoder runs entirely in the browser, matching requests to providers by skill and proximity.
- **WhatsApp contact** — one tap opens a pre-filled WhatsApp conversation.
- **Open Requests Board** — when no match is found, the request is posted publicly for providers to browse and reach out.
- **Provider registration** — register a profile with skills, location, WhatsApp number, and bio.
- **Provider dashboard** — manage availability, browse open requests, and edit profile.

---

## SDG Alignment

**SDG 8 — Decent Work and Economic Growth**

Djema creates economic opportunity for informal workers excluded from formal digital platforms, directly supporting decent work and inclusive growth in Uganda and East Africa.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Tailwind CSS, Vite |
| Routing | React Router v6 |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Auth | Firebase Authentication (email/password + Google) |
| Database | Cloud Firestore |
| Hosting | Firebase Hosting |
| Analytics | Google Analytics for Firebase |
| AI Matching | TensorFlow.js — Universal Sentence Encoder (in-browser) |
| Geocoding | Nominatim (OpenStreetMap) — free, no API key |

---

## Project Structure

```
src/
├── components/
│   ├── common/        # Button, Input, Badge, Avatar, Toast, Skeleton, ...
│   ├── layout/        # Navbar, Footer, PageWrapper, DashboardLayout
│   ├── provider/      # ProviderCard, SkillPicker, AvailabilityToggle
│   └── request/       # RequestCard, CategoryPicker, BoardFilters
├── hooks/             # useAuth, useCategories, useRequests, useProviders
├── pages/             # All route-level page components
├── services/          # firebase.ts, auth.ts, firestore.ts, matching.ts
├── store/             # Zustand auth store
├── types/             # TypeScript interfaces (Provider, ServiceRequest, Match, Category)
└── utils/             # whatsapp.ts, geocoding.ts, location.ts, session.ts, ...
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- A Firebase project with Auth, Firestore, and Hosting enabled

### Setup

```bash
# Install dependencies
npm install

# Copy environment template and fill in your Firebase config
cp .env.example .env.local
```

`.env.local` requires:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

### Run locally

```bash
npm run dev
```

### Seed demo data

Before testing, seed the Firestore database with demo providers and open requests:

```bash
# Seed service categories (run once)
npx tsx scripts/seedCategories.ts

# Seed demo providers and open requests
npx tsx scripts/seedDemo.ts
```

### Deploy Firestore rules and indexes

```bash
npx firebase-tools deploy --only firestore:rules,firestore:indexes --project <your-project-id>
```

### Build for production

```bash
npm run build
```

### Deploy to Firebase Hosting

```bash
npx firebase-tools deploy --only hosting --project <your-project-id>
```

---

## How the AI Matching Works

1. A guest posts a service request (e.g. "plumber", "My kitchen sink is leaking").
2. The app fetches all available providers from Firestore.
3. Providers are first filtered by skill — only providers whose `skills[]` contains the requested service type are candidates.
4. TensorFlow.js Universal Sentence Encoder encodes the request description and each provider's bio + skills into embedding vectors.
5. Cosine similarity gives a **skill score** (0–1). Haversine distance gives a **proximity score** (0–1, decays to 0 beyond 50km).
6. Final score = `skill_score × 0.6 + proximity_score × 0.4`.
7. Top 10 results above the threshold are shown, ranked by final score.
8. If no providers match the skill filter, the no-match flow runs and the request is posted publicly.

---

## License

MIT
