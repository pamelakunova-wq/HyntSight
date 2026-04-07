import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/dashboard", "/studio", "/settings", "/billing"] },
    sitemap: "https://hyntsight.com/sitemap.xml",
  };
}
