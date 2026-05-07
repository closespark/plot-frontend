import Link from "next/link";

export function Header() {
  return (
    <header className="border-b rule sticky top-0 bg-[var(--color-paper)] z-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3">
          <span className="block w-3 h-3 bg-[var(--color-signal)]" />
          <span className="font-mono text-sm tracking-[0.18em] uppercase">
            Plot
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 legend">
          <Link href="/#how" className="hover:text-[var(--color-ink)]">How it works</Link>
          <Link href={"/pricing" as any} className="hover:text-[var(--color-ink)]">Pricing</Link>
          <Link href={"/proof" as any} className="hover:text-[var(--color-ink)]">Proof</Link>
        </nav>
        <Link href={"/start" as any} className="btn-ink">
          Start free trial →
        </Link>
      </div>
    </header>
  );
}
