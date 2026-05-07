import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t rule mt-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-12">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-3 h-3 bg-[var(--color-signal)]" />
            <span className="font-mono text-sm tracking-[0.18em] uppercase">Plot</span>
          </div>
          <p className="font-display text-2xl leading-tight">
            Verified pool leads.<br />A photo on every row.
          </p>
        </div>
        <FooterCol heading="Product" items={[
          { label: "Run a pilot", href: "/run" },
          { label: "How it works", href: "/#how" },
          { label: "Pricing", href: "/#pricing" },
          { label: "Sample inventory", href: "/#sample" },
        ]} />
        <FooterCol heading="Trust" items={[
          { label: "Imagery & privacy", href: "/imagery-privacy" },
          { label: "Refund promise", href: "/#refund" },
          { label: "FAQ", href: "/#faq" },
        ]} />
        <FooterCol heading="Contact" items={[
          { label: "hello@get-plot.com", href: "mailto:hello@get-plot.com" },
        ]} />
      </div>
      <div className="border-t rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p className="legend">
            Verified property data · $0.15 per lead · Photo on every row
          </p>
          <p className="legend">© 2026 Plot</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ heading, items }: { heading: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="legend mb-4">{heading}</h4>
      <ul className="space-y-2 text-sm">
        {items.map((it) => (
          <li key={it.href}>
            <Link href={it.href as any} className="hover:text-[var(--color-signal)]">
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
