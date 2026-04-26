import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/collections";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const collectionUrls = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/collections?category=${cat.value}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${BASE_URL}/collections`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    ...collectionUrls,
  ];
}
