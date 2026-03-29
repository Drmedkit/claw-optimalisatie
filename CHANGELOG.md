# Label & Lens SEO Rebuild — Changelog

**Project**: labelenlens.nl SEO optimalisatie
**Periode**: 29 maart 2026
**Repo**: github.com/Drmedkit/labelenlens-seo
**Live**: labelenlens-static.vercel.app

---

## Uitgangspunt

**Bestaande site**: React SPA (Vite + Wouter + Tailwind + Radix UI + Express backend)
- Hosted op Google Cloud
- Client-side rendered: Google ziet 2KB lege HTML
- 750KB JavaScript bundle
- Ongecomprimeerde images (3.5MB hero image)
- **Lighthouse scores**: Performance 28%, SEO 100%, Accessibility 78%

---

## Fase 0: Analyse & Onderzoek

### SEO Audit
- Ontdekt: alle 7 pagina's serveren dezelfde 2KB HTML shell
- Geen content in raw HTML — volledig afhankelijk van JavaScript rendering
- Geen structured data (JSON-LD) in server response
- Elke subpagina heeft dezelfde title/description als homepage
- Slechts 1 pagina geïndexeerd door Google (van de 7)
- `cache-control: private, max-age=0` — geen caching

### Performance Diagnose
- Hero image: **3.5MB PNG** (niet geoptimaliseerd)
- Paulo portrait: **1.9MB JPG**
- JS bundle: **750KB** (één groot bestand, geen code splitting)
- **47 Radix UI componenten** geïnstalleerd, slechts **19 gebruikt**
- **16 npm dependencies** ongebruikt (recharts, replit plugins, etc.)
- Geen lazy loading op images
- Geen resource preloading
- Google Fonts render-blocking

---

## Fase 1: React Optimalisatie (Experiment)

### Repo Setup
- Originele repo (`Drmedkit/paul`) gekopieerd naar `Drmedkit/labelenlens-seo`

### SEO Meta Prerendering
- Per-route HTML bestanden aangemaakt met:
  - Unieke `<title>` per pagina (30-65 chars)
  - Unieke `<meta description>` per pagina (120-155 chars)
  - `<link rel="canonical">` per pagina
  - JSON-LD structured data (LocalBusiness + Service schemas)
  - H1 heading in raw HTML
  - Interne navigatie links voor crawlers
  - Hreflang tags (nl + x-default)
  - Open Graph + Twitter Card meta tags
- Script: `prerender-seo.py` voor reproduceerbare builds

### Image Optimalisatie
- **54 afbeeldingen** geconverteerd van PNG/JPG naar WebP
- Totaal: **56MB → 8MB** (-84%)
- Hero image: **3.5MB → 470KB** (-87%)
- Paulo portrait: **1.9MB → 29KB** (-98%)
- Alle imports in 7 page components bijgewerkt naar WebP

### Bundle Optimalisatie
- **Lazy loading** op alle 7 routes (React.lazy + Suspense)
- **28 ongebruikte UI componenten** verwijderd (47 → 19)
- **16 ongebruikte npm dependencies** verwijderd
- Vite config: code splitting (vendor/ui/page chunks)
- Vite config: esbuild minification (ipv terser)
- Replit-specifieke plugins verwijderd uit production build
- **Lazy loading** toegevoegd aan 7 non-critical images
- Resource preloads (hero image + font)

### Vercel Deployment
- `vercel.json` aangemaakt (build command, output dir, SPA rewrites)
- Deployed als `labelenlens-seo.vercel.app`

### Resultaat React Optimalisatie
| Metric | Origineel | Na optimalisatie |
|--------|-----------|-----------------|
| Performance | 28% | 53% |
| FCP | 6.4s | 2.1s |
| LCP | 24.4s | 6.2s |
| TBT | 1,650ms | 610ms |
| JS bundle | 750KB (1 file) | 260KB initial (8 chunks) |
| Images | 56MB | 8MB |

**Conclusie**: React SPA heeft een hard plafond (~53%). Architectuur switch nodig.

---

## Fase 2: Static HTML Rebuild

### Foundation
- `static/` directory aangemaakt met schone structuur
- **23 geoptimaliseerde WebP images** (4.5MB totaal)
- Tailwind CSS config met custom kleuren (primary green, surface, etc.)
- Build script voor CSS purging
- `robots.txt` + `sitemap.xml` (7 URLs)
- `vercel.json` met caching headers (1 jaar voor images/css)
- Favicons gekopieerd
- Content geëxtraheerd uit alle 21 React componenten

### Pagina's Gebouwd (Gemini 2.5 Flash)
Alle 7 pagina's gegenereerd met volledige content uit de React broncode:

| Pagina | Route | Grootte | Inhoud |
|--------|-------|---------|--------|
| Homepage | `/` | 56KB | Hero, diensten selector, 6 services, hoe het werkt, over ons, USPs, reviews, contact, team, FAQ, certificeringen, prijzen CTA, footer |
| Energielabel | `/energielabel` | 31KB | Service selector (koop/huur), fotografie pakketten, contact formulier, reviews |
| Energielabels | `/energielabels` | 20KB | Uitleg energielabel, wanneer verplicht, voorbeeld, hoe het werkt, USPs |
| Amsterdam | `/energielabel-aanvragen-amsterdam/` | 18KB | Stadsdelen, diensten, lokale focus |
| Fotografie | `/fotografie` | 20KB | 3 pakketten (Basic €149, Standaard €249, Premium €399), portfolio grid, diensten |
| WWS | `/wws-puntentelling/` | 15KB | Uitleg WWS, wanneer nodig, beoordelingscriteria, stadsdelen |
| NEN 2580 | `/nen-2580-metingen/` | 15KB | Uitleg NEN 2580, wanneer nodig, wat je krijgt, stadsdelen |

### Per Pagina SEO
Elke pagina bevat:
- Unieke `<title>` (30-65 chars)
- Unieke `<meta description>` (120-155 chars)
- `<link rel="canonical">`
- JSON-LD Service/LocalBusiness schema
- Open Graph + Twitter Card
- Hreflang nl + x-default
- Semantic HTML5 (nav, main, section, footer)
- Alle images met alt, width, height

### Tailwind CSS
- Build-time purging (alleen gebruikte classes)
- **17KB CSS** (vs 300KB+ Tailwind CDN runtime)
- Custom kleuren: primary (green), surface (off-white)

---

## Fase 3: Interactieve Elementen

### Shared JavaScript (`js/main.js` — 2KB)
- **Mobile menu**: hamburger toggle met `open` class + aria-expanded
- **Contact formulier**: submit handler met success state
- **Service selector**: click handling met visuele feedback (ring + bg kleur)

### Markup Standaardisatie
- Alle 7 pagina's: `data-menu-toggle` / `data-menu` attributen
- Alle formulieren: `data-contact-form` attribuut
- Inline scripts verwijderd, vervangen door shared `main.js`

### FAQ
- Native `<details>` / `<summary>` elementen (zero JavaScript)
- 10 veelgestelde vragen met antwoorden

### CSS Fixes
- `bg-primary-green` → `bg-primary` (Tailwind class correctie)
- `overflow-x: hidden` + `max-width: 100vw` op html/body
- Hero responsive: `text-2xl` base → `text-4xl` sm → `text-6xl` md
- Hero hoogte: `min-h-[80vh]` mobile → `min-h-screen` desktop
- Heading hiërarchie gecorrigeerd (h4 → h3)
- Aria labels op hamburger button

### Performance Optimalisaties
- Hero image preload (`fetchpriority="high"`)
- Google Fonts non-blocking (preload + onload pattern)
- Critical CSS inlined (nav + hero styling)
- Hero image extra gecomprimeerd: **475KB → 252KB**
- `defer` attribuut op main.js

---

## Fase 4: QA & Deployment

### Lighthouse Scores (Finale)

| Pagina | Performance | SEO | Accessibility | Best Practices |
|--------|-------------|-----|---------------|----------------|
| `/` | **94%** | 100% | 94% | 96% |
| `/energielabel` | **90%** | 100% | 96% | 96% |
| `/energielabels` | **88%** | 100% | 100% | 100% |
| `/energielabel-amsterdam` | **88%** | 100% | 90% | 96% |
| `/fotografie` | **93%** | 100% | 95% | 96% |
| `/wws-puntentelling` | **99%** | 100% | 100% | 96% |
| `/nen-2580-metingen` | **100%** | 100% | 95% | 96% |

### Vergelijking met Origineel

| Metric | Origineel (React) | Static Rebuild |
|--------|-------------------|----------------|
| Performance | 🔴 28% | 🟢 88-100% |
| SEO | 🟢 100% | 🟢 100% |
| Accessibility | 🟡 78% | 🟢 90-100% |
| FCP | 6.4s | 1.5-2.9s |
| LCP | 24.4s | 1.5-3.9s |
| TBT | 1,650ms | 0-300ms |
| JS size | 750KB | 2KB |
| CSS size | 85KB | 18KB |
| Images | 56MB | 4.5MB |
| HTML per pagina | 2KB (leeg) | 15-56KB (vol content) |

---

## Niet Geïmplementeerd (Open Items)

- [ ] **Pricing calculator** — Vanilla JS rebuild van React calculator (multi-step woningtype → dienst → prijs)
- [ ] **Contact form backend** — Google Apps Script endpoint voor formulier submissions → Google Sheets
- [ ] **Foto carousel** — Huidige grid werkt, carousel is nice-to-have
- [ ] **Blog sectie** — Templates voor SEO content (past bij Slopcanon skill)
- [ ] **Domein koppeling** — labelenlens.nl verwijzen naar Vercel deployment
- [ ] **Google Search Console** — Sitemap indienen, indexering monitoren

---

## Bestanden

```
static/
├── index.html                          (56KB — Homepage)
├── energielabel/index.html             (31KB)
├── energielabels/index.html            (20KB)
├── energielabel-aanvragen-amsterdam/index.html (18KB)
├── fotografie/index.html               (20KB)
├── wws-puntentelling/index.html        (15KB)
├── nen-2580-metingen/index.html        (15KB)
├── css/
│   ├── input.css                       (Tailwind source)
│   └── style.css                       (18KB — purged + minified)
├── js/
│   └── main.js                         (2KB — menu, form, selector)
├── images/                             (23 WebP files, 4.5MB)
├── robots.txt
├── sitemap.xml
├── vercel.json
├── favicon.ico
├── favicon.png
└── tailwind.config.js
```

---

## Git Commits

1. `7694932` — Initial: copy from Paul repo
2. `595eca7` — SEO: prerender all routes with SSR meta, JSON-LD, H1
3. `fe6033e` — Performance: WebP images, lazy loading, code splitting
4. `c27d771` — Fix: esbuild instead of terser, fix circular chunks
5. `dfff640` — Add vercel.json
6. `1d35bf3` — Fix vercel.json: build from root
7. `d244785` — Round 4: lazy routes, remove unused components/deps
8. `57c0e22` — Round 5: fix CLS, lazy-load carousel
9. `4320989` — Fase 1: Foundation (images, config, content)
10. `3c92bc2` — Fase 2: All 7 pages built
11. `54ae3eb` — Fase 3: Shared JS, consistent markup
12. `e3ddd82` — Fase 3: Fix mobile menu, responsive hero
13. `99abb1d` — Fase 3: Fix CSS classes
14. `3cd52f4` — Fase 3 complete: overflow fixes, final corrections
