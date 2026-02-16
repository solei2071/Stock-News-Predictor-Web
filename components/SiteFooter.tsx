import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-10 border border-slate-800/50 rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 text-[12px]">
        <div className="text-slate-400">© {new Date().getFullYear()} Market Pulse</div>
        <div className="text-slate-400 flex flex-wrap gap-4">
          <Link href="/privacy" className="hover:text-slate-200 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-slate-200 transition-colors">
            Terms of Service
          </Link>
          <a
            href="mailto:hello@example.com"
            className="hover:text-slate-200 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
      <p className="mt-4 text-[11px] text-slate-500 max-w-4xl">
        This service provides educational reference data only and does not provide financial advice.
      </p>
      <p className="mt-2 text-[11px] text-slate-700">
        Use of this site and all content is subject to market risk and service availability.
      </p>
    </footer>
  );
}
