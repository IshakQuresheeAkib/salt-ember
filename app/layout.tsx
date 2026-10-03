import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Yeon_Sung } from "next/font/google";
import type { ReactNode } from "react";

import { siteConfig, siteOrigin } from "@/lib/constants/site";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const titleFont = Yeon_Sung({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-title",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B2228" },
    { media: "(prefers-color-scheme: light)", color: "#0B2228" },
  ],
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: siteOrigin,
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "restaurant",
  classification: "Restaurant & Dining",
  formatDetection: {
    telephone: true,
    email: false,
    address: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-BD": "/",
      en: "/",
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.ico", sizes: "any" }],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - ${siteConfig.tagline}`,
        type: "image/png",
      },
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: `${siteConfig.name} Emblem`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - ${siteConfig.tagline}`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const restaurantStructuredData = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": `${siteConfig.url}/#restaurant`,
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  image: `${siteConfig.url}/og-image.png`,
  logo: `${siteConfig.url}/logo.png`,
  telephone: siteConfig.contact.telephoneRaw,
  priceRange: "$$",
  servesCuisine: [
    "Fire-led Cooking",
    "Wood-fired Grill",
    "Steakhouse",
    "Artisanal",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.location.streetAddress,
    addressLocality: siteConfig.location.addressLocality,
    addressRegion: siteConfig.location.addressRegion,
    postalCode: siteConfig.location.postalCode,
    addressCountry: siteConfig.location.addressCountry,
  },
  hasMap: siteConfig.location.mapUrl,
  sameAs: [
    siteConfig.social.facebook,
    siteConfig.social.instagram,
    siteConfig.contact.whatsappUrl,
  ],
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${titleFont.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(restaurantStructuredData),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
