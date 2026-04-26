export interface CollectionImage {
  src: string;
  alt: string;
}

export interface CollectionCategory {
  value: string;
  label: string;
  description: string;
  images: CollectionImage[];
}

/**
 * Category metadata — safe to import on client and server.
 * Images are NOT stored here; they are read from disk at build/request time
 * by `collections-server.ts` using fs.readdirSync.
 *
 * To add a new category:
 *   1. Add an entry here
 *   2. Create the folder  public/collections/{value}/
 *   3. Drop images into that folder — they appear automatically
 */
export const CATEGORIES: Omit<CollectionCategory, "images">[] = [
  {
    value: "kurtis",
    label: "Kurtis",
    description: "Elegant everyday kurtis and festive anarkalis in premium fabrics",
  },
  {
    value: "suits",
    label: "Suits",
    description: "2-piece and 3-piece coordinated ethnic suit sets",
  },
  {
    value: "co-ords",
    label: "Co-ords",
    description: "Matching co-ordinated sets for a put-together modern ethnic look",
  },
  {
    value: "tunics",
    label: "Tunics",
    description: "Versatile long tops — pair with jeans, leggings, or palazzos",
  },
];
