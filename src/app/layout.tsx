import type { Metadata } from "next";
import "./globals.css";
import { playfair, hind, cinzel } from "@/lib/fonts";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: {
    default: "MBC ART — Indian Women's Ethnic Wear",
    template: "%s | MBC ART",
  },
  description:
    "Authentic Indian ethnic wear — Kurtis, Leggings, Two-Piece & Three-Piece Suits. Browse our collections and contact us to order.",
  keywords: ["ethnic wear", "kurti", "leggings", "indian fashion", "surat", "wholesale"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${hind.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground font-sans">
        <ThemeProvider>
          {/*
           * overflow-x-clip is on this inner div — NOT on body.
           * Keeping it off body ensures position:fixed (BottomNav) works
           * correctly on iOS Safari, which breaks fixed elements when
           * overflow is set on body/html.
           */}
          <div className="flex flex-col min-h-screen overflow-x-clip">
            <Navbar />
            <main className="flex-1 pb-16 md:pb-0">
              {children}
            </main>
            <Footer />
          </div>
          {/* BottomNav is a sibling of the overflow container, not inside it */}
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
