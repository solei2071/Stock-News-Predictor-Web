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
  enabled?: boolean;
}

function isValidClientId(clientId?: string) {
  return Boolean(clientId && /^ca-pub-\d{10,}$/.test(clientId));
}

function isValidSlot(slot?: string) {
  return Boolean(slot && /^\d+$/.test(slot));
}

export default function AdSenseUnit({
  slot,
  className,
  label = "Advertisement",
  enabled = true,
}: AdSenseUnitProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const adSlot = slot || process.env.NEXT_PUBLIC_ADSENSE_SLOT;
  const canRender = enabled && isValidClientId(clientId) && isValidSlot(adSlot);

  useEffect(() => {
    if (canRender && typeof window !== "undefined") {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // ignore
      }
    }
  }, [canRender]);

  if (!canRender) {
    return null;
  }

  return (
    <section className={`glass-card p-4 ${className || ""}`}>
      <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-slate-400">{label}</p>
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
