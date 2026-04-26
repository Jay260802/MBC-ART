import Link from "next/link";
import { CollectionsSection } from "@/components/layout/CollectionsSection";
import { ContactCTA } from "@/components/layout/ContactCTA";
import { CONTACT } from "@/lib/contact";
import { getCollections } from "@/lib/collections-server";
import { ArrowRight, MapPin, Gem, Leaf, Users } from "lucide-react";

export default function HomePage() {
  const categories = getCollections();
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center px-4 text-center">
        <div className="max-w-3xl space-y-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.5em] text-accent">
            Authentic Indian Women&apos;s Wear
          </p>
          <h1
            className="text-[clamp(3.5rem,15vw,8rem)] font-normal leading-none tracking-widest text-primary"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            MBC ART
          </h1>
          <div className="flex items-center justify-center gap-4 text-muted-foreground">
            <div className="h-px w-12 bg-border" />
            <span className="text-[11px] tracking-widest uppercase">Since 2014</span>
            <div className="h-px w-12 bg-border" />
          </div>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed tracking-wide">
            Kurtis · Suits · Co-ords · Tunics
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Browse Collections
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <div className="border-t" />

      {/* ── Collections ──────────────────────────────────────────────────── */}
      <CollectionsSection categories={categories} />

      {/* ── Why MBC ART ──────────────────────────────────────────────────── */}
      <section className="border-t bg-muted/40">
        <div className="container mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-10">Why Choose Us</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              {
                icon: Gem,
                title: "Premium Quality",
                desc: "Carefully selected fabrics and expert finishing on every piece.",
              },
              {
                icon: Leaf,
                title: "100% Authentic",
                desc: "Genuine Indian ethnic wear — no compromise on tradition or craft.",
              },
              {
                icon: Users,
                title: "Manufacturer & Wholesaler",
                desc: "We manufacture and supply in bulk — direct from source, no middlemen.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center gap-4 rounded-2xl border bg-card p-7"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────── */}
      <section id="contact" className="container mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="space-y-2 mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground">
            Get in Touch
          </p>
          <h2 className="text-3xl font-bold">Interested? Contact Us</h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            For pricing, availability, or wholesale orders — reach us directly.
          </p>
        </div>

        <ContactCTA variant="cards" />

        <a
          href={CONTACT.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex items-start justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors max-w-xs mx-auto text-center"
        >
          <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          {CONTACT.address}
        </a>
      </section>
    </>
  );
}
