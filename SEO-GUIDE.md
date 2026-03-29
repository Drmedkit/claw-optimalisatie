# SEO Expert Guide voor Web Developers — 2026 Edition
> Geschreven voor: Next.js · Vercel · Cloudflare · App Router  
> Doel: Van nul naar expert, met meetbare progressie per website

---

## Inhoudsopgave

1. [De Fundamenten: Hoe zoekmachines werken](#1-de-fundamenten)
2. [Technische SEO](#2-technische-seo)
3. [On-Page SEO](#3-on-page-seo)
4. [Core Web Vitals](#4-core-web-vitals)
5. [Structured Data & Schema](#5-structured-data--schema)
6. [Content SEO & Semantic Search](#6-content-seo--semantic-search)
7. [GEO & AEO — AI Search Optimization](#7-geo--aeo--ai-search-optimization)
8. [Next.js-specifieke implementatie](#8-nextjs-specifieke-implementatie)
9. [Tools & Workflows](#9-tools--workflows)
10. [🧪 Performance Tests — Progressie Tracker](#10-performance-tests--progressie-tracker)

---

## 1. De Fundamenten

### Hoe een zoekmachine werkt (simplified)

```
Crawl → Render → Index → Rank → Serve
```

| Fase | Wat gebeurt er | Jouw verantwoordelijkheid |
|------|---------------|--------------------------|
| **Crawl** | Googlebot bezoekt je URL | robots.txt, crawl budget, geen broken links |
| **Render** | JS wordt uitgevoerd, DOM gebouwd | SSR/SSG gebruiken; niet afhankelijk zijn van CSR |
| **Index** | Pagina wordt opgeslagen in database | Meta robots, canonical tags, indexable content |
| **Rank** | Relevantie + autoriteit + experience | Alles hieronder |
| **Serve** | Juiste pagina bij juiste query | Structured data, user intent matching |

### De drie pijlers van SEO

```
         ┌──────────────────┐
         │   TECHNISCH SEO  │  ← Crawlability, speed, schema
         │                  │
    ┌────┴────┐        ┌────┴────┐
    │ CONTENT │        │AUTORITEIT│
    │   SEO   │        │ (Links) │
    │         │        │         │
    └─────────┘        └─────────┘
```

**Zonder technisch fundament mist alles zijn effect.**

---

## 2. Technische SEO

### 2.1 Crawlability

#### robots.txt
Elke site heeft dit nodig. Blokkeer wat je niet wilt indexeren, maar **nooit** per ongeluk productie blokkeren.

```txt
# /public/robots.txt
User-agent: *
Allow: /

# AI crawlers die alleen scrapen voor training — overweeg blokkeren
User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /

# Maar AI-search-agents wil je WELKOM heten:
User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: https://jouwsite.nl/sitemap.xml
```

**Regel:** Onderscheid tussen *training scrapers* (blokkeren) en *answer engine crawlers* (toelaten).

#### Sitemap
Genereer automatisch met `next-sitemap`:

```bash
npm install next-sitemap
```

```js
// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://jouwsite.nl',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/admin/*', '/api/*', '/private/*'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://jouwsite.nl/server-sitemap.xml', // dynamische routes
    ],
  },
}
```

```json
// package.json
{
  "scripts": {
    "postbuild": "next-sitemap"
  }
}
```

### 2.2 URL-structuur

**Goed:**
```
/diensten/webdesign-purmerend
/blog/seo-tips-voor-mkb
/over-ons
```

**Slecht:**
```
/page?id=47
/diensten/webdesign-purmerend-north-holland-netherlands-best-cheap
/?p=seo&cat=3&filter=active
```

**Regels:**
- Gebruik koppeltekens (`-`), geen underscores (`_`)
- Lowercase altijd
- Verwijder stopwoorden uit URL (`/de/`, `/een/` zijn overbodig)
- Max 3-4 niveaus diep
- Elke URL moet uniek en descriptief zijn

### 2.3 HTTPS & Security

```bash
# Vercel doet dit automatisch — maar controleer:
# 1. Redirect http → https (Vercel default ✅)
# 2. HSTS header aanwezig
# 3. Geen mixed content (http resources op https pagina)
```

Controleer headers:
```bash
curl -I https://jouwsite.nl
# Check voor: strict-transport-security
```

### 2.4 Redirect-management

```js
// next.config.js — Permanente redirects (301) zijn goud waard voor SEO
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/oude-dienst',
        destination: '/nieuwe-dienst',
        permanent: true, // 301 — geeft link equity door
      },
      {
        source: '/blog/:slug*',
        destination: '/artikelen/:slug*',
        permanent: true,
      },
    ]
  },
}
```

**Regels:**
- 301 = permanent (geeft "link juice" door) ← gebruik dit bij migraties
- 302 = tijdelijk (geeft geen equity door)
- Nooit redirect chains langer dan 1 stap
- Na site redesign: altijd alle oude URLs mappen

### 2.5 Canonical Tags

Voorkomt duplicate content problemen.

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    alternates: {
      canonical: `https://jouwsite.nl/blog/${params.slug}`,
    },
  }
}
```

**Wanneer nodig:**
- Pagina's bereikbaar via meerdere URLs (met/zonder trailing slash, met/zonder parameters)
- Gedupliceerde content op meerdere locaties
- Printversies van pagina's

### 2.6 Index Budget

Houd je index lean. **Meer pagina's is niet altijd beter.**

Noindex plaatsen op:
```tsx
// Pagina's die je NIET wil indexeren
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}
```

**Candidaten voor noindex:**
- Zoekresultaatpagina's (`/zoek?q=...`)
- Paginering voorbij pagina 2 (debatable, maar veilig)
- Filter-combinaties (faceted navigation)
- Dankjewel-pagina's na formulier
- Stagingomgevingen (CRUCIAAL — check dit altijd voor launch)

---

## 3. On-Page SEO

### 3.1 Metadata — De Basis

```tsx
// app/layout.tsx — Globale defaults
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://jouwsite.nl'),
  title: {
    default: 'Studio H20 — Podcast & Content Studio Purmerend',
    template: '%s | Studio H20',
  },
  description: 'Professionele podcast studio in Purmerend. Huur onze studio voor opnames, livestreams en content productie.',
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: 'https://jouwsite.nl',
    siteName: 'Studio H20',
    images: [
      {
        url: '/og-image.jpg', // 1200x630px
        width: 1200,
        height: 630,
        alt: 'Studio H20 Purmerend',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@jouwhandle',
  },
}
```

```tsx
// app/diensten/podcast-studio/page.tsx — Pagina-specifiek
export const metadata: Metadata = {
  title: 'Podcast Studio Huren Purmerend',
  description: 'Huur een professionele podcast studio in Purmerend per uur. Inclusief microfoons, mixing, en begeleiding. Vanaf €75/uur.',
  alternates: {
    canonical: 'https://jouwsite.nl/diensten/podcast-studio',
  },
}
```

### 3.2 Title Tags

**Formule:** `[Primaire keyword] — [USP] | [Merknaam]`

| ✅ Goed | ❌ Slecht |
|---------|---------|
| Podcast Studio Huren Purmerend — Professioneel & Betaalbaar | Home |
| Webdesign Waterland — Next.js Websites | Pagina 1 |
| Kamadobarbecue Recepten: 50+ Technieken | Welkom op onze site |

**Technische regels:**
- Max 60 karakters (anders afgekapt in SERP)
- Uniek per pagina — altijd
- Primaire keyword zo vroeg mogelijk
- Merknaam aan het einde (tenzij je een sterk merk bent)

### 3.3 Meta Description

- Max 155-160 karakters
- Bevat een call-to-action
- Bevat het primaire keyword (Google bold dit in resultaten)
- Elke pagina is uniek
- Geen duplicate descriptions — Google schrijft ze dan zelf (en dat wil je niet)

### 3.4 Heading Hiërarchie

```html
<h1>Podcast Studio Huren in Purmerend</h1>          <!-- 1x per pagina! -->
  <h2>Wat biedt onze studio?</h2>
    <h3>Professionele Opnameapparatuur</h3>
    <h3>Geluidsisolatie & Akoestiek</h3>
  <h2>Tarieven & Boeken</h2>
    <h3>Uurtarief</h3>
    <h3>Dagpakketten</h3>
  <h2>Veelgestelde Vragen</h2>
```

**Regels:**
- Precies **één H1** per pagina
- Geen heading levels overslaan (H1 → H3 is fout)
- H1 bevat het primaire keyword
- Headings zijn beschrijvend, niet decoratief

### 3.5 Interne Linking

Onderschatte kracht. Interne links:
1. Verdelen "link equity" door je site
2. Helpen Google je sitehiërarchie begrijpen
3. Houden gebruikers langer op je site

```tsx
// Goed patroon: contextual anchor text
<p>
  Wij bouwen websites met{' '}
  <Link href="/technologie/nextjs">Next.js</Link>
  {' '}voor optimale snelheid en SEO.
</p>

// Slecht:
<Link href="/nextjs">Klik hier</Link>
```

**Strategie:**
- Gebruik descriptieve anchor text (niet "klik hier")
- Link vanuit content-rijke pagina's naar conversie-pagina's
- Pillar page → cluster pages (topic clusters)
- Vermijd orphan pages (pagina's zonder inkomende interne links)

---

## 4. Core Web Vitals

De drie metrices die Google als ranking factor gebruikt.

### 4.1 LCP — Largest Contentful Paint
**Doel: < 2.5 seconden**

Wat is het grootste element boven de vouw? Meestal een hero-image of H1.

```tsx
// ✅ Hero image met priority
import Image from 'next/image'

export default function HeroSection() {
  return (
    <Image
      src="/hero.jpg"
      alt="Studio H20 Podcast Studio Purmerend"
      width={1920}
      height={1080}
      priority           // ← Kritiek: laad dit als eerste!
      quality={85}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  )
}
```

**LCP Optimalisatie Checklist:**
- [ ] Hero image heeft `priority` prop
- [ ] Gebruik WebP of AVIF formaat
- [ ] Preload LCP image in `<head>`
- [ ] Gebruik Vercel's edge CDN (automatisch bij Vercel)
- [ ] Geen render-blocking resources vóór de fold
- [ ] Server Response Time (TTFB) < 600ms

```tsx
// app/layout.tsx — Preload LCP image
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <link
          rel="preload"
          as="image"
          href="/hero.webp"
          fetchpriority="high"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### 4.2 INP — Interaction to Next Paint
**Doel: < 200ms** (verving van FID in 2024)

Meet de responsiviteit van **alle** interacties op je pagina.

```tsx
// ❌ Blokkerende event handler
function handleClick() {
  // Zware synchrone operatie
  const result = heavyCalculation(data) // Blokkeert main thread
  setResult(result)
}

// ✅ Non-blocking met scheduler
function handleClick() {
  // Geef browser de kans te renderen tussen taken
  startTransition(() => {
    const result = heavyCalculation(data)
    setResult(result)
  })
}
```

**INP Optimalisatie:**
- [ ] Gebruik React `startTransition` voor niet-urgente updates
- [ ] Lazy load heavy components
- [ ] Debounce input handlers
- [ ] Vermijd grote JavaScript bundles
- [ ] Gebruik Server Components waar mogelijk (geen client-side hydration)

```tsx
// ✅ Server Component voor statische content (geen JS nodig)
// app/over-ons/page.tsx
export default async function OverOnsPage() {
  const data = await fetchData() // Runt op server, geen client JS
  return <OverOnsContent data={data} />
}

// ✅ Alleen interactieve delen zijn Client Components
'use client'
export function ContactForm() {
  // Alleen dit deel hoeft te hydrateren
}
```

### 4.3 CLS — Cumulative Layout Shift
**Doel: < 0.1**

Elementen die verschuiven terwijl de pagina laadt.

```tsx
// ❌ Image zonder dimensies → CLS
<img src="/foto.jpg" alt="..." />

// ✅ Altijd width/height opgeven
<Image src="/foto.jpg" alt="..." width={800} height={600} />

// ❌ Font swap zonder fallback → CLS
// ✅ Gebruik next/font voor zero-CLS fonts
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})
```

**CLS Bronnen om te elimineren:**
- [ ] Alle images hebben `width` en `height`
- [ ] Fonts laden zonder layout shift (`next/font`)
- [ ] Ads/banners hebben gereserveerde ruimte
- [ ] Cookie consent banner springt niet in
- [ ] Skeleton loaders voor dynamische content

```tsx
// ✅ Skeleton component voorkomt CLS
function ProductCard({ product, isLoading }) {
  if (isLoading) {
    return (
      <div className="w-full h-48 bg-gray-200 animate-pulse rounded-lg" />
    )
  }
  return <ActualProductCard product={product} />
}
```

### 4.4 Core Web Vitals Score Referentie

| Metriek | Goed | Verbetering nodig | Slecht |
|---------|------|-------------------|--------|
| LCP | < 2.5s | 2.5s – 4.0s | > 4.0s |
| INP | < 200ms | 200ms – 500ms | > 500ms |
| CLS | < 0.1 | 0.1 – 0.25 | > 0.25 |

---

## 5. Structured Data & Schema

Schema.org markup is de taal waarmee je search engines (en AI) letterlijk vertelt wat je content betekent.

### 5.1 JSON-LD implementatie in Next.js

```tsx
// app/components/JsonLd.tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

### 5.2 LocalBusiness Schema (MKB websites)

```tsx
// app/layout.tsx of app/page.tsx
import { JsonLd } from '@/components/JsonLd'

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Studio H20',
  description: 'Professionele podcast en content studio in Purmerend',
  url: 'https://h20-studio.nl',
  telephone: '+31612345678',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Voorbeeldstraat 1',
    addressLocality: 'Purmerend',
    postalCode: '1441 AA',
    addressCountry: 'NL',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 52.5027,
    longitude: 4.9627,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  priceRange: '€€',
  image: 'https://h20-studio.nl/og-image.jpg',
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <JsonLd data={localBusinessSchema} />
        {children}
      </body>
    </html>
  )
}
```

### 5.3 FAQ Schema

```tsx
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Wat kost het huren van de podcast studio?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'De podcast studio is beschikbaar vanaf €75 per uur, inclusief basis apparatuur en technische ondersteuning.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kan ik de studio ook voor een dag huren?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja, wij bieden dagpakketten aan vanaf €450. Dit inclusief technische support en nabewerking.',
      },
    },
  ],
}
```

### 5.4 Article / BlogPost Schema

```tsx
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }) {
  const post = await getPost(params.slug)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: `https://jouwsite.nl/auteurs/${post.author.slug}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Studio H20',
      logo: {
        '@type': 'ImageObject',
        url: 'https://h20-studio.nl/logo.png',
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    image: post.coverImage,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://jouwsite.nl/blog/${params.slug}`,
    },
  }

  return (
    <>
      <JsonLd data={articleSchema} />
      <article>{/* content */}</article>
    </>
  )
}
```

### 5.5 Schema Validatie

**Controleer altijd na implementatie:**
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

**Schema Drift voorkomen:** Als je prijs of beschikbaarheid dynamisch is, zorg dan dat je JSON-LD synchroon loopt met de zichtbare content.

---

## 6. Content SEO & Semantic Search

### 6.1 Keyword Research Methodologie

```
DOEL → Zoekintentie → Keywords → Content
```

**Vier zoekintentie-types:**

| Type | Signaal | Pagina-type |
|------|---------|-------------|
| **Informational** | "hoe", "wat is", "waarom" | Blog, gids, FAQ |
| **Navigational** | Merknaam + url | Homepage, Over ons |
| **Commercial** | "beste", "vergelijking", "review" | Vergelijkingspagina |
| **Transactional** | "kopen", "boeken", "huren", "prijs" | Dienst/productpagina |

**Keyword Piramide:**

```
        [Pillar: "Podcast Studio"]
               (hoog volume)
        /          |           \
[Studio huren] [Podcast tips] [Apparatuur]
  (medium)        (medium)      (medium)
   /    \           |           /    \
[Purmerend] [Noord-Holland] ... (long-tail)
```

### 6.2 LSI Keywords & Semantic Context

Google begrijpt nu de semantische relatie tussen woorden. Je hoeft een keyword niet letterlijk te herhalen.

**Voorbeeld voor "podcast studio huren Purmerend":**

Verwante termen om te verwerken:
- opnamestudio, geluidsopname, microfoon, mixing
- content creatie, YouTubers, ondernemers
- Noord-Holland, Waterland, Zaandam, Amsterdam-Noord
- uurtarief, dagpakket, beschikbaarheid

### 6.3 Content Structuur voor AI Citaties (GEO)

De **BLUF methode** (Bottom Line Up Front):

```markdown
# Podcast Studio Huren in Purmerend

Studio H20 biedt professionele podcast-opnamestudio's in Purmerend 
voor €75 per uur. [← Direct antwoord in eerste zin]

## Wat is er inbegrepen?
De studio beschikt over [lijst van features...]

## Hoe boek ik?
[Stap-voor-stap instructie...]
```

**AI-engines citeren content die:**
1. Directe antwoorden geeft in de eerste zin
2. Duidelijke structuur heeft (H2/H3, lijsten, tabellen)
3. Unieke feiten en cijfers bevat die elders niet staan
4. Van een authoritative bron komt

---

## 7. GEO & AEO — AI Search Optimization

### 7.1 Wat verandert er

**Traditionele SEO:** pagina ranked in blauwe links
**GEO (Generative Engine Optimization):** content wordt geciteerd in AI-antwoorden
**AEO (Answer Engine Optimization):** content beantwoordt directe vragen

```
Vroeger: Gebruiker → Google → Klik op jouw site
Nu:      Gebruiker → AI → AI citeert jouw content → Soms klik
```

### 7.2 GEO Best Practices

```markdown
## ✅ DO: Schrijf als een autoriteit die direct antwoord geeft

**Hoeveel kost een website laten bouwen?**
Een website laten bouwen kost in Nederland gemiddeld €1.500 tot €8.000 
voor een MKB-site, afhankelijk van complexiteit en functionaliteit.

Factoren die de prijs bepalen:
- Aantal pagina's (10-50 pagina's = €1.500-€3.500)
- Webshop functionaliteit (+ €1.000-€3.000)
- Maatwerk design vs. template (+ €500-€2.000)
- Copywriting en fotografie (+ €500-€1.500)

## ❌ DON'T: Bury the lede

Welkom op onze website! Wij zijn blij dat u interesse heeft in onze 
dienstverlening op het gebied van digitale communicatie. Wij werken 
al jaren in de branche en hebben veel ervaring...
[De prijs pas na 300 woorden]
```

### 7.3 E-E-A-T Signalen

**Experience, Expertise, Authoritativeness, Trustworthiness**

```tsx
// Auteurspagina met ProfilePage schema
const authorSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: {
    '@type': 'Person',
    name: 'Tobias van der Stelt',
    jobTitle: 'Hoofd Educatie & Web Developer',
    affiliation: {
      '@type': 'Organization',
      name: 'H20 Esports Campus',
    },
    sameAs: [
      'https://linkedin.com/in/tobias-van-der-stelt',
      'https://github.com/tobias-vds',
    ],
  },
}
```

**E-E-A-T Checklist:**
- [ ] Auteurspagina's aanwezig met expertise beschrijving
- [ ] Bronnen en data geciteerd in content
- [ ] About-pagina met team en contact
- [ ] KVK-nummer, adres zichtbaar (voor lokale bedrijven)
- [ ] Reviews/testimonials (met Review schema)
- [ ] Privacy Policy & Algemene Voorwaarden aanwezig

---

## 8. Next.js-specifieke Implementatie

### 8.1 Rendering Strategy kiezen

| Strategie | Wanneer | SEO Impact |
|-----------|---------|-----------|
| **SSG** (Static Site Generation) | Marketing pages, blog posts | ⭐⭐⭐⭐⭐ Beste |
| **ISR** (Incremental Static Regeneration) | E-commerce, nieuws | ⭐⭐⭐⭐ Uitstekend |
| **SSR** (Server Side Rendering) | Gepersonaliseerde content | ⭐⭐⭐⭐ Goed |
| **CSR** (Client Side Rendering) | User dashboards, apps | ⭐ Slecht (voor SEO) |

```tsx
// SSG — Beste voor statische pagina's
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

// ISR — Cached maar refresht op interval
export const revalidate = 3600 // Refresh elke uur

// SSR — Altijd vers
export const dynamic = 'force-dynamic'
```

### 8.2 Metadata API (App Router)

```tsx
// app/layout.tsx — Root metadata met alle defaults
export const metadata: Metadata = {
  metadataBase: new URL('https://jouwsite.nl'),
  
  // Basic
  title: { default: 'Bedrijfsnaam', template: '%s | Bedrijfsnaam' },
  description: 'Bondige beschrijving van het bedrijf (max 155 tekens).',
  
  // Indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    siteName: 'Bedrijfsnaam',
  },
  
  // Verification
  verification: {
    google: 'your-verification-code',
  },
  
  // Canonical (root)
  alternates: {
    canonical: 'https://jouwsite.nl',
  },
}
```

### 8.3 Dynamic OG Images

```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }

export default async function OGImage({ params }) {
  const post = await getPost(params.slug)
  
  return new ImageResponse(
    (
      <div
        style={{
          background: '#E1014A', // H20 Play Red
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <h1 style={{ fontSize: '60px', margin: 0 }}>{post.title}</h1>
        <p style={{ fontSize: '30px', opacity: 0.8 }}>{post.excerpt}</p>
      </div>
    ),
    size
  )
}
```

### 8.4 Font Optimalisatie (nul CLS)

```tsx
// app/layout.tsx
import { Inter, Poppins } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="nl" className={`${inter.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

### 8.5 Image Optimalisatie

```tsx
// Volledige checklist voor Next.js images

// ✅ 1. Hero image (above fold) — gebruik priority
<Image src="/hero.jpg" alt="..." width={1920} height={1080} priority />

// ✅ 2. Content images — lazy load (default)
<Image src="/feature.jpg" alt="Beschrijvende alt tekst" width={800} height={600} />

// ✅ 3. Remote images configureren
// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.jouwsite.nl',
        pathname: '/uploads/**',
      },
    ],
    formats: ['image/avif', 'image/webp'], // AVIF eerst (kleinst)
  },
}

// ✅ 4. Alt text: beschrijvend, met keyword waar relevant
// Slecht: alt=""  of  alt="afbeelding"
// Goed:   alt="Podcast studio opname setup met Shure SM7B microfoon"
```

### 8.6 Vercel-specifieke SEO configuratie

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 9. Tools & Workflows

### 9.1 Essentiële Gratis Tools

| Tool | Gebruik | URL |
|------|---------|-----|
| **Google Search Console** | Rankings, indexering, crawl errors | search.google.com/search-console |
| **PageSpeed Insights** | Core Web Vitals per URL | pagespeed.web.dev |
| **Google Rich Results Test** | Schema validatie | search.google.com/test/rich-results |
| **Screaming Frog** (gratis 500 URLs) | Site crawl, technische audit | screamingfrog.co.uk |
| **Ahrefs Webmaster Tools** (gratis) | Backlinks, broken links | ahrefs.com/webmaster-tools |
| **GTmetrix** | Performance + waterfall | gtmetrix.com |
| **Lighthouse** (in browser) | Volledige audit | Chrome DevTools > Lighthouse |

### 9.2 Workflow per Nieuw Project

```
1. SETUP (dag 1)
   □ Google Search Console koppelen
   □ sitemap.xml genereren en submitten
   □ robots.txt controleren
   □ Analytics koppelen (GA4 / Plausible)

2. PRE-LAUNCH CHECKLIST
   □ Lighthouse score > 90 op alle pagina's
   □ Alle H1's uniek en aanwezig
   □ Alle meta descriptions uniek (< 155 tekens)
   □ Canonical tags op alle pagina's
   □ Schema markup gevalideerd
   □ OG images aanwezig (1200x630px)
   □ HTTPS redirect actief
   □ Sitemap correct en volledig
   □ robots.txt: productie staat noindex NIET aan

3. POST-LAUNCH (eerste 30 dagen)
   □ Week 1: GSC controleren op crawl errors
   □ Week 2: Core Web Vitals in GSC bekijken
   □ Week 3: Indexering checken (site:jouwdomein.nl in Google)
   □ Week 4: Eerste rankingsdata bekijken
```

### 9.3 Lokale SEO (voor MKB-klanten)

```tsx
// Satellietsides voor meerdere locaties — jouw Slopkanon aanpak
const locationPages = [
  { city: 'purmerend', population: 82000 },
  { city: 'zaandam', population: 75000 },
  { city: 'hoorn', population: 72000 },
  { city: 'alkmaar', population: 108000 },
]

// Elke locatiepagina heeft:
// 1. Unieke content (niet alleen city-name vervangen)
// 2. LocalBusiness schema met juist adres
// 3. Lokale keywords: "webdesign [stad]"
// 4. Verwijzing naar lokale landmarks/contexte
```

---

## 10. 🧪 Performance Tests — Progressie Tracker

Gebruik deze checklists bij elk nieuw project om je SEO-niveau te meten.

---

### TEST 1 — Technische Basis (20 punten)

Score jezelf bij elke nieuwe website:

| Check | Punten | Jouw Score |
|-------|--------|-----------|
| robots.txt aanwezig en correct | 1 | /1 |
| sitemap.xml gegenereerd en gesubmit | 1 | /1 |
| HTTPS actief en http → https redirect | 1 | /1 |
| Geen noindex op productie (check header!) | 2 | /2 |
| Alle canonicals aanwezig | 1 | /1 |
| Unieke title per pagina (< 60 chars) | 2 | /2 |
| Unieke meta description (< 155 chars) | 2 | /2 |
| Precies 1x H1 per pagina | 1 | /1 |
| Heading hiërarchie correct (H1→H2→H3) | 1 | /1 |
| 0 broken links (intern) | 2 | /2 |
| 0 redirect chains (> 1 stap) | 1 | /1 |
| Open Graph tags aanwezig | 2 | /2 |
| lang="nl" op html element | 1 | /1 |
| favicon aanwezig | 1 | /1 |
| **TOTAAL** | **19** | **/19** |

**Score:**
- 17-19: ⭐⭐⭐⭐⭐ Expert niveau
- 14-16: ⭐⭐⭐⭐ Gevorderd
- 10-13: ⭐⭐⭐ Beginner-gevorderd
- < 10:   ⭐ Basis mist — herstel eerst

---

### TEST 2 — Core Web Vitals (25 punten)

Meten via **PageSpeed Insights** op mobiel:

| Metriek | Goed | Pts | Acceptabel | Pts | Slecht | Pts |
|---------|------|-----|-----------|-----|--------|-----|
| LCP | < 2.5s | 8 | 2.5-4s | 4 | > 4s | 0 |
| INP | < 200ms | 8 | 200-500ms | 4 | > 500ms | 0 |
| CLS | < 0.1 | 8 | 0.1-0.25 | 4 | > 0.25 | 0 |
| Lighthouse Score | > 90 | 1 | 70-90 | 0.5 | < 70 | 0 |

**Extra Checks:**
- [ ] +0 punt: next/image gebruikt voor alle afbeeldingen (verplicht)
- [ ] +0 punt: next/font gebruikt (verplicht)
- [ ] Bonus +1: Lighthouse score > 95

**Meten:**
```bash
# Gebruik Lighthouse CLI voor consistente resultaten
npx lighthouse https://jouwsite.nl --output=json --output-path=./lighthouse.json

# Of per pagina:
npx lighthouse https://jouwsite.nl/diensten --form-factor=mobile
```

---

### TEST 3 — Schema & Structured Data (20 punten)

| Check | Punten | Score |
|-------|--------|-------|
| LocalBusiness of Organization schema aanwezig | 3 | /3 |
| Schema valideert zonder errors in Rich Results Test | 3 | /3 |
| FAQ schema op FAQ-pagina of sectie | 2 | /2 |
| Article/BlogPosting schema op blogposts | 2 | /2 |
| Author schema op contentpagina's | 2 | /2 |
| Geen Schema Drift (JSON-LD ≠ zichtbare content) | 3 | /3 |
| BreadcrumbList schema aanwezig | 2 | /2 |
| sameAs links (LinkedIn, KVK, etc.) | 1 | /1 |
| Gevalideerd met schema.org/validator | 2 | /2 |
| **TOTAAL** | **20** | **/20** |

---

### TEST 4 — Content & Semantic SEO (15 punten)

| Check | Punten | Score |
|-------|--------|-------|
| Primair keyword in H1 | 1 | /1 |
| Primair keyword in meta title | 1 | /1 |
| Primair keyword in eerste 100 woorden | 1 | /1 |
| LSI/semantisch gerelateerde termen verwerkt | 2 | /2 |
| Zoekintentie matcht met pagina-type | 2 | /2 |
| Direct antwoord in eerste alinea (BLUF) | 2 | /2 |
| Content > 500 woorden (voor dienstpagina's) | 1 | /1 |
| Interne links vanuit pagina naar relevante content | 2 | /2 |
| Alt-tekst op alle afbeeldingen (beschrijvend) | 2 | /2 |
| Externe links naar authoritative bronnen | 1 | /1 |
| **TOTAAL** | **15** | **/15** |

---

### TEST 5 — Next.js & Technische Implementatie (10 punten)

| Check | Punten | Score |
|-------|--------|-------|
| SSG/ISR gebruikt (niet CSR voor indexeerbare content) | 2 | /2 |
| Metadata API correct geconfigureerd (App Router) | 2 | /2 |
| `priority` prop op above-the-fold images | 1 | /1 |
| Dynamic sitemap via next-sitemap | 1 | /1 |
| OG image gegenereerd (statisch of dynamisch) | 1 | /1 |
| Font geladen via next/font | 1 | /1 |
| Vercel analytics of Web Vitals monitoring actief | 2 | /2 |
| **TOTAAL** | **10** | **/10** |

---

### TEST 6 — GEO & AI Search Readiness (10 punten)

*(Geavanceerd — zie als bonus)*

| Check | Punten | Score |
|-------|--------|-------|
| robots.txt onderscheidt AI training bots vs. search bots | 2 | /2 |
| Content heeft directe antwoorden in eerste alinea | 2 | /2 |
| E-E-A-T signalen aanwezig (auteur, bedrijfsinfo) | 2 | /2 |
| Unieke data of inzichten die AI niet kan verzinnen | 2 | /2 |
| Content gestructureerd met lijsten & tabellen | 1 | /1 |
| Breadcrumbs aanwezig en functioneel | 1 | /1 |
| **TOTAAL** | **10** | **/10** |

---

### 📊 Totaalscore & Niveau

| Test | Max | Jouw Score |
|------|-----|-----------|
| 1. Technische Basis | 19 | /19 |
| 2. Core Web Vitals | 25 | /25 |
| 3. Schema & Structured Data | 20 | /20 |
| 4. Content & Semantic SEO | 15 | /15 |
| 5. Next.js Implementatie | 10 | /10 |
| 6. GEO & AI Readiness | 10 | /10 |
| **TOTAAL** | **99** | **/99** |

### Niveau-indeling

| Score | Niveau | Wat betekent dit |
|-------|--------|-----------------|
| 90-99 | 🏆 **SEO Expert** | Je kan klanten van A tot Z begeleiden |
| 75-89 | 🥇 **Senior Developer SEO** | Sterke basis, verfijn je AI-readiness |
| 55-74 | 🥈 **Gevorderd** | Techniek is goed, content en schema verdiepen |
| 35-54 | 🥉 **Beginner** | Focus eerst op Tests 1-3 |
| < 35  | 🔰 **Start hier** | Begin met de Technische Basis |

---

### 🔄 Gebruik dit als Sprint Checklist

Per nieuwe website:

```
SPRINT 1 (Dag 1-2):   Test 1 → Score 17/19 of hoger
SPRINT 2 (Dag 3):     Test 2 → Alle CWV in "Goed" zone
SPRINT 3 (Dag 4):     Test 3 → Schema gevalideerd
SPRINT 4 (Post-launch): Tests 4-6 → Iteratief verbeteren
```

---

## Appendix: Snelreferentie Cheatsheet

```
┌──────────────────────────────────────────────────────────┐
│                  SEO CHEATSHEET 2026                     │
├──────────────────────────────────────────────────────────┤
│ LCP      │ < 2.5s  │ priority img, AVIF, preload        │
│ INP      │ < 200ms │ startTransition, Server Components  │
│ CLS      │ < 0.1   │ img dimensions, next/font           │
├──────────────────────────────────────────────────────────┤
│ Title    │ < 60 chars │ Keyword eerst, merk achteraan   │
│ Desc     │ < 155 chars│ CTA + keyword                   │
│ H1       │ 1x per pagina │ Hoofdkeyword erin            │
├──────────────────────────────────────────────────────────┤
│ Canonical│ Altijd aanwezig op elke pagina               │
│ Sitemap  │ Automatisch via next-sitemap                 │
│ Schema   │ LocalBusiness + FAQ + Article minimum        │
├──────────────────────────────────────────────────────────┤
│ BLUF     │ Antwoord in de eerste zin → AI-citaties      │
│ E-E-A-T  │ Auteur, datum, bedrijfsinfo zichtbaar        │
│ AI bots  │ Block GPTBot, Allow OAI-SearchBot            │
└──────────────────────────────────────────────────────────┘
```

---

*Versie: 1.0 — Maart 2026 | Bronnen: Yotpo, The HOTH, Sitebulb, Next.js Docs, Google Search Central*
