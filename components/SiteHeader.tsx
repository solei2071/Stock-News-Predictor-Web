import Link from "next/link";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/methodology", label: "Methodology" },
  { href: "/editorial-policy", label: "Editorial Policy" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-800/60 bg-slate-950/20 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">Market Research</p>
          <p className="font-['Sora'] text-lg font-semibold tracking-[-0.02em] text-slate-100">
            Market Pulse
          </p>
          <p className="mt-1 max-w-xl text-sm text-slate-400">
            Explainable stock analysis built from price history, recent headlines, and risk bands.
          </p>
        </Link>

        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-slate-800/70 px-3 py-1.5 transition hover:border-cyan-500/40 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

