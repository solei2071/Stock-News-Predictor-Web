import type { Metadata } from "next";
import "./globals.css";
import AdSenseScript from "@/components/AdSenseScript";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

const googleVerification =
  process.env.GOOGLE_SITE_VERIFICATION || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined;
const googleAdsenseAccount =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT &&
  /^ca-pub-\d{10,}$/.test(process.env.NEXT_PUBLIC_ADSENSE_CLIENT)
    ? process.env.NEXT_PUBLIC_ADSENSE_CLIENT
    : "ca-pub-7431749331315224";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  verification: {
    google: googleVerification,
  },
  other: {
    "google-adsense-account": googleAdsenseAccount,
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    type: "website",
    siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <AdSenseScript />
      </head>
      <body className="antialiased min-h-screen text-slate-100">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
