import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://flipamsterdam.nl"),
  title: {
    default: "FLIP Amsterdam - Energielabels Amsterdam | Snel & Betrouwbaar",
    template: "%s | FLIP Amsterdam",
  },
  description:
    "Professionele energielabels in Amsterdam. Binnen 5 werkdagen geleverd, gecertificeerd volgens BRL9500. Ook puntentellingen en adviesrapporten. Vraag direct een offerte aan!",
  keywords:
    "energielabel Amsterdam, energielabel aanvragen, puntentelling huurwoning, WWS puntentelling, energielabel kosten, BRL9500, verduurzaming advies, energielabel verplicht",
  authors: [{ name: "FLIP Amsterdam" }],
  creator: "FLIP Amsterdam",
  publisher: "FLIP Amsterdam",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://flipamsterdam.nl",
    siteName: "FLIP Amsterdam",
    title: "FLIP Amsterdam - Energielabels Amsterdam | Snel & Betrouwbaar",
    description:
      "Professionele energielabels in Amsterdam. Binnen 5 werkdagen geleverd, gecertificeerd volgens BRL9500. Ook puntentellingen en adviesrapporten.",
    images: [
      {
        url: "/images/new-amsterdam-canal.png",
        width: 1200,
        height: 630,
        alt: "FLIP Amsterdam - Energielabels Amsterdam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FLIP Amsterdam - Energielabels Amsterdam",
    description:
      "Professionele energielabels in Amsterdam. Binnen 5 werkdagen geleverd, gecertificeerd volgens BRL9500.",
    images: ["/images/new-amsterdam-canal.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "jouw-google-verification-code-hier", // Vervang dit met je echte code
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <head>
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="jouw-google-verification-code-hier" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Additional SEO Meta Tags */}
        <meta name="geo.region" content="NL-NH" />
        <meta name="geo.placename" content="Amsterdam" />
        <meta name="geo.position" content="52.3676;4.9041" />
        <meta name="ICBM" content="52.3676, 4.9041" />

        {/* Local Business Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "FLIP Amsterdam",
              description: "Professionele energielabel diensten in Amsterdam",
              url: "https://flipamsterdam.nl",
              telephone: "020-123-4567",
              email: "info@flipamsterdam.nl",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Amsterdam",
                addressRegion: "Noord-Holland",
                addressCountry: "NL",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "52.3676",
                longitude: "4.9041",
              },
              openingHours: ["Mo-Fr 09:00-17:00"],
              serviceArea: {
                "@type": "GeoCircle",
                geoMidpoint: {
                  "@type": "GeoCoordinates",
                  latitude: "52.3676",
                  longitude: "4.9041",
                },
                geoRadius: "25000",
              },
              priceRange: "€199-€279",
              paymentAccepted: "Cash, Credit Card, Bank Transfer",
              currenciesAccepted: "EUR",
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
