import { Playfair_Display, Hind, Josefin_Sans } from "next/font/google";

/** Premium serif — used for product titles, section headings */
export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

/** Designed for Indian languages + Latin — used for all UI, body, navigation */
export const hind = Hind({
  subsets: ["latin", "devanagari"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap",
});

/** Geometric sans-serif — used for the main brand name hero display */
export const cinzel = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-cinzel",
  display: "swap",
});
