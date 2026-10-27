# PRD.md — Product Requirements Document
## Djema: Informal Skills & Services Marketplace

> **Context:** Built for the PreDevFest Hackathon — Kampala, Uganda.
> Judging criteria addressed: SDG Impact (30pts) · Google Tools (25pts) · Technical Execution (20pts) · Feasibility & Scale (15pts) · Pitch (10pts)

---

## 1. Product Overview

**Djema** (Swahili — meaning *informal jobs*, widely used in Goma, DRC) is a web-based platform that connects people who need informal services (plumbing, electrical work, carpentry, cleaning, tailoring, etc.) with skilled individuals available to provide those services nearby.

The platform is deliberately **informal and low-barrier**: no bank cards, no formal CVs, no bidding wars. Just a fast, accessible way for talented people to find work and for households or small businesses to find someone who can help them — today, locally.

**Primary market:** Kampala, Uganda.
**Expansion target:** East Africa at large.
**Platform language:** English.

---

## 2. SDG Alignment — SDG 8: Decent Work and Economic Growth

Djema directly addresses **SDG 8** by:

- Creating economic opportunities for informal workers in Kampala who are excluded from formal job platforms.
- Reducing unemployment and underemployment in the informal sector.
- Enabling small-scale entrepreneurs and service providers to grow a client base without formal financial infrastructure.
- Connecting talent with demand in a city where the informal economy accounts for the majority of livelihoods.

**The real user:** A plumber in Kampala's Bwaise neighborhood who has the skills but no way to advertise them beyond word of mouth. A mother in Ntinda who needs a carpenter but doesn't know how to find one she can trust. Djema bridges that gap.

---

## 3. Problem Statement

In Kampala, Uganda, and across East Africa:

- Millions of skilled workers (plumbers, electricians, mechanics, cleaners, tailors, boda boda riders, etc.) have no formal employment and no accessible digital channel to market their skills.
- Existing platforms (LinkedIn, Upwork, Fiverr) require formal credentials, bank accounts, credit cards, and strong internet literacy — barriers most informal workers cannot meet.
- People who need services rely entirely on word of mouth, which is slow, unreliable, and limited in reach.
- The informal economy is large and active, but **poorly connected**.

**Djema solves the connection problem** without requiring formal financial infrastructure, professional credentials, or technical sophistication.

---

## 4. Target Users

### 4.1 Service Requesters (Clients)
- Individuals, households, and small businesses who need a service done.
- Can post a request **without creating an account** (low friction).
- Located in Kampala and surroundings (expandable to all of East Africa).
- Primary contact channels: WhatsApp and email.

### 4.2 Service Providers (Workers)
- Individuals with informal or semi-formal skills seeking work.
- Must register an account with a profile describing skills, location, and contact details.
- No formal credentials required — self-declared skills.
- Primary contact channels: WhatsApp and email.

---

## 5. Core User Journeys

### 5.1 Service Requester Journey

1. Arrives on the platform — **no login required**.
2. Fills out a **Request Form**:
   - Service type (e.g., plumber, electrician, painter, cleaner).
   - Description of the problem or task.
   - Location (city, neighborhood, or area — e.g., "Ntinda, Kampala").
   - Estimated duration in hours.
   - Optional: photo of the issue.
3. The **AI matching algorithm** (powered by Google Cloud / Vertex AI) scans registered providers and surfaces potential matches based on:
   - Skill match.
   - Geographic proximity.
   - Provider availability (if declared).
4. **Two outcomes:**
   - **Matches found:** A list of matched providers is displayed. The requester can contact any of them via a WhatsApp deep-link button or email.
   - **No matches found:** The requester is prompted to enter their WhatsApp number and/or email. Their request is **published on the Open Requests Board**.
5. Once published, logged-in providers browsing the board can:
   - Click **"Contact on WhatsApp"** — opens WhatsApp with a pre-filled message: *"Hi, I saw your request for [service] on Djema and I can help! Can we talk?"*
   - Send an email directly.

### 5.2 Service Provider Journey

1. Registers an account (email/password or Google Sign-In via Firebase Auth).
2. Builds a **Provider Profile**:
   - Display name.
   - Skills / service categories (multi-select).
   - Location (city and neighborhood in Uganda/East Africa).
   - Short bio.
   - WhatsApp number.
   - Email address.
   - Optional: profile photo (stored in Firebase Storage).
3. Once registered, the provider:
   - Is indexed and eligible for AI matching.
   - Can browse the **Open Requests Board** and filter by service type or location.
   - Can contact requesters directly via WhatsApp or email.
4. Provider can update their profile, toggle availability, and deactivate their account.

---

## 6. Key Features

| # | Feature | Priority |
|---|---------|----------|
| 1 | Service request form — no login required | Must Have |
| 2 | AI-powered provider matching (skill + location) | Must Have |
| 3 | Matched provider listing with contact buttons | Must Have |
| 4 | WhatsApp deep-link contact button | Must Have |
| 5 | Email contact option | Must Have |
| 6 | Open Requests Board (unmatched/unfulfilled requests) | Must Have |
| 7 | Service provider registration & profile (Firebase Auth) | Must Have |
| 8 | Provider browsing & filtering of open requests | Must Have |
| 9 | Photo upload on requests (Firebase Storage) | Should Have |
| 10 | Provider profile photo (Firebase Storage) | Should Have |
| 11 | Provider availability toggle | Should Have |
| 12 | Request expiry / auto-archiving | Should Have |
| 13 | Search & filter on open requests board | Should Have |
| 14 | Google Sign-In (Firebase Auth) | Should Have |
| 15 | Admin dashboard (moderation) | Nice to Have |
| 16 | Review / rating system (post-job) | Nice to Have |
| 17 | SMS / push notification fallback | Nice to Have |
| 18 | Progressive Web App (PWA) installability | Nice to Have |

---

## 7. Google Tools Usage (Judging Criterion — 25pts)

The following Google technologies are used **meaningfully**, not as name-drops:

| Google Tool | How it is used |
|-------------|---------------|
| **Firebase Authentication** | Provider account registration, login, Google Sign-In |
| **Cloud Firestore** | Primary database — stores providers, requests, matches |
| **Firebase Storage** | Photo uploads for requests and provider profiles |
| **Google Cloud / Vertex AI** | AI matching algorithm — semantic skill matching + geospatial proximity scoring |
| **Google Maps / Places API** | Location autocomplete for Kampala neighborhoods; map display of nearby providers |
| **Firebase Hosting** | Deployment of the web application |
| **Google Analytics (Firebase)** | Usage tracking — match rates, WhatsApp button clicks, DAU |

---

## 8. Non-Functional Requirements

### 8.1 Accessibility & Inclusivity
- UI must be usable on **low-end Android devices** with Chrome.
- Must perform acceptably on **2G/3G connections** — lightweight pages, lazy-loaded images.
- Forms must be simple: minimal required fields, clear and friendly error messages.
- English as the primary language; French as secondary (for DRC/Rwanda expansion).

### 8.2 Performance
- AI matching must return results in under **3 seconds**.
- Page initial load under **4 seconds** on a 3G connection.
- Images compressed and served via Firebase Storage CDN.

### 8.3 Security & Privacy
- WhatsApp numbers and emails of requesters are only visible to **logged-in providers**.
- Providers' contact details are surfaced only in the context of a match or an active outreach.
- No financial transactions on the platform (v1).
- Input validation on all forms; Firestore security rules enforce access control.

### 8.4 Availability
- Target uptime: **99%** (Firebase Hosting + Firestore SLA-backed).

---

## 9. Feasibility & Scale (Judging Criterion — 15pts)

- **Firebase** provides a serverless, auto-scaling backend — zero infrastructure management, costs scale with usage (free tier covers hackathon and early growth).
- **Firestore** handles geospatial queries natively and scales to millions of documents.
- **Vertex AI** matching can be replaced with a lighter embedding + similarity model as volume grows, keeping costs low.
- The platform is web-first (no app store approval needed) with PWA installability — **anyone with a browser can use it**.
- Expansion beyond Kampala requires only adding new location data — no architectural changes.
- Revenue model (post-hackathon): freemium for providers (free basic profile, paid visibility boost) or small transaction fee once payments are integrated.

---

## 10. Out of Scope (v1)

- In-platform payments or escrow.
- Job contracts or formal agreements.
- Identity verification (KYC).
- Rating/review system (planned for v2).
- Native mobile apps (PWA strategy for v1).
- Video uploads.
- Real-time in-platform chat (WhatsApp handles communication).

---

## 11. Success Metrics

| Metric | Target (3 months post-launch) |
|--------|-------------------------------|
| Registered service providers | 500+ |
| Service requests posted | 1,000+ |
| AI match success rate | 60%+ of requests |
| WhatsApp contact button clicks | 300+ |
| Daily Active Users | 100+ |

---

## 12. Hackathon Demo Plan (Pitch — 10pts)

The 3-minute pitch story:
1. **Problem (30s):** A skilled plumber in Kampala has no way to find clients beyond word of mouth. A family in Ntinda needs a plumber but doesn't know where to look.
2. **Solution (30s):** Djema — type what you need, where you are, and our AI finds someone nearby who can help. No account needed, no bank card, no barriers.
3. **Demo (90s):** Live walk-through — post a request → AI surfaces providers → click WhatsApp → provider sees open board → contacts requester.
4. **Impact & Next Steps (30s):** SDG 8 impact story, Google tools used, and the roadmap to expand across East Africa.

---

## 13. Assumptions & Constraints

- Users have access to WhatsApp (dominant messaging app in Uganda and East Africa).
- The platform is web-first — no app store friction.
- Internet connectivity may be limited — the platform must be lightweight.
- No payment processing in v1; financial transactions happen off-platform.
- Primary geography: Kampala, Uganda. Expandable to East Africa.
- Language: English-first.

---

## 14. Glossary

| Term | Definition |
|------|-----------|
| Djema | Swahili word meaning informal jobs, used across East Africa |
| Service Requester / Client | A person who needs a service done |
| Service Provider / Worker | A skilled individual offering their services |
| AI Match | The algorithm that pairs a request with suitable nearby providers |
| Open Requests Board | Public feed of unmatched/unfulfilled requests visible to providers |
| WhatsApp Deep Link | A URL (`https://wa.me/...`) that opens WhatsApp with a pre-filled message |
