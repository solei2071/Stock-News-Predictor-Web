"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSenseUnitProps {
  slot?: string;
  className?: string;
  label?: string;
}

export default function AdSenseUnit({ slot, className, label = "Advertisement" }: AdSenseUnitProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const adSlot = slot || process.env.NEXT_PUBLIC_ADSENSE_SLOT;

  useEffect(() => {
    if (clientId && adSlot && typeof window !== "undefined") {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // ignore
      }
    }
  }, [clientId, adSlot]);

  if (!clientId || !adSlot) {
    return (
      <div className={`glass-card p-4 ${className || ""}`}>
        <p className="text-xs text-slate-500">{label} is not configured.</p>
      </div>
    );
  }

  return (
    <section className={`glass-card p-4 ${className || ""}`}>
      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400 mb-2">Advertisement</p>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </section>
  );
}
