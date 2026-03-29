import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
}

const SITE_NAME = "Label & Lens";
const SITE_URL = "https://www.labelenlens.nl";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

function setMeta(name: string, content: string, property = false) {
  const attr = property ? "property" : "name";
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setJsonLd(data: Record<string, unknown> | Record<string, unknown>[]) {
  let el = document.querySelector<HTMLScriptElement>('script[data-seo="jsonld"]');
  if (!el) {
    el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("data-seo", "jsonld");
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeJsonLd() {
  const el = document.querySelector('script[data-seo="jsonld"]');
  if (el) el.remove();
}

export function useSEO({
  title,
  description,
  canonical,
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
  jsonLd,
  noIndex = false,
}: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    setMeta("description", description);
    setMeta("robots", noIndex ? "noindex,nofollow" : "index,follow");

    const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
    setCanonical(canonicalUrl);

    setMeta("og:site_name", SITE_NAME, true);
    setMeta("og:type", ogType, true);
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:url", canonicalUrl, true);
    setMeta("og:image", ogImage, true);
    setMeta("og:locale", "nl_NL", true);

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);

    if (jsonLd) {
      setJsonLd(jsonLd);
    } else {
      removeJsonLd();
    }
  }, [title, description, canonical, ogType, ogImage, jsonLd, noIndex]);
}
