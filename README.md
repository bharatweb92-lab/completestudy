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
cp .env.example .env.local   # then fill in your credentials (see below)
npm run dev                  # http://localhost:3000
```

## Configuration

All configuration lives in environment variables (see `.env.example`). Never commit real credentials — `.env.local` is git-ignored.

### 1. Firebase (Firestore — certificate data)

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project** (or use an existing one).
2. In the project, click the **Web (`</>`)** icon to register a web app. Copy the `firebaseConfig` values.
3. **Create the database**: Build → Firestore Database → **Create database** (choose production mode, pick a region).
4. **Publish the security rules**: copy the contents of [`firestore.rules`](./firestore.rules) into Firestore → Rules → Publish.
   (Or with the Firebase CLI: `npx firebase-tools deploy --only firestore:rules`.)
5. Put the values into `.env.local`:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

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

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. From the **Dashboard**, copy your **Cloud name**.
3. Go to **Settings → Upload → Add upload preset**:
   - **Signing mode:** `Unsigned`
   - **Allowed formats:** restrict to `pdf, png, jpg, jpeg, webp` (recommended)
4. Put the values into `.env.local`:

```
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-unsigned-preset-name
```

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
