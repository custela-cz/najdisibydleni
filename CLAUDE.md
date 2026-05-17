# najdisibydleni

Realitní portál „Najdi si bydlení" — inzerce nemovitostí (koupě, nájem,
novostavby) s mapovým vyhledáváním.

## Stack

- **Next.js** (App Router) + **React** — **JavaScript** (ne TypeScript,
  `jsconfig.json`, `.js` soubory)
- **Supabase** — `@supabase/ssr` + `@supabase/supabase-js` (DB, auth)
- **Leaflet** + **react-leaflet** — mapy a mapové vyhledávání
- Deploy: **Vercel**

## Skripty

```bash
npm run dev      # next dev (localhost:3000)
npm run build    # next build
npm run start    # produkční server
npm run lint     # next lint
```

## Struktura

```
app/
  page.js, layout.js, globals.css
  koupit/        inzeráty na prodej
  najem/         inzeráty k pronájmu
  novostavby/    novostavby
  inzerat/       detail inzerátu
  vlozit/        vložení nového inzerátu
  prihlaseni/    přihlášení
  auth/          auth callbacky
  dashboard/     uživatelský dashboard
components/
  leaflet-map.js, map-search.js   mapa + vyhledávání na mapě
  search-bar.js, cards.js         vyhledávání, karty inzerátů
  header.js, footer.js, logo.js, shared.js, constants.js
lib/
  supabase/      Supabase klient (browser + server)
  geocode.js     geokódování adres
supabase/
  migrations/    DB migrace
  seed.sql       seed data
  config.toml
proxy.js          lokální proxy
next.config.mjs
```

## Konvence

- Čistý JavaScript (žádný TS) — drž stávající styl, `jsconfig.json`
- App Router — server komponenty by default; mapy (Leaflet) jsou
  client-only (`"use client"`, nutné dynamic import bez SSR)
- DB/auth výhradně přes `lib/supabase/` klienty (browser vs. server)
- Po změně schématu přidej migraci do `supabase/migrations/`
- User-facing copy česky

## Necommitovat

- `.env*.local` (Supabase URL + anon/service klíče)
- `.next/`, `out/`, `node_modules/`, `.vercel`
- `supabase/.temp/`
- `.claude/settings.local.json`, `.claude/projects/`,
  `.claude/scheduled_tasks.lock` (runtime soubory)
