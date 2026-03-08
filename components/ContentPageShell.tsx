interface ContentPageShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function ContentPageShell({
  eyebrow,
  title,
  description,
  children,
}: ContentPageShellProps) {
  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 md:py-10">
      <header className="hero-shell">
        <section className="hero-card p-6 lg:p-8">
          <p className="hero-kicker">{eyebrow}</p>
          <h1 className="hero-title">{title}</h1>
          <p className="mt-3 max-w-3xl hero-copy">{description}</p>
        </section>
      </header>
      {children}
    </main>
  );
}

