# jordanaftermidnight.com

Personal site for [Jordanaftermidnight](https://jordanaftermidnight.com) —
eurorack synths, AI + compliance tools, music, research.

Built with [Astro 7](https://astro.build) + vanilla TypeScript. No framework
islands. Static output.

## Design language

Cool near-black base (`#08080F`) with cyan (`#00D4FF`) as the identity accent
and warm gold (`#C19A6B`) as the interaction accent — the "warmth breaks
through" signature moment on hover / cursor proximity.

Motion is scoped: a tapered oscilloscope band under the wordmark, a
proximity-triggered digital-glitch on the emblem, a one-time scan-line reveal
on each section, and pill-chip stagger-in on load. All respect
`prefers-reduced-motion`.

## Structure

```
src/
├── layouts/Layout.astro          # HTML shell, meta, mounts CircuitBackground
├── components/
│   ├── CircuitBackground.astro   # procedurally-drawn PCB SVG, top-right
│   ├── Hero.astro                # emblem + wordmark + osc + currently pills
│   ├── ProjectSection.astro      # reusable section (title + card grid)
│   ├── ProjectCard.astro         # individual project card
│   └── Footer.astro
├── data/projects.ts              # single source of truth for projects
├── pages/index.astro             # composition
├── styles/global.css             # tokens (@theme + :root) + brand-swap utility
└── scripts/scramble.ts           # text-scramble animation used by Hero
```

## Commands

```bash
npm install       # deps
npm run dev       # http://localhost:4321
npm run build     # → ./dist
npm run preview   # preview built site
```

Dev server can be run in the background per project convention:

```bash
npx astro dev --background
npx astro dev status
npx astro dev logs
npx astro dev stop
```

## Local verification

Playwright is used to smoke-test frontend changes (per `.claude/CLAUDE.md`
convention). Scripts live in `scripts/`:

```bash
node scripts/verify-live.mjs      # screenshot the homepage
node scripts/verify-preview2.mjs  # screenshot preview2.html (design reference)
```

Screenshots land in `.verify/` (gitignored).

## Assets

Brand kit lives outside this repo at `~/Projects/webdesign/Jordanaftermidnight-brand/`.
The site's copies in `public/brand/` are the web-optimized downsizes (400px
WebP + PNG fallback for the emblem, 800px for the full logotypes). Re-run
`scripts/compress-emblems.py` to regenerate from source.
