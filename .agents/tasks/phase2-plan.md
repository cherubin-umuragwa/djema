# Implementation Plan — Phase 2: Provider Auth & Profile

## Codebase notes from exploration

- `src/services/firebase.ts` exports `auth` and `db` — import only from there, never re-initialize.
- `src/store/authStore.ts` uses Zustand; shape is `{user, loading, error, setUser, setLoading, setError, clearError}`.
- `src/hooks/useAuth.ts` is **already complete** — it subscribes `onAuthStateChanged`, updates `authStore`, unsubscribes on unmount, and returns `{user, loading, isAuthenticated, signOut}`. No changes needed except removing the `signOut` export (auth.ts will own that) and fixing the Navbar import (see 2.12).
- `src/components/common/Button.tsx` uses `href` with a plain `<a>` — needs to be fixed to use `Link` from react-router-dom for internal routes.
- `src/components/layout/Navbar.tsx` imports `signOut` directly from `firebase/auth` instead of `@/services/auth.ts` — must be corrected.
- `src/components/common/LocationInput.tsx` currently uses Google Maps/Places (which requires billing). Full replacement with Nominatim is required.
- All four page stubs (`RegisterPage`, `LoginPage`, `DashboardPage`, `EditProfilePage`) are placeholders — full replacements.
- No `firestore.rules` file exists yet — must be created.
- No `src/services/auth.ts`, `src/services/firestore.ts`, `src/types/category.ts`, `src/hooks/useCategories.ts`, `scripts/seedCategories.ts`, `src/utils/geocoding.ts`, `src/components/provider/SkillPicker.tsx`, `src/components/provider/AvailabilityToggle.tsx` exist yet — all new files.
- Build command: `npx tsc --noEmit` then `npx vite build` (from `npm run build` = `tsc -b && vite build`).
- `@/` alias resolves to `src/` via `vite.config.ts`.

---

## Implementation Plan

- [ ] 1. **Create `src/types/category.ts`** — defines the `Category` interface used by Firestore, SkillPicker, and the seed script.
      ```typescript
      export interface Category {
        id: string;
        label: string;
        icon: string;
        isActive: boolean;
        sortOrder: number;
      }
      ```
      Files: `src/types/category.ts`
      Verify: `npx tsc --noEmit` exits 0 (no type errors from the new file).

- [ ] 2. **Create `src/utils/geocoding.ts`** — Nominatim fetch logic used by LocationInput.
      Export one function: `geocodeLocation(query: string): Promise<Array<{display_name: string; lat: string; lon: string}>>`.
      Fetch `https://nominatim.openstreetmap.org/search?q={encodeURIComponent(query)}&format=json&limit=5&countrycodes=ug,ke,tz,rw,et`.
      Set `User-Agent: 'Djema/1.0'` header (Nominatim usage policy requires identification).
      Return parsed JSON array; on network error throw a descriptive `Error('Geocoding failed: …')`.
      Files: `src/utils/geocoding.ts`
      Verify: `npx tsc --noEmit` exits 0.

- [ ] 3. **Create `src/services/auth.ts`** — all Firebase Auth helpers.
      Export four functions — import `auth` only from `@/services/firebase`:
      - `registerWithEmail(email: string, password: string): Promise<UserCredential>`
      - `signInWithEmail(email: string, password: string): Promise<UserCredential>`
      - `signInWithGoogle(): Promise<UserCredential>` — use `GoogleAuthProvider` + `signInWithPopup`
      - `signOut(): Promise<void>`
      No default export. No other imports from `firebase/auth` in any other file.
      Files: `src/services/auth.ts`
      Verify: `npx tsc --noEmit` exits 0.

- [ ] 4. **Create `src/services/firestore.ts`** — all Firestore CRUD helpers.
      Import `db` from `@/services/firebase`. Import `GeoPoint`, `serverTimestamp`, `doc`, `setDoc`, `updateDoc`, `getDoc`, `onSnapshot`, `collection`, `getDocs`, `query`, `where`, `orderBy` from `firebase/firestore`. Import `Provider` from `@/types/provider` and `Category` from `@/types/category`.
      Export these typed functions (no `any`):
      - `createProvider(uid: string, data: Omit<Provider, 'uid'|'createdAt'|'updatedAt'|'skillEmbedding'>): Promise<void>` — uses `setDoc` on `providers/{uid}`, sets `createdAt` and `updatedAt` via `serverTimestamp()`, sets `skillEmbedding: null`.
      - `updateProvider(uid: string, data: Partial<Provider>): Promise<void>` — uses `updateDoc` + merges `updatedAt: serverTimestamp()`.
      - `getProvider(uid: string): Promise<Provider | null>` — uses `getDoc`; returns null if `!snap.exists()`.
      - `subscribeToProvider(uid: string, callback: (p: Provider | null) => void): Unsubscribe` — uses `onSnapshot` on `providers/{uid}`; calls `callback(null)` if doc does not exist.
      - `getCategories(): Promise<Category[]>` — queries `categories` ordered by `sortOrder` ascending, returns typed array.
      - `subscribeToCategories(callback: (cats: Category[]) => void): Unsubscribe` — real-time listener on `categories` collection.
      On any Firestore error, throw a new `Error` with a descriptive message (never silent).
      Files: `src/services/firestore.ts`
      Verify: `npx tsc --noEmit` exits 0.

- [ ] 5. **Create `src/hooks/useCategories.ts`** — real-time categories hook.
      Subscribes to `subscribeToCategories` from `@/services/firestore`. Returns `{categories: Category[], loading: boolean}`. Unsubscribes on unmount.
      Files: `src/hooks/useCategories.ts`
      Verify: `npx tsc --noEmit` exits 0.

- [ ] 6. **Update `src/hooks/useAuth.ts`** — remove the inline `signOut` helper (it should come from `@/services/auth`) so the hook is purely an auth-state subscriber. The hook currently exports `signOut` — remove that export; callers that need `signOut` import from `@/services/auth.ts` directly.
      Current hook already does everything else correctly (onAuthStateChanged subscription, authStore updates, cleanup). No other changes needed.
      Files: `src/hooks/useAuth.ts`
      Verify: `npx tsc --noEmit` exits 0.

- [ ] 7. **Fix `src/components/common/Button.tsx`** — replace the plain `<a href>` fallback with `<Link to={href}>` from `react-router-dom`. This is required because AGENTS.md prohibits `<a href>` for internal navigation.
      The `href` prop currently renders `<a href={href}>` — change to `import { Link } from 'react-router-dom'` and render `<Link to={href} className={classes}>{content}</Link>`. Keep the prop name `href` for backward compat with existing callers.
      Files: `src/components/common/Button.tsx`
      Verify: `npx tsc --noEmit` exits 0.

- [ ] 8. **Replace `src/components/common/LocationInput.tsx`** — Nominatim geocoding, 500ms debounce, dropdown of up to 5 suggestions.
      Props interface:
      ```typescript
      interface LocationInputProps {
        value: string;
        onLocationSelect: (loc: { locationName: string; lat: number; lng: number }) => void;
        error?: string;
        label?: string;
        required?: boolean;
      }
      ```
      Internal state: `inputText` (string), `suggestions` (Nominatim result array), `isOpen` (boolean), `debounceTimer` (NodeJS.Timeout ref).
      On input change: update `inputText`, clear previous timer, set 500ms timer → call `geocodeLocation` from `@/utils/geocoding` → set `suggestions`, set `isOpen: true`.
      On suggestion click: call `onLocationSelect({ locationName: item.display_name, lat: parseFloat(item.lat), lng: parseFloat(item.lon) })`, set `inputText` to `display_name`, close dropdown.
      If no result after search: allow proceeding — on form submit the parent uses lat/lng defaults `(0.3476, 32.5825)` (Kampala center). The `geocoding.ts` util returns empty array on no results; parent's Zod schema has `lat` and `lng` with default 0 values that the page component overrides to Kampala center when still 0.
      `MapPin` icon (size 16) as leading icon inside the input (absolute positioned left-3).
      Dropdown: `bg-white rounded-xl shadow-md border border-slate-100` positioned absolute below input. Each suggestion: `px-4 py-2 font-sans text-sm text-slate-700 hover:bg-slate-50 cursor-pointer`.
      No Google Maps imports anywhere.
      Files: `src/components/common/LocationInput.tsx`, depends on `src/utils/geocoding.ts` (item 2).
      Verify: `npx tsc --noEmit` exits 0.

- [ ] 9. **Create `src/components/provider/SkillPicker.tsx`** — multi-select chip picker.
      Props:
      ```typescript
      interface SkillPickerProps {
        value: string[];
        onChange: (skills: string[]) => void;
        categories: Category[];
        error?: string;
      }
      ```
      Renders a wrapping `div` with `flex flex-wrap gap-2`. Each category renders as a button chip:
      - Selected (`value.includes(cat.id)`): `bg-green-600 text-white rounded-md px-3 py-1.5 font-sans text-sm font-medium`
      - Unselected: `bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md px-3 py-1.5 font-sans text-sm font-medium`
      On chip click: toggle — add if not present AND `value.length < 10`; remove if present.
      Label-only chips (no icons). Show chip label from `cat.label`.
      Error message below if `error` prop is set: `text-red-600 text-sm mt-1.5 flex items-center gap-1.5` + `AlertCircle` (14px).
      Files: `src/components/provider/SkillPicker.tsx`
      Verify: `npx tsc --noEmit` exits 0.

- [ ] 10. **Create `src/components/provider/AvailabilityToggle.tsx`** — custom accessible toggle switch.
       Props:
       ```typescript
       interface AvailabilityToggleProps {
         available: boolean;
         onChange: (value: boolean) => void;
         loading?: boolean;
       }
       ```
       Renders: a `<button role="switch" aria-checked={available}>` containing a track div + thumb div + label text + status icon.
       Track: `w-11 h-6 rounded-full transition-colors duration-150`. `available=true`: `bg-green-600`; `false`: `bg-slate-300`.
       Thumb: `w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-150`. `available=true`: `translate-x-5`; `false`: `translate-x-0.5`. (Use inline `transform` class — only Tailwind translate utilities from the standard scale.)
       Label text: `available=true`: "Available for work" with `CheckCircle2` (size 16, `text-green-600`); `false`: "Not available" with `XCircle` (size 16, `text-slate-400`).
       Loading: show `Loader2 animate-spin` (size 16) in place of status icon; button disabled.
       Keyboard: `onKeyDown` handles `Enter` and ` ` (Space) to call `onChange(!available)`.
       Optimistic UI: the parent calls `onChange` immediately; the toggle reflects `available` prop (controlled).
       Focus ring: `focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`.
       Files: `src/components/provider/AvailabilityToggle.tsx`
       Verify: `npx tsc --noEmit` exits 0.

- [ ] 11. **Fix `src/components/layout/Navbar.tsx`** — three issues to fix:
       1. Replace `import { signOut } from 'firebase/auth'` with `import { signOut } from '@/services/auth'` — the `handleSignOut` function calls it the same way.
       2. Replace `import { auth } from '@/services/firebase'` (used only by the old `signOut` call) — remove this import since `@/services/auth.ts` wraps it internally.
       3. Avatar: the Navbar currently renders an inline `<div>` for the avatar instead of using the `Avatar` component. Replace the avatar button's inner content with `<Avatar name={user.displayName ?? 'Provider'} size="sm" />` imported from `@/components/common/Avatar`.
       No other changes to Navbar structure, classes, or mobile menu.
       Files: `src/components/layout/Navbar.tsx`
       Verify: `npx tsc --noEmit` exits 0.

- [ ] 12. **Replace `src/pages/RegisterPage.tsx`** — two-step registration form using React Hook Form + Zod.
       **Step state:** local `useState<1|2>` + local `useState<string>` for `registeredUid` (set after step 1 Firebase Auth call completes).
       **Step 1 Zod schema:**
       ```typescript
       z.object({
         email: z.string().email('Valid email required'),
         password: z.string().min(8, 'Password must be at least 8 characters'),
         confirmPassword: z.string(),
       }).refine(d => d.password === d.confirmPassword, {
         message: 'Passwords do not match', path: ['confirmPassword'],
       })
       ```
       Step 1 UI: heading `'Create your provider account'` (`font-display text-2xl text-slate-900`), subtext `'Join Djema and start getting work in Kampala.'` (`font-sans text-sm text-slate-600`), email Input, password Input with Eye/EyeOff toggle (controlled `showPassword` state), confirm password Input with same Eye/EyeOff pattern, [Continue] primary Button (loading state while `registerWithEmail` runs), divider (`<hr className="border-slate-200">` with `'or'` in center via flex), [Continue with Google] secondary Button, Link to `/login`: `'Already have an account? Sign in'`.
       On step 1 [Continue] submit: call `registerWithEmail(email, password)` from `@/services/auth` → on success set `step=2`, store `result.user.uid` in `registeredUid`. On error: map `auth/email-already-in-use` → `'An account with this email already exists.'`; `auth/weak-password` → `'Password is too weak.'`; `auth/network-request-failed` → `'Network error. Check your connection.'`; default → error message. Display error as form-level banner: `AlertCircle` (16px) + message in `bg-red-50 text-red-700 rounded-lg px-4 py-3`.
       On [Continue with Google]: call `signInWithGoogle()` → on success set `step=2`, store uid. Same error mapping.
       **Step 2 Zod schema:**
       ```typescript
       z.object({
         displayName: z.string().min(2, 'Name must be at least 2 characters'),
         skills: z.array(z.string()).min(1, 'Select at least one skill'),
         locationName: z.string().min(1, 'Location is required'),
         lat: z.number(),
         lng: z.number(),
         whatsappNumber: z.string().regex(/^\+[1-9]\d{7,14}$/, 'Enter a valid number like +256 700 000 000'),
         bio: z.string().min(10, 'Bio must be at least 10 characters').max(500, 'Bio cannot exceed 500 characters'),
       })
       ```
       Step 2 UI: step indicator `'Step 2 of 2'` right-aligned (`font-sans text-sm text-slate-500`), heading `'Tell us about yourself'` (`font-display text-2xl`), displayName Input, SkillPicker (pass `categories` from `useCategories`), LocationInput (on select update form values for `locationName`/`lat`/`lng`; if lat/lng are still 0 when submitting, use Kampala center `0.3476, 32.5825`), whatsappNumber Input (placeholder `'+256 700 000 000'`), bio Textarea (maxLength 500 with counter), [Complete Registration] primary Button with `Loader2` loading state.
       On step 2 submit: call `createProvider(registeredUid, { displayName, email: auth.currentUser.email ?? '', whatsappNumber, bio, skills, location: new GeoPoint(lat || 0.3476, lng || 32.5825), locationName, available: true, isActive: true })` from `@/services/firestore`; on success: call `useToast` for `'Welcome to Djema! Your profile is live.'`; navigate to `/dashboard`. On error: show form-level banner.
       Layout: `max-w-md mx-auto` single column, `flex flex-col gap-6`, page padded with `pt-16` (navbar clearance) via PageWrapper.
       Files: `src/pages/RegisterPage.tsx`
       Verify: `npx tsc --noEmit` exits 0; form renders without console errors; validation shows on invalid submit.

- [ ] 13. **Replace `src/pages/LoginPage.tsx`** — login form using React Hook Form + Zod.
       Zod schema:
       ```typescript
       z.object({
         email: z.string().email('Valid email required'),
         password: z.string().min(1, 'Password is required'),
       })
       ```
       UI: centered layout `max-w-sm mx-auto`, `flex flex-col gap-6`.
       Heading `'Welcome back'` (`font-display text-2xl text-slate-900`), subtext `'Sign in to browse requests and find work.'` (`font-sans text-sm text-slate-600`), email Input, password Input with Eye/EyeOff toggle, [Sign In] primary Button (loading), divider, [Sign in with Google] secondary Button.
       Link: `'New to Djema? Register as a provider'` → `/register`.
       Form-level error below form: `AlertCircle` (16px) + message in `bg-red-50 text-red-700 rounded-lg px-4 py-3`.
       Error mapping: `auth/invalid-credential` or `auth/wrong-password` or `auth/user-not-found` → `'Incorrect email or password.'`; `auth/network-request-failed` → `'Network error. Check your connection.'`; default → error message.
       On success: `navigate('/dashboard')`.
       Files: `src/pages/LoginPage.tsx`
       Verify: `npx tsc --noEmit` exits 0; login → dashboard redirect works.

- [ ] 14. **Replace `src/pages/DashboardPage.tsx`** — provider dashboard.
       On mount: `getProvider(user.uid)` (one-time read), store in local state `provider: Provider | null`. Loading skeleton while fetching (`animate-pulse` blocks).
       Availability toggle: local `toggling` boolean for optimistic loading state. `handleAvailabilityChange(val: boolean)`: set `toggling=true`, optimistically update local `provider.available`, call `updateProvider(user.uid, { available: val })`, catch error → revert, set `toggling=false`. Calls `AvailabilityToggle` with `available={provider.available}` and `loading={toggling}`.
       Layout:
       - Row: `<Avatar name={provider.displayName} size="lg" />` + `<h1 font-display text-2xl>`Welcome back, {provider.displayName}`</h1>` — flex row with gap-4.
       - Availability row below: `AvailabilityToggle`.
       - `<hr className="border-slate-100 my-6">` divider.
       - Heading `'Open requests matching your skills'` (`font-display text-xl`) + subtext `'Browse the board to find work near you.'` (`font-sans text-sm text-slate-600`) + [Browse Open Requests] primary Button → `/board`.
       - Second divider.
       - Quick links row: [Edit Profile] ghost Button with `Pencil` icon (size 16) → `/profile/edit`; [Sign Out] ghost Button with `LogOut` icon (size 16) → calls `signOut()` from `@/services/auth` then `navigate('/')`.
       Import `useAuth` for `user`; import `getProvider`, `updateProvider` from `@/services/firestore`; import `Avatar` from `@/components/common/Avatar`; import `AvailabilityToggle` from `@/components/provider/AvailabilityToggle`.
       Files: `src/pages/DashboardPage.tsx`
       Verify: `npx tsc --noEmit` exits 0; availability toggle updates Firestore on click.

- [ ] 15. **Replace `src/pages/EditProfilePage.tsx`** — pre-filled profile edit form.
       On mount: `getProvider(user.uid)` — load current data, pre-fill React Hook Form via `reset(values)`.
       Same Zod schema as step 2 of register (item 12).
       Same fields: displayName, SkillPicker, LocationInput, whatsappNumber, bio.
       [Save Changes] primary Button with loading state.
       On submit: call `updateProvider(user.uid, { displayName, skills, location: new GeoPoint(lat || 0.3476, lng || 32.5825), locationName, whatsappNumber, bio })`. On success: toast `'Profile updated.'` and stay on page. On error: form-level error banner.
       Heading `'Edit your profile'` (`font-display text-2xl`).
       Files: `src/pages/EditProfilePage.tsx`
       Verify: `npx tsc --noEmit` exits 0; form pre-fills with provider data; save writes to Firestore.

- [ ] 16. **Create `scripts/seedCategories.ts`** — seeds 16 categories to Firestore using the Firebase CLIENT SDK (not Admin SDK, no Cloud Functions).
       Import `initializeApp` from `firebase/app`, `getFirestore`, `doc`, `setDoc` from `firebase/firestore`.
       Import firebase config directly: `import { firebaseConfig } from '../src/services/firebase'` — so the config object needs to be exported from firebase.ts (add `export const firebaseConfig = { ... }` to that file).
       Alternatively, read the config from `.env.local` values via `process.env` — but since this is a Vite project, use `dotenv` approach or hard-code the config object. **Decision:** export `firebaseConfig` from `src/services/firebase.ts` and import it here. This avoids duplicating values.
       Seed data (all `isActive: true`):
       ```
       plumber / Plumber / Wrench / 1
       electrician / Electrician / Zap / 2
       carpenter / Carpenter / Hammer / 3
       painter / Painter / Paintbrush / 4
       cleaner / Cleaner House Help / Sparkles / 5
       mechanic / Mechanic / Settings / 6
       tailor / Tailor Seamstress / Scissors / 7
       mason / Mason Builder / HardHat / 8
       welder / Welder / Flame / 9
       driver / Driver Boda Boda / Car / 10
       gardener / Gardener / Leaf / 11
       it_technician / IT Computer Repair / Monitor / 12
       beautician / Beautician Hairdresser / Smile / 13
       tutor / Tutor Teacher / BookOpen / 14
       photographer / Photographer / Camera / 15
       other / Other / Star / 16
       ```
       Uses `setDoc` with the category ID as document ID, `{ merge: true }` to be idempotent.
       Run with: `npx tsx scripts/seedCategories.ts` (tsx is available as it can be run with node).
       Note: Since the project uses `"type": "module"` and Vite env vars (`import.meta.env`) are not available in Node scripts, the seed script must either inline the firebase config values or read from a `.env.local` via `dotenv`. **Decision:** inline the config object in the seed script (not a secret — this is the client-side public config). Add a comment explaining why.
       Files: `scripts/seedCategories.ts`, `src/services/firebase.ts` (add `export const firebaseConfig`)
       Verify: `npx tsx scripts/seedCategories.ts` runs without errors; 16 documents appear in Firestore `categories` collection.

- [ ] 17. **Create `firestore.rules`** — complete Firestore security rules.
       ```
       rules_version = '2';
       service cloud.firestore {
         match /databases/{database}/documents {

           function isAuth() { return request.auth != null; }
           function isOwner(uid) { return isAuth() && request.auth.uid == uid; }
           function isAdmin() { return isAuth() && request.auth.token.role == 'admin'; }

           match /categories/{catId} {
             allow read: if true;
             allow write: if isAdmin();
           }

           match /providers/{uid} {
             allow read: if true;
             allow create: if isOwner(uid);
             allow update: if isOwner(uid);
             allow delete: if isOwner(uid);
           }

           match /requests/{requestId} {
             allow read: if true;
             allow create: if true;
             allow update: if
               request.resource.data.diff(resource.data).affectedKeys()
                 .hasOnly(['isPublic', 'requesterWhatsapp', 'requesterEmail', 'status', 'updatedAt']);
             allow delete: if false;
           }

           match /matches/{requestId} {
             allow read: if isAuth();
             allow write: if isAuth();
           }
         }
       }
       ```
       Note on `matches` write: since Cloud Functions are not used, the client writes match results after running TF.js. Setting `write: if isAuth()` is appropriate for this phase. The `requests` update rule restricts which fields can be changed from the client.
       Files: `firestore.rules`
       Verify: `npx firebase-tools` is not required here — the rules file is syntactically valid and will be deployed in Phase 7. Confirm `npx vite build` still exits 0.

- [ ] 18. **Final verification and commit** — compile check, build check, then commit.
       Run in order:
       1. `cd 'c:\Users\CHERUBIN\Documents\CHAM\CHAM HACKATHON\Djema' && npx tsc --noEmit`
       2. `cd 'c:\Users\CHERUBIN\Documents\CHAM\CHAM HACKATHON\Djema' && npx vite build`
       3. Fix any TypeScript or build errors discovered in steps 1–2 before proceeding.
       4. `git -C 'c:\Users\CHERUBIN\Documents\CHAM\CHAM HACKATHON\Djema' add src/types/category.ts src/utils/geocoding.ts src/services/auth.ts src/services/firestore.ts src/hooks/useAuth.ts src/hooks/useCategories.ts src/components/common/Button.tsx src/components/common/LocationInput.tsx src/components/provider/SkillPicker.tsx src/components/provider/AvailabilityToggle.tsx src/components/layout/Navbar.tsx src/pages/RegisterPage.tsx src/pages/LoginPage.tsx src/pages/DashboardPage.tsx src/pages/EditProfilePage.tsx scripts/seedCategories.ts firestore.rules`
       5. `git -C 'c:\Users\CHERUBIN\Documents\CHAM\CHAM HACKATHON\Djema' commit -m 'feat(phase-2): provider auth, registration, login, dashboard, availability toggle'`
       6. `git -C 'c:\Users\CHERUBIN\Documents\CHAM\CHAM HACKATHON\Djema' push origin main`
       Verify: `npx vite build` exits 0 with no TypeScript errors and no console errors in the built output.

---

## Hard rules checklist (apply to every file)

- No emojis anywhere — Lucide icons only
- No Firebase Storage imports (`getStorage`, `firebase/storage`)
- No Google Maps API — Nominatim only
- No inline styles — Tailwind only
- `font-display` on all h1–h3; `font-sans` on all other text
- Cards: `bg-white rounded-2xl shadow-sm` — NO border on containers
- Buttons: `rounded-lg` always
- No arbitrary spacing
- No dark backgrounds (white or `bg-slate-100` only)
- No `any` types — use `unknown` and narrow
- Import `Avatar` from `@/components/common/Avatar`
- Import `auth`, `db` from `@/services/firebase` only
- All Firestore access through `@/services/firestore.ts` or hooks only
- React Hook Form + Zod for all forms
- Internal navigation via `Link` from react-router-dom or `navigate()` — no plain `<a href>`
