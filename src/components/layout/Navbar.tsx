"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-center px-4">
        <Link href="/" onClick={handleLogoClick} className="shrink-0">
          <Image
            src="/logo.png"
            alt="MBC ART"
            width={489}
            height={532}
            className="h-11 w-auto filter-[brightness(0.6)_saturate(1.8)_drop-shadow(0_1px_6px_rgba(192,133,82,0.5))] dark:filter-none"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
