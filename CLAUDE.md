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

---

## Karpathy Coding Guidelines

Behavioral guidelines to reduce common LLM coding mistakes, derived from [Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876) on LLM coding pitfalls. Source: [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) (MIT). Merge with the project-specific instructions above as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.
