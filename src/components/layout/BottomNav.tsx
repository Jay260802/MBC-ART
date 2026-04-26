"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3x3 } from "lucide-react";
import { whatsappLink } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/collections", label: "Collections", icon: Grid3x3 },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 p-2 min-w-16 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}

        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 p-2 min-w-16 text-[#25D366] transition-opacity hover:opacity-80"
        >
          <WhatsAppIcon className="h-5 w-5 fill-[#25D366] text-[#25D366]" />
          <span className="text-[10px] font-medium">WhatsApp</span>
        </a>
      </div>
    </nav>
  );
}
