# Label & Lens SEO Rebuild — Plan

## Doel
Huidige React SPA (28% Lighthouse performance) → Static HTML site (90%+ performance, 100% SEO).
Zelfde design, zelfde functionaliteit, geen React.

## Uitgangspunten
- **Repo**: `Drmedkit/labelenlens-seo` (verse start, huidige rommel opruimen)
- **Deploy**: Vercel (static)
- **Design**: Pixel-perfect match met huidige site (Inter font, groen/wit thema)
- **CSS**: Tailwind, build-time purged (11KB vs 300KB CDN)
- **JS**: Vanilla alleen waar nodig (menu, FAQ, calculator, formulier)
- **Afbeeldingen**: WebP, lazy loading, expliciete width/height

## 7 Pagina's

| # | Route | Complexiteit | Interactieve elementen |
|---|-------|-------------|----------------------|
| 1 | `/` (Home) | Hoog | Service selector, pricing calculator, FAQ accordion |
| 2 | `/energielabel` | Hoog | Prijscalculator (woningtype → prijs) |
| 3 | `/energielabels` | Medium | Energielabel voorbeeld, CTA |
| 4 | `/energielabel-aanvragen-amsterdam/` | Medium | SEO landing, stadsdelen, CTA |
| 5 | `/fotografie` | Medium | Foto carousel, pakketten |
| 6 | `/wws-puntentelling/` | Medium | Stadsdelen, uitleg, CTA |
| 7 | `/nen-2580-metingen/` | Medium | Stadsdelen, uitleg, CTA |

## Shared componenten (elke pagina)
- **Navigation** — Logo, 4 links, mobile hamburger
- **Footer** — Links, contact info, KVK
- **Contact sectie** — Email, telefoon, WhatsApp links
- **SEO head** — Unieke meta per pagina, JSON-LD, OG tags

## Stappenplan

### Fase 1: Foundation
- [ ] Repo opschonen (verse `static/` directory)
- [ ] Shared HTML template (head, nav, footer)
- [ ] Tailwind config + build script
- [ ] `robots.txt` + `sitemap.xml`
- [ ] Vercel config
- [ ] Alle afbeeldingen → WebP geoptimaliseerd in `/images/`

### Fase 2: Pagina's bouwen (één voor één)
Elke pagina:
1. Content uit React component extracten
2. Static HTML genereren (Gemini)
3. Handmatig reviewen tegen live site
4. Lighthouse run (moet 90%+ scoren)
5. Pas door naar volgende pagina

**Volgorde:**
- [ ] 2a. Homepage (`/`)
- [ ] 2b. Energielabel (`/energielabel`)  
- [ ] 2c. Energielabels (`/energielabels`)
- [ ] 2d. Energielabel Amsterdam (`/energielabel-aanvragen-amsterdam/`)
- [ ] 2e. Fotografie (`/fotografie`)
- [ ] 2f. WWS Puntentelling (`/wws-puntentelling/`)
- [ ] 2g. NEN 2580 (`/nen-2580-metingen/`)

### Fase 3: Interactieve elementen
- [ ] Pricing calculator (vanilla JS)
- [ ] Contact formulier (→ Google Sheets via fetch API)
- [ ] Foto carousel (CSS-only of minimal JS)
- [ ] FAQ accordion (`<details>`/`<summary>`)
- [ ] Mobile hamburger menu

### Fase 4: QA & Deploy
- [ ] Alle 7 pagina's Lighthouse audit (performance + SEO + a11y)
- [ ] Mobile test (responsive)
- [ ] Formulier test (submit werkt)
- [ ] Cross-browser check
- [ ] Vergelijk live site vs rebuild (visueel)
- [ ] Push naar repo
- [ ] Vercel production deploy

## Kwaliteitseisen per pagina
- Lighthouse Performance: ≥ 90
- Lighthouse SEO: 100
- Lighthouse Accessibility: ≥ 90
- HTML < 50KB per pagina
- Alle afbeeldingen WebP + alt text + width/height
- Unique title (30-60 chars) + meta description (120-155 chars)
- JSON-LD structured data
- Interne links naar andere pagina's

## Backend/API nodig
- **Contact formulier**: POST naar Google Sheets (bestaande `server/google-sheets.ts` logica → serverless function of Google Apps Script)
- **Pricing calculator**: Pure client-side (geen API nodig)

## Niet in scope
- Blog (later, past bij Slopcanon skill)
- Nieuwe content schrijven
- Design wijzigingen
