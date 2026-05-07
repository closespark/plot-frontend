import Link from "next/link";

export function Header() {
  return (
    <header className="border-b rule">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3">
          <span className="block w-3 h-3 bg-[var(--color-signal)]" />
          <span className="font-mono text-sm tracking-[0.18em] uppercase">
            Plot
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 legend">
          <Link href="/run" className="hover:text-[var(--color-ink)]">Run a Pilot</Link>
          <Link href="/#how" className="hover:text-[var(--color-ink)]">How it works</Link>
          <Link href="/#pricing" className="hover:text-[var(--color-ink)]">Pricing</Link>
          <Link href="/imagery-privacy" className="hover:text-[var(--color-ink)]">Imagery</Link>
        </nav>
        <Link href="/run" className="btn-ink">
          Get access →
        </Link>
      </div>
    </header>
  );
}
