# DATABASE.md — Database Schema Document
## Djema: Informal Skills & Services Marketplace

> **Database:** Cloud Firestore (NoSQL, document-based)
> All timestamps are stored as Firestore `Timestamp` objects (UTC). All IDs are auto-generated Firestore document IDs unless noted otherwise.

---

## 1. Overview of Collections

```
firestore/
├── providers/          # Registered service providers (workers)
├── requests/           # Service requests posted by clients
├── matches/            # AI match results linked to a request
└── categories/         # Master list of service categories
```

---

## 2. Collection: `providers`

**Purpose:** Stores profiles of registered service providers (workers). One document per provider, document ID = Firebase Auth UID.

### 2.1 Document Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `uid` | `string` | ✅ | Firebase Auth UID — same as document ID |
| `displayName` | `string` | ✅ | Provider's public name (min 2, max 60 chars) |
| `email` | `string` | ✅ | Email address (validated format) |
| `whatsappNumber` | `string` | ✅ | WhatsApp number in E.164 format (e.g. `+256700000000`) |
| `bio` | `string` | ✅ | Short description of skills and experience (max 500 chars) |
| `skills` | `string[]` | ✅ | Array of skill/service category IDs (e.g. `["plumber", "tiler"]`) — min 1, max 10 |
| `location` | `GeoPoint` | ✅ | Firestore GeoPoint `{ latitude, longitude }` |
| `locationName` | `string` | ✅ | Human-readable location (e.g. `"Ntinda, Kampala"`) |
| `profilePhotoUrl` | `string` | ❌ | Firebase Storage download URL for profile photo |
| `available` | `boolean` | ✅ | Whether the provider is currently taking work (default: `true`) |
| `isActive` | `boolean` | ✅ | Account active/deactivated flag (default: `true`) |
| `skillEmbedding` | `number[]` | ❌ | Vertex AI embedding vector for `bio + skills` text (set by Cloud Function after profile save) |
| `createdAt` | `Timestamp` | ✅ | Account creation timestamp |
| `updatedAt` | `Timestamp` | ✅ | Last profile update timestamp |

### 2.2 Example Document

```json
{
  "uid": "abc123firebaseuid",
  "displayName": "John Mukasa",
  "email": "john@example.com",
  "whatsappNumber": "+256700123456",
  "bio": "Certified electrician with 5 years experience. I handle wiring, installations, and repairs.",
  "skills": ["electrician", "solar_installer"],
  "location": { "latitude": 0.3476, "longitude": 32.5825 },
  "locationName": "Ntinda, Kampala",
  "profilePhotoUrl": "https://storage.googleapis.com/djema-prod/providers/abc123/photo.jpg",
  "available": true,
  "isActive": true,
  "skillEmbedding": [0.023, -0.145, ...],
  "createdAt": "2026-10-27T08:00:00Z",
  "updatedAt": "2026-10-27T08:00:00Z"
}
```

### 2.3 Indexes

| Index | Type | Purpose |
|-------|------|---------|
| `skills` (array-contains) + `available` | Composite | Filter active providers by skill during matching |
| `available` + `isActive` | Composite | Fetch all currently available active providers |
| `locationName` | Single | Browse/filter by city or neighborhood |

### 2.4 Validation Rules

- `displayName`: non-empty, max 60 characters.
- `email`: valid email format, must match Firebase Auth email.
- `whatsappNumber`: must match E.164 regex `^\+[1-9]\d{7,14}$`.
- `skills`: array, 1–10 items, each item must exist in `categories` collection.
- `bio`: max 500 characters.
- `location`: valid GeoPoint (lat −90 to 90, lng −180 to 180).

### 2.5 Access Control

| Operation | Who |
|-----------|-----|
| Read | Public (anyone) |
| Create | Authenticated user, `uid` must match Auth UID |
| Update | Authenticated user, `uid` must match document ID |
| Delete | Authenticated user (own document) or admin |

---

## 3. Collection: `requests`

**Purpose:** Stores service requests posted by clients (guest or authenticated). One document per request.

### 3.1 Document Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | Auto-generated Firestore document ID |
| `sessionToken` | `string` | ✅ | UUID generated client-side, stored in requester's `localStorage`. Used to authenticate guest access to their own request and matches |
| `serviceType` | `string` | ✅ | Category ID from `categories` collection (e.g. `"plumber"`) |
| `description` | `string` | ✅ | Free-text description of the problem/task (max 1000 chars) |
| `location` | `GeoPoint` | ✅ | Requester's location |
| `locationName` | `string` | ✅ | Human-readable location (e.g. `"Bwaise, Kampala"`) |
| `estimatedHours` | `number` | ✅ | Estimated job duration in hours (min 0.5, max 72) |
| `photoUrl` | `string` | ❌ | Firebase Storage URL of optional uploaded photo |
| `status` | `string` | ✅ | Enum: `"pending"` → `"matched"` → `"open"` → `"fulfilled"` → `"expired"` |
| `isPublic` | `boolean` | ✅ | `true` when published to the Open Board (default: `false`) |
| `requesterWhatsapp` | `string` | ❌ | Requester's WhatsApp number (E.164). Set when `isPublic = true` |
| `requesterEmail` | `string` | ❌ | Requester's email. Set when `isPublic = true` |
| `descriptionEmbedding` | `number[]` | ❌ | Vertex AI embedding of `description + serviceType` (set by Cloud Function) |
| `matchCount` | `number` | ✅ | Number of AI matches found (default: `0`) |
| `createdAt` | `Timestamp` | ✅ | Request creation timestamp |
| `updatedAt` | `Timestamp` | ✅ | Last update timestamp |
| `expiresAt` | `Timestamp` | ✅ | Auto-set to `createdAt + 30 days` |

### 3.2 Status State Machine

```
[pending]
    │  Cloud Function runs matching
    ▼
[matched] ──── matches found ────► Client views results
    │
    │  no matches found + client submits contact info
    ▼
[open] ──────── on Open Board ───► Providers can contact
    │
    │  provider marks fulfilled (future) OR admin closes
    ▼
[fulfilled]

[pending / matched / open]
    │  30 days pass (scheduled function)
    ▼
[expired]
```

### 3.3 Example Document

```json
{
  "id": "req_xyz789",
  "sessionToken": "550e8400-e29b-41d4-a716-446655440000",
  "serviceType": "plumber",
  "description": "My kitchen sink pipe is leaking. Water is dripping under the cabinet.",
  "location": { "latitude": 0.3210, "longitude": 32.5713 },
  "locationName": "Bwaise, Kampala",
  "estimatedHours": 2,
  "photoUrl": "https://storage.googleapis.com/djema-prod/requests/req_xyz789/photo.jpg",
  "status": "open",
  "isPublic": true,
  "requesterWhatsapp": "+256701234567",
  "requesterEmail": "client@example.com",
  "descriptionEmbedding": [0.091, -0.032, ...],
  "matchCount": 0,
  "createdAt": "2026-10-27T09:00:00Z",
  "updatedAt": "2026-10-27T09:05:00Z",
  "expiresAt": "2026-11-26T09:00:00Z"
}
```

### 3.4 Indexes

| Index | Type | Purpose |
|-------|------|---------|
| `isPublic` + `status` + `createdAt` (desc) | Composite | Fetch Open Board (public, open, newest first) |
| `serviceType` + `isPublic` + `status` | Composite | Filter Open Board by service type |
| `expiresAt` | Single | Scheduled expiry function queries expired requests |
| `status` | Single | Admin dashboard filtering |

### 3.5 Validation Rules

- `serviceType`: must be a valid category ID.
- `description`: non-empty, max 1000 characters.
- `estimatedHours`: number, 0.5–72.
- `requesterWhatsapp`: E.164 format (when provided).
- `requesterEmail`: valid email format (when provided).
- `status`: must be one of `pending`, `matched`, `open`, `fulfilled`, `expired`.

### 3.6 Access Control

| Operation | Who |
|-----------|-----|
| Read (public fields) | Public |
| Read (`requesterWhatsapp`, `requesterEmail`) | Authenticated providers only |
| Create | Anyone (no auth required) |
| Update (`isPublic`, `requesterWhatsapp`, `requesterEmail`) | Request owner (matching `sessionToken`) |
| Update (`status`) | Cloud Functions (service account) or admin |
| Delete | Admin only |

> **Privacy note:** `requesterWhatsapp` and `requesterEmail` are stored in the document but Firestore security rules only allow authenticated providers to read those fields. Guest clients cannot read other requests' contact info.

---

## 4. Collection: `matches`

**Purpose:** Stores AI matching results for a given request. One document per request (document ID = request ID).

### 4.1 Document Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `requestId` | `string` | ✅ | Matches the `requests` document ID |
| `status` | `string` | ✅ | Enum: `"processing"` → `"completed"` → `"no_matches"` |
| `results` | `MatchResult[]` | ✅ | Array of matched providers (empty if no matches) |
| `processedAt` | `Timestamp` | ❌ | When the matching function completed |
| `createdAt` | `Timestamp` | ✅ | When the match document was first created |

### 4.2 `MatchResult` Sub-document Schema

| Field | Type | Description |
|-------|------|-------------|
| `providerId` | `string` | Firebase Auth UID of the matched provider |
| `displayName` | `string` | Provider's display name (denormalized for display speed) |
| `profilePhotoUrl` | `string \| null` | Provider's photo URL |
| `locationName` | `string` | Provider's location (denormalized) |
| `skills` | `string[]` | Provider's skill list (denormalized) |
| `whatsappNumber` | `string` | Provider's WhatsApp number |
| `email` | `string` | Provider's email |
| `skillScore` | `number` | Cosine similarity score (0–1) |
| `proximityScore` | `number` | Proximity score (0–1, 1 = same location) |
| `finalScore` | `number` | Weighted final score (0–1) |
| `distanceKm` | `number` | Approximate distance from requester in km |

### 4.3 Example Document

```json
{
  "requestId": "req_xyz789",
  "status": "completed",
  "results": [
    {
      "providerId": "abc123firebaseuid",
      "displayName": "John Mukasa",
      "profilePhotoUrl": "https://storage.googleapis.com/.../photo.jpg",
      "locationName": "Ntinda, Kampala",
      "skills": ["electrician", "solar_installer"],
      "whatsappNumber": "+256700123456",
      "email": "john@example.com",
      "skillScore": 0.87,
      "proximityScore": 0.72,
      "finalScore": 0.81,
      "distanceKm": 3.2
    }
  ],
  "processedAt": "2026-10-27T09:00:05Z",
  "createdAt": "2026-10-27T09:00:00Z"
}
```

### 4.4 Access Control

| Operation | Who |
|-----------|-----|
| Read | Authenticated providers OR requester with matching `sessionToken` |
| Create / Update | Cloud Functions (service account) only |
| Delete | Admin only |

---

## 5. Collection: `categories`

**Purpose:** Master list of service categories available on the platform. Seeded at deployment.

### 5.1 Document Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | Slug ID used across the app (e.g. `"plumber"`) — same as document ID |
| `label` | `string` | ✅ | Display name (e.g. `"Plumber"`) |
| `labelFr` | `string` | ❌ | French label for future i18n (e.g. `"Plombier"`) |
| `icon` | `string` | ❌ | Icon name/emoji for UI display |
| `isActive` | `boolean` | ✅ | Whether this category is visible in the UI |
| `sortOrder` | `number` | ✅ | Display order in category picker |

### 5.2 Seed Data (Initial Categories)

| ID | Label | Icon |
|----|-------|------|
| `plumber` | Plumber | 🔧 |
| `electrician` | Electrician | ⚡ |
| `carpenter` | Carpenter | 🪵 |
| `painter` | Painter | 🖌️ |
| `cleaner` | Cleaner / House Help | 🧹 |
| `mechanic` | Mechanic | 🔩 |
| `tailor` | Tailor / Seamstress | 🧵 |
| `mason` | Mason / Builder | 🧱 |
| `welder` | Welder | 🔥 |
| `driver` | Driver / Boda Boda | 🏍️ |
| `gardener` | Gardener | 🌿 |
| `it_technician` | IT / Computer Repair | 💻 |
| `beautician` | Beautician / Hairdresser | 💇 |
| `tutor` | Tutor / Teacher | 📚 |
| `photographer` | Photographer | 📷 |
| `other` | Other | ⭐ |

### 5.3 Access Control

| Operation | Who |
|-----------|-----|
| Read | Public |
| Write | Admin only |

---

## 6. Entity Relationships

```
categories (1) ──────────────────────── (N) providers.skills[]
categories (1) ──────────────────────── (N) requests.serviceType

providers (1) ──────── (N) matches.results[].providerId
requests  (1) ──────── (1) matches  (document ID = requestId)
```

---

## 7. Data Retention & Deletion Policy

| Collection | Retention | Policy |
|------------|-----------|--------|
| `providers` | Indefinite (while account active) | Provider can delete own account → document soft-deleted (`isActive: false`), hard-deleted after 90 days |
| `requests` | 30 days active, then expired | `expireOldRequests` Cloud Function sets `status: "expired"`. Hard delete after 90 days (future cleanup job) |
| `matches` | Same lifecycle as parent `request` | Deleted when parent request is hard-deleted |
| `categories` | Indefinite | Admin-managed |

---

## 8. Migration Strategy

Since Firestore is schemaless, there is no traditional migration file. Schema evolution follows this approach:

1. **Additive changes** (new optional fields): add the field to new documents; existing documents return `undefined` — code handles gracefully with default values.
2. **Breaking changes** (renaming/removing fields): write a one-time Cloud Function migration script that reads all affected documents in batches and rewrites them with the new schema. Run in staging first, then production.
3. **Version tracking**: a `_meta/schemaVersion` document in Firestore tracks the current schema version.

```
_meta/
└── schemaVersion   { version: 1, updatedAt: Timestamp }
```

---

## 9. Firestore Security Rules (Full)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ── Helpers ──────────────────────────────────────────────
    function isAuth() {
      return request.auth != null;
    }
    function isOwner(uid) {
      return isAuth() && request.auth.uid == uid;
    }
    function isAdmin() {
      return isAuth() && request.auth.token.role == 'admin';
    }

    // ── categories ───────────────────────────────────────────
    match /categories/{catId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // ── providers ────────────────────────────────────────────
    match /providers/{uid} {
      allow read: if true;
      allow create: if isOwner(uid);
      allow update: if isOwner(uid) || isAdmin();
      allow delete: if isOwner(uid) || isAdmin();
    }

    // ── requests ─────────────────────────────────────────────
    match /requests/{requestId} {
      allow read: if true;
      allow create: if true; // guests can post
      allow update: if isAdmin(); // status updates via Cloud Functions
      allow delete: if isAdmin();
    }

    // ── matches ──────────────────────────────────────────────
    match /matches/{requestId} {
      allow read: if isAuth(); // authenticated providers
      allow write: if false;   // Cloud Functions only (service account bypasses rules)
    }

    // ── schema meta ──────────────────────────────────────────
    match /_meta/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

> **Note on guest match reading:** The client reads `matches/{requestId}` using a session token for identity. Since Firestore rules cannot validate `localStorage` tokens server-side without a Cloud Function, the match document is readable by any authenticated user OR we scope it via a callable Cloud Function that validates the session token before returning results. This will be refined in the implementation phase.
