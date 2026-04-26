"use client";

import { CONTACT, whatsappLink } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { Phone, Mail, ArrowRight } from "lucide-react";

interface Props {
  /** Optional WhatsApp pre-fill message */
  message?: string;
  /** Layout variant — "cards" for home page, "buttons" for collections CTA */
  variant?: "cards" | "buttons";
}

/**
 * Shared contact CTA rendered on both the home page and the collections page.
 * Keeps phone/email/WhatsApp links in one place so they don't drift.
 */
export function ContactCTA({ message, variant = "buttons" }: Props) {
  if (variant === "cards") {
    return (
      <div className="space-y-3">
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-2xl border bg-card px-5 py-4 text-left transition-shadow hover:shadow-sm hover:border-[#25D366]/40"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10">
            <WhatsAppIcon className="h-5 w-5 fill-[#25D366]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">WhatsApp</p>
            <p className="text-xs text-muted-foreground truncate">{CONTACT.whatsappDisplay}</p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
        </a>

        <a
          href={`tel:${CONTACT.phone}`}
          className="flex items-center gap-4 rounded-2xl border bg-card px-5 py-4 text-left transition-shadow hover:shadow-sm hover:border-primary/30"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/8">
            <Phone className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Phone</p>
            <p className="text-xs text-muted-foreground truncate">{CONTACT.phoneDisplay}</p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
        </a>

        <a
          href={`mailto:${CONTACT.email}`}
          className="flex items-center gap-4 rounded-2xl border bg-card px-5 py-4 text-left transition-shadow hover:shadow-sm hover:border-primary/30"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/8">
            <Mail className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Email</p>
            <p className="text-xs text-muted-foreground truncate">{CONTACT.email}</p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <WhatsAppIcon className="h-4 w-4 fill-white text-white" />
        WhatsApp
      </a>
      <a
        href={`tel:${CONTACT.phone}`}
        className="inline-flex items-center gap-2 rounded-full bg-[#1A73E8] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <Phone className="h-4 w-4" />
        Call Us
      </a>
      <a
        href={`mailto:${CONTACT.email}`}
        className="inline-flex items-center gap-2 rounded-full bg-[#EA4335] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <Mail className="h-4 w-4" />
        Email Us
      </a>
    </div>
  );
}
