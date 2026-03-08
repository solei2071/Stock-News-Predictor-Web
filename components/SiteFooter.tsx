import Link from "next/link";
import { contactEmail } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-slate-800/60">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="font-['Sora'] text-lg font-semibold text-slate-100">Market Pulse</p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
              Market Pulse publishes educational stock research pages that explain how each signal is built from price
              history, recent headlines, and volatility-aware ranges. The site is designed to add context, not replace
              independent due diligence.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-400">
            <Link href="/about" className="transition-colors hover:text-slate-200">
              About
            </Link>
            <Link href="/methodology" className="transition-colors hover:text-slate-200">
              Methodology
            </Link>
            <Link href="/editorial-policy" className="transition-colors hover:text-slate-200">
              Editorial Policy
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-slate-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-slate-200">
              Terms of Service
            </Link>
            {contactEmail ? (
              <a href={`mailto:${contactEmail}`} className="transition-colors hover:text-slate-200">
                Contact
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/60 pt-5 text-[12px] text-slate-500">
          <p>© {new Date().getFullYear()} Market Pulse. Educational content only, not financial advice.</p>
          <p>Use of this site remains subject to market risk, source availability, and service uptime.</p>
        </div>
      </div>
    </footer>
  );
}
