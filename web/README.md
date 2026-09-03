# TechWokx Website

The public marketing site for TechWokx — built with Next.js 14 (App Router),
React 18, TypeScript and Tailwind CSS, matching the approved design mockups.

## Pages included

- `/` — Home (hero, scan bar, how-it-works, feature grid)
- `/about` — About Us (mission, philosophy, why TechWokx, team)
- `/solutions` — Solutions (6 outcome-based solutions, visitor journey)
- `/industries` — Industries (6 industry cards with sample assistants)
- `/pricing` — Pricing (Starter / Growth / Scale plans, AI journey)
- `/resources` — Resources (featured AI Website Scanner, Guides, Insights,
  Case Studies, newsletter signup)

Shared components: `Navbar` (with working dropdown menus for Product,
Solutions, Industries), `Footer`, `ScanBar` (URL input, used in hero + footer),
`CTABand` (the robot-mascot band repeated at the bottom of every page).

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Build for production

```bash
npm run build
npm run start
```

## Notes

- The URL scan form and newsletter form are UI-only right now — they don't
  call a backend yet. When you're ready to wire the AI Website Scanner up to
  a real analysis engine (or to your VPS), the input lives in
  `components/ScanBar.tsx`.
- The design uses the Inter font loaded via a `<link>` tag in
  `app/layout.tsx` (not `next/font/google`), so builds never depend on
  network access to Google Fonts — it falls back to system fonts
  automatically if that request is blocked.
- Colors, gradients and card styles are defined as design tokens in
  `tailwind.config.ts` and `app/globals.css` — change them once and the
  whole site updates.
- No environment variables are required to run the site as-is.

## Deploying

This is a standard Next.js app, so it deploys cleanly to Render, Vercel, or
any Node host. For Render specifically: create a Web Service pointed at this
repo with build command `npm run build` and start command `npm run start`.
