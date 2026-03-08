export default function AdSenseScript() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  if (!clientId || !/^ca-pub-\d{10,}$/.test(clientId)) {
    return null;
  }

  return (
    <script
      id="adsense-js"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
    ></script>
  );
}
