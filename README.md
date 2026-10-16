# Kokki & Peppi Lists

Shared, realtime lists (React + Vite + TypeScript + Tailwind, Supabase, PWA). Mobile-first, dark with blue accents.

## Local development
```bash
npm install
cp .env.example .env.local   # fill in your Supabase values
npm run icons                # generates PNG icons from public/icon.svg
npm run dev
```

## Setup guide

### 1. Supabase
1. Go to https://supabase.com → **New project** (free tier). Pick a name, a database password (save it) and a region close to you.
2. Wait until the project is ready, then open **SQL Editor → New query**.
3. Paste the full content of `supabase/schema.sql` and press **Run**. This creates the tables, open access policies and enables Realtime.
4. Open **Project Settings → API** (or "API Keys"):
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon / public key** (or "publishable key") → `VITE_SUPABASE_ANON_KEY`
   - Never use the `service_role` / secret key in this app.
5. Locally: put both values in `.env.local`.

### 2. Push to GitHub
```bash
git add . && git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```
(Use a private repo if you like. `.env.local` is git-ignored.)

### 3. Vercel
1. https://vercel.com → **Add New → Project** → import your GitHub repo.
2. Framework preset: **Vite** (auto-detected). Build command `npm run build`, output `dist`.
3. Under **Environment Variables** add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (same values as above).
4. **Deploy**. Open the resulting `https://….vercel.app` URL.

### 4. Put it on your phones
- **iPhone (Safari):** open the URL → Share → **Add to Home Screen**.
- **Android (Chrome):** menu ⋮ → **Install app** / **Add to Home screen**.
- On first launch choose Kokki or Peppi.

## Notes
- No login: anyone with the URL and the anon key can read/write. Keep the URL private.
- The "open on startup" default list is stored per phone.
- Changes sync live via Supabase Realtime (free tier). Returning to the app also refreshes the data.
