import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://techwokx.online";
const OG_IMAGE = `${SITE_URL}/og-image.png`;
const DEFAULT_DESCRIPTION =
  "TechWokx scans your website, uncovers AI opportunities, and turns it into an intelligent business engine — AI sales, support, booking and knowledge agents added to your existing site, without a rebuild.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TechWokx — AI For Your Website",
    template: "%s | TechWokx",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "AI website assistant",
    "AI for business websites",
    "website AI retrofit",
    "AI sales agent",
    "AI customer support agent",
    "website readiness score",
    "AI website scanner",
    "TechWokx",
    "Ghana AI agency",
    "Accra web AI",
  ],
  applicationName: "TechWokx",
  authors: [{ name: "TechWokx" }],
  creator: "TechWokx",
  publisher: "TechWokx",
  category: "Technology",
  alternates: {
    canonical: "/",
  },
  verification: {
    other: {
      "msvalidate.01": "278BD81BD4CD151DD7EC2F1DEDA2C0CA",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "TechWokx",
    title: "TechWokx — AI For Your Website",
    description: DEFAULT_DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "TechWokx — Your Website. Now Intelligent.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TechWokx — AI For Your Website",
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TechWokx",
  url: SITE_URL,
  logo: `${SITE_URL}/Techwokx_Logo_full_final.png`,
  description: DEFAULT_DESCRIPTION,
  email: "hello@techwokx.com",
  telephone: "+233201234567",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Accra",
    addressCountry: "GH",
  },
  sameAs: [],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TechWokx",
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Inter loaded via stylesheet link (not next/font) so builds never
            depend on network access to Google Fonts; falls back to system
            fonts automatically if this is blocked or offline. */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-ink text-white">
        {/* Shared gradient defs so icons across the site (marketing +
            dashboard) can use stroke={"url(#icon-gradient)"} to match the
            mockups' gradient line-icon style. */}
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <defs>
            <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
        </svg>
        {children}
      </body>
    </html>
  );
}

