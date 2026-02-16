import type { Metadata } from "next";
import "./globals.css";
import AdSenseScript from "@/components/AdSenseScript";

export const metadata: Metadata = {
  title: "Market Pulse",
  description: "News-backed stock forecasting and sentiment analysis with interactive charts.",
  openGraph: {
    title: "Market Pulse",
    description: "News-backed stock forecasting and sentiment analysis with interactive charts.",
    type: "website",
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
        {children}
      </body>
    </html>
  );
}
