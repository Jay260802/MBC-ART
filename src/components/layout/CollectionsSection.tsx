"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "motion/react";
import type { CollectionCategory } from "@/lib/collections";
import { ArrowRight } from "lucide-react";

const textVariants = (fromLeft: boolean): Variants => ({
  hidden: { opacity: 0, x: fromLeft ? -80 : 80 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.85, ease: "easeOut" },
  },
});

const imageVariants = (fromLeft: boolean): Variants => ({
  hidden: { opacity: 0, x: fromLeft ? -60 : 60, scale: 0.96 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.9, ease: "easeOut", delay: 0.15 },
  },
});

const numberVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

interface Props {
  categories: CollectionCategory[];
}

export function CollectionsSection({ categories }: Props) {
  return (
    <section className="w-full">

      {/* One fullscreen-ish panel per category */}
      {categories.map((cat, index) => {
        const imageOnLeft = index % 2 !== 0;
        const isFirst = index === 0;

        return (
          <div
            key={cat.value}
            className="min-h-[90vh] flex items-center border-t last:border-b"
          >
            <div
              className={`container mx-auto max-w-6xl px-4 py-16 flex flex-col gap-10 md:gap-0 ${
                imageOnLeft ? "md:flex-row-reverse" : "md:flex-row"
              } items-center`}
            >
              {/* ── Text side ── */}
              <motion.div
                className="flex-1 space-y-6 relative"
                variants={textVariants(!imageOnLeft)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.15 }}
              >
                {/* Big background number */}
                <motion.span
                  variants={numberVariants}
                  className="absolute -top-8 -left-2 text-[7rem] font-black leading-none text-foreground/5 select-none pointer-events-none"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </motion.span>

                <div className="relative space-y-3">
                  {/* Section label — only on first panel */}
                  {isFirst && (
                    <div className="mb-6 space-y-0.5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                        What We Offer
                      </p>
                      <h2 className="text-3xl font-bold">Our Collections</h2>
                    </div>
                  )}

                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-accent">
                    Collection {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3
                    className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-none"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {cat.label}
                  </h3>
                  <p className="text-base text-muted-foreground max-w-sm leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <Link
                  href={`/collections?category=${cat.value}`}
                  className="inline-flex items-center gap-3 group"
                >
                  <span className="text-sm font-semibold tracking-wide uppercase text-foreground group-hover:text-primary transition-colors">
                    View Collection
                  </span>
                  <span className="flex items-center justify-center h-10 w-10 rounded-full border-2 border-foreground group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </motion.div>

              {/* ── Image side ── */}
              <motion.div
                className="flex-1 w-full"
                variants={imageVariants(imageOnLeft)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.15 }}
              >
                <div
                  className={`relative aspect-4/5 max-h-[70vh] overflow-hidden rounded-2xl ${
                    imageOnLeft ? "md:mr-12" : "md:ml-12"
                  }`}
                >
                  {cat.images[0] ? (
                    <Image
                      src={cat.images[0].src}
                      alt={cat.label}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-muted flex items-center justify-center">
                      <span
                        className="text-[clamp(3rem,10vw,6rem)] font-bold text-foreground/5 select-none"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {cat.label.split(" ")[0]}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        );
      })}

      {/* See all CTA */}
      <div className="container mx-auto max-w-6xl px-4 py-16 text-center border-t">
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 rounded-full border px-8 py-3 text-sm font-medium transition-colors hover:bg-muted"
        >
          Browse All Collections <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
