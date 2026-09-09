# Complete Study — Website + Admin Panel

Marketing website and certificate management system for **Complete Study** (Ranchi, Jharkhand) — a computer training & academic coaching academy.

- **Public site** (`/`) — courses, gallery, seat booking, mentors, reviews, FAQ, and a **Verify & Download Certificate** section for students.
- **Admin panel** (`/admin`) — staff log in and upload student certificates (PDF or image), which are then instantly verifiable by students using their enrollment number.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite 6 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Icons / Animation | lucide-react, motion |
| Routing | react-router-dom (SPA, `vercel.json` rewrites) |
| Database | Firebase Firestore (certificate records) |
| File storage | Cloudinary (PDF/image uploads via unsigned preset) |
| Hosting | Vercel |

## Run Locally

```bash
npm install
npm run dev                  # http://localhost:3000
```

(The public config in `.env` is committed, so no setup is needed. For local overrides use `.env.local`.)

## Configuration

All configuration lives in environment variables. The shared, **public-by-design** values (Firebase web config, Cloudinary cloud name + unsigned preset name) are committed in [`.env`](./.env) — Vercel deploys work with **zero environment-variable setup**. Local overrides/secrets go in `.env.local` (git-ignored).

### Current backend status (last checked 2026-09-09 via the *Backend setup & checks* workflow)

| Item | Status |
|---|---|
| Firebase project (`completestudy-53623`) | ✅ Configured |
| Firestore database | ✅ Exists; public reads + writes confirmed working |
| Firestore security rules | ⚠️ Database is in **test mode** (open access) — publish the rules from [`firestore.rules`](./firestore.rules) (see below). The app keeps working identically, but writes become schema-validated and access stays permanent (test mode expires). |
| Cloudinary cloud (`h8x01q58`) | ✅ Configured |
| Cloudinary unsigned upload preset (`completestudy-certificates`) | ⚠️ Pending — one small step, see below |

### 1. Firebase (Firestore — certificate data)

Already configured. Console steps still needed:

1. **Publish the security rules** (recommended soon — the database is currently in test mode):
   - Firebase Console → Build → **Firestore Database** → **Rules** tab
   - Replace everything with the contents of [`firestore.rules`](./firestore.rules)
   - Click **Publish**
2. Optional: add `VITE_FIREBASE_APP_ID` to `.env` (only needed for Firebase Analytics — not required for this app).

**Data model** — collection `certificates`, one document per certificate:

| Field | Type | Description |
|---|---|---|
| `studentName` | string | Student's full name |
| `enrollmentNumber` | string | Unique, normalized (trimmed, uppercase) |
| `certificateUrl` | string | Cloudinary URL of the uploaded file |
| `certificatePublicId` | string | Cloudinary public_id (reference) |
| `fileType` | `'pdf' \| 'image'` | Used to render the certificate correctly |
| `fileFormat` | string | e.g. `pdf`, `png`, `jpg` |
| `fileName` | string | Original uploaded file name |
| `fileSizeBytes` | number | File size |
| `uploadedAt` | timestamp | `serverTimestamp()` |

### 2. Cloudinary (PDF/image file storage)

The cloud name is already configured. The only remaining step is the **unsigned upload preset** `completestudy-certificates` — pick ONE of these:

**Option A — automatic (recommended):**
1. This repo → **Settings → Secrets and variables → Actions → New repository secret** (twice):
   - Name: `CLOUDINARY_API_KEY` — value: your Cloudinary API Key
   - Name: `CLOUDINARY_API_SECRET` — value: your Cloudinary API Secret
2. Re-run the **Backend setup & checks** workflow (Actions tab → select the workflow → Run workflow, after it is on the `main` branch) — or push any change to `.env`/the workflow. The preset is created automatically (unsigned, formats pdf/jpg/jpeg/png/webp, folder `certificates`).

**Option B — manual (2 minutes):**
1. [Cloudinary Console](https://console.cloudinary.com) → **Settings → Upload → Add upload preset**
2. Name: `completestudy-certificates`
3. **Signing mode:** `Unsigned`
4. Allowed formats: `pdf, jpg, jpeg, png, webp` (recommended)
5. Save.

Uploads go directly from the browser to Cloudinary's upload API using the unsigned preset, so **no secret API key is ever exposed** in the frontend. Deleting a record in the admin panel removes it from Firestore; the underlying Cloudinary file remains in your Cloudinary media library (removing it requires the API secret, which must never live in the browser).

### 3. Admin login (file-based, as requested by the project owner)

- URL: `/admin` (login screen at `/admin/login`)
- Default credentials: **`test@gmail.com` / `test@123`**
- Defined in [`src/lib/adminAuth.ts`](./src/lib/adminAuth.ts); override with `VITE_ADMIN_EMAIL` / `VITE_ADMIN_PASSWORD` without touching code.

> ⚠️ Note: this login is a convenience gate for the admin UI, not server-side security — anyone can read the credentials from the JavaScript bundle. Data integrity is protected by the Firestore rules (schema-validated writes) and the restricted upload preset. For stronger protection, enable Firebase Authentication and restrict Firestore writes to the admin account.

## Deploying to Vercel

1. Push this repository to GitHub.
2. In Vercel: **Add New → Project → Import** the repo. Vite is auto-detected (build `npm run build`, output `dist`).
3. Add all `VITE_*` environment variables in **Settings → Environment Variables**.
4. Deploy. [`vercel.json`](./vercel.json) rewrites all paths to `index.html`, so routes like `/admin` and `/admin/login` work on direct visit and refresh.

## Local Firestore emulator (optional)

`firebase.json` is set up for the Firestore emulator:

```bash
npx firebase-tools emulators:start --only firestore --project demo-completestudy
# in another terminal, with the emulator env var:
VITE_FIREBASE_EMULATOR_HOST=127.0.0.1:8080 npm run dev
```

(Requires Java.) Use any non-placeholder `VITE_FIREBASE_*` values in `.env.local` while testing.

## Project Structure

```
src/
├── main.tsx                  # entry
├── App.tsx                   # router: / , /admin, /admin/login
├── pages/
│   ├── HomePage.tsx          # public single-page site
│   └── admin/
│       ├── AdminLoginPage.tsx
│       └── AdminDashboardPage.tsx
├── components/               # public site sections
│   ├── VerifyCertificate.tsx # public certificate verification
│   └── admin/                # admin UI (upload form, table, dialogs, toasts)
├── lib/
│   ├── config.ts             # env config + readiness checks
│   ├── firebase.ts           # Firestore init
│   ├── cloudinary.ts         # upload helper (unsigned preset, progress)
│   ├── certificates.ts       # certificate CRUD service
│   ├── certificateUtils.ts   # shared types, validation, formatting
│   └── adminAuth.ts          # file-based admin login
└── data.ts                   # site content (courses, gallery, FAQs…)
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Type-check (`tsc --noEmit`) |
