import Script from "next/script";

export default function AdSenseScript() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!clientId) {
    return null;
  }

  return (
    <Script
      id="adsense-js"
      async
      strategy="afterInteractive"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      data-ad-client={clientId}
      crossOrigin="anonymous"
    />
  );
}
