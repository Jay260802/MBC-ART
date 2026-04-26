export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-5 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} MBC ART. All rights reserved.
      </div>
    </footer>
  );
}
