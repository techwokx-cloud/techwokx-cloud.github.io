import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TechWokx — AI For Your Website",
  description:
    "TechWokx scans your website, uncovers AI opportunities, and turns it into an intelligent business engine — without a rebuild.",
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

