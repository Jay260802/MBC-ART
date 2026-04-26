import "server-only";
import fs from "fs";
import path from "path";
import type { CollectionCategory } from "./collections";
import { CATEGORIES } from "./collections";

const SUPPORTED = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

/**
 * Reads each category's image folder from public/collections/{value}/ and
 * returns the full CollectionCategory array with real image paths.
 *
 * - Called only from server components (layout / page).
 * - Results are passed down as props to client components — no fs on the client.
 * - Missing or empty folders produce an empty images array, which triggers the
 *   "coming soon" state in the UI automatically.
 *
 * To add images: drop files into public/collections/{category}/ and redeploy.
 * Files are sorted alphabetically so numbering controls display order (001.jpg, 002.jpg…).
 */
export function getCollections(): CollectionCategory[] {
  return CATEGORIES.map((cat) => {
    const dir = path.join(process.cwd(), "public", "collections", cat.value);
    let images: CollectionCategory["images"] = [];

    try {
      images = fs
        .readdirSync(dir)
        .filter((file) => SUPPORTED.has(path.extname(file).toLowerCase()))
        .sort()
        .map((file) => ({
          src: `/collections/${cat.value}/${file}`,
          alt: `${cat.label} — ${path.basename(file, path.extname(file)).replace(/[-_]/g, " ")}`,
        }));
    } catch {
      // Folder missing or unreadable — "coming soon" state shown instead
    }

    return { ...cat, images };
  });
}
