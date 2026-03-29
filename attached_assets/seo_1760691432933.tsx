import Head from "next/head"

interface SEOProps {
  title: string
  description: string
  keywords?: string
  canonicalUrl?: string
  ogImage?: string
  ogType?: string
  structuredData?: object
  noindex?: boolean
}

export function SEO({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = "/images/new-amsterdam-canal.png",
  ogType = "website",
  structuredData,
  noindex = false,
}: SEOProps) {
  const fullTitle = title.includes("FLIP Amsterdam") ? title : `${title} | FLIP Amsterdam - Energielabels Amsterdam`
  const baseUrl = "https://flipamsterdam.nl"
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl
  const fullOgImage = ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content="FLIP Amsterdam" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="nl" />
      <meta name="language" content="Dutch" />

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:site_name" content="FLIP Amsterdam" />
      <meta property="og:locale" content="nl_NL" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#84cc16" />
      <meta name="msapplication-TileColor" content="#84cc16" />

      {/* Geo Tags for Local SEO */}
      <meta name="geo.region" content="NL-NH" />
      <meta name="geo.placename" content="Amsterdam" />
      <meta name="geo.position" content="52.3676;4.9041" />
      <meta name="ICBM" content="52.3676, 4.9041" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      )}
    </Head>
  )
}
