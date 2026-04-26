"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { whatsappLink } from "@/lib/contact";
import { ArrowRight, ImageOff, ChevronRight, Home } from "lucide-react";
import type { CollectionCategory } from "@/lib/collections";
import { ContactCTA } from "@/components/layout/ContactCTA";
import { COLLECTION_PREVIEW } from "@/lib/responsive";

/* ── Variants ────────────────────────────────────────────────────────────── */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

const tabsContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
};

const tabItem: Variants = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const headingContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};


/* ── Props ───────────────────────────────────────────────────────────────── */

interface Props {
  allCategories: CollectionCategory[];
  activeCategories: CollectionCategory[];
  category?: string;
}

/* ── Component ───────────────────────────────────────────────────────────── */

export function CollectionsPageClient({ allCategories, activeCategories, category }: Props) {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-10">

      {/* Desktop breadcrumb — hidden on mobile (BottomNav handles home nav there) */}
      <nav className="hidden md:flex items-center gap-1.5 mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
          <Home className="h-3.5 w-3.5" />
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <span className="text-foreground font-medium">Collections</span>
      </nav>

      {/* Header */}
      <motion.div
        className="mb-8 space-y-1"
        initial="hidden"
        animate="show"
        variants={staggerContainer}
      >
        <motion.p variants={fadeLeft} className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          MBC ART
        </motion.p>
        <motion.h1 variants={fadeUp} className="text-3xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
          Our Collections
        </motion.h1>
        <motion.p variants={fadeUp} className="text-sm text-muted-foreground">
          Browse our range and contact us to order.
        </motion.p>
      </motion.div>

      {/* Filter tabs */}
      <motion.div
        className="mb-10 flex flex-wrap gap-2"
        initial="hidden"
        animate="show"
        variants={tabsContainer}
      >
        <motion.div variants={tabItem}>
          <Link
            href="/collections"
            className={[
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              !category
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background hover:bg-muted",
            ].join(" ")}
          >
            All
          </Link>
        </motion.div>
        {allCategories.map((cat) => (
          <motion.div key={cat.value} variants={tabItem}>
            <Link
              href={`/collections?category=${cat.value}`}
              className={[
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                category === cat.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background hover:bg-muted",
              ].join(" ")}
            >
              {cat.label}
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Gallery */}
      <div className="space-y-16">
        {activeCategories.map((cat, sectionIdx) => (
          <motion.section
            key={cat.value}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.08 }}
            variants={fadeUp}
          >
            {/* Section heading — All view only */}
            {!category && (
              <motion.div
                className="mb-6"
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.3 }}
                variants={headingContainer}
              >
                <motion.div
                  variants={fadeLeft}
                  className="flex items-center gap-3 mb-1"
                >
                  <motion.span
                    className="text-[10px] font-semibold uppercase tracking-[0.4em] text-accent"
                    variants={fadeLeft}
                  >
                    Collection {String(sectionIdx + 1).padStart(2, "0")}
                  </motion.span>
                  {/* Drawn line */}
                  <motion.div
                    className="h-px bg-border flex-1 max-w-15"
                    initial={{ scaleX: 0, originX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                  />
                </motion.div>
                <motion.h2
                  variants={fadeUp}
                  className="text-xl font-bold"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {cat.label}
                </motion.h2>
                <motion.p variants={fadeUp} className="text-sm text-muted-foreground mt-0.5">
                  {cat.description}
                </motion.p>
              </motion.div>
            )}

            {cat.images.length > 0 ? (
              <div className="space-y-4">
                <motion.div
                  className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: false, amount: 0.05 }}
                >
                  {(category ? cat.images : cat.images.slice(0, COLLECTION_PREVIEW.desktop)).map((img, idx) => (
                    <motion.div
                      key={idx}
                      variants={staggerItem}
                      className={`group relative aspect-3/4 overflow-hidden rounded-xl border bg-muted${idx >= COLLECTION_PREVIEW.mobile ? " hidden sm:block" : ""}`}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        priority={sectionIdx === 0 && idx === 0}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </motion.div>
                  ))}
                </motion.div>

                {!category && cat.images.length > COLLECTION_PREVIEW.desktop && (
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <Link
                      href={`/collections?category=${cat.value}`}
                      className="inline-flex items-center gap-1.5 rounded-full border px-5 py-2 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      View all <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </motion.div>
                )}
              </div>
            ) : (
              <motion.div
                className="flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed border-border bg-muted/30 px-8 py-16 text-center"
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ImageOff className="h-8 w-8 text-muted-foreground/40" />
                </motion.div>
                <div className="space-y-1.5">
                  <p className="font-semibold text-foreground">{cat.label} — coming soon</p>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    New pieces are on their way. Contact us for current stock and pricing.
                  </p>
                </div>
                <a
                  href={whatsappLink(`Hi! I'm interested in your ${cat.label} collection at MBC ART.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/50 bg-[#25D366]/8 px-5 py-2 text-sm font-semibold text-[#20a855] transition-colors hover:bg-[#25D366]/15"
                >
                  Ask about {cat.label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </motion.div>
            )}
          </motion.section>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        className="mt-16 rounded-2xl bg-primary/5 border border-primary/10 p-8 text-center space-y-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.3 }}
        variants={fadeUp}
      >
        <motion.h3
          variants={fadeUp}
          className="text-xl font-bold"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Like what you see?
        </motion.h3>
        <motion.p variants={fadeUp} className="text-sm text-muted-foreground max-w-sm mx-auto">
          For pricing, availability, and wholesale orders — reach us directly.
        </motion.p>
        <motion.div variants={fadeUp}>
          <ContactCTA variant="buttons" />
        </motion.div>
      </motion.div>
    </div>
  );
}
