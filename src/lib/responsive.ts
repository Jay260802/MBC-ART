/**
 * Responsive configuration — single source of truth for mobile vs desktop
 * behaviour decisions that can't be expressed purely with Tailwind classes.
 *
 * Breakpoints mirror Tailwind v4 defaults:
 *   sm  ≥ 640 px
 *   md  ≥ 768 px   ← primary mobile/desktop boundary in this project
 *   lg  ≥ 1024 px
 *   xl  ≥ 1280 px
 *
 * Tailwind class conventions used project-wide:
 *   "md:hidden"       → visible on mobile only
 *   "hidden md:block" → visible on desktop only
 *   "pb-16 md:pb-0"   → bottom padding for BottomNav on mobile, none on desktop
 */

/**
 * Collections gallery — how many preview images to show per category
 * in the "All" view (before a "View all" link appears).
 *
 * Implementation: render DESKTOP count, hide extras on mobile via CSS.
 * @see CollectionsPageClient.tsx → idx >= COLLECTION_PREVIEW.mobile → "hidden sm:block"
 */
export const COLLECTION_PREVIEW = {
  /** Images shown on mobile (< sm = < 640 px), grid is 2 columns → even rows */
  mobile: 4,
  /** Images shown on desktop (≥ sm), grid is 3–5 columns */
  desktop: 5,
} as const;
