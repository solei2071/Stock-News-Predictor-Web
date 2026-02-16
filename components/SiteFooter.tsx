import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-slate-800 pt-6 pb-10">
      <div className="text-xs text-slate-500 flex flex-wrap gap-4">
        <Link href="/privacy" className="hover:text-slate-300 transition-colors">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:text-slate-300 transition-colors">
          Terms of Service
        </Link>
        <a
          href="mailto:hello@example.com"
          className="hover:text-slate-300 transition-colors"
        >
          Contact
        </a>
      </div>
      <p className="mt-4 text-[11px] text-slate-600 max-w-4xl">
        This service provides educational reference data only and does not provide financial advice.
      </p>
      <p className="mt-2 text-[11px] text-slate-700">
        Use of this site and all content is subject to market risk and service availability.
      </p>
    </footer>
  );
}
