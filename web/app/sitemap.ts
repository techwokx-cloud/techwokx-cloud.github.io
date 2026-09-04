import type { MetadataRoute } from "next";

const SITE_URL = "https://techwokx.online";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    { path: "", priority: 1 },
    { path: "/solutions", priority: 0.9 },
    { path: "/industries", priority: 0.9 },
    { path: "/pricing", priority: 0.9 },
    { path: "/about", priority: 0.7 },
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route.priority,
  }));
}
