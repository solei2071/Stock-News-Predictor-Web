import type { Metadata } from "next";
import "./globals.css";
import AdSenseScript from "@/components/AdSenseScript";

export const metadata: Metadata = {
  title: "Stock News Predictor",
  description: "Stock price forecast based on financial news sentiment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0b1220] text-slate-100 min-h-screen">
        <AdSenseScript />
        {children}
      </body>
    </html>
  );
}
