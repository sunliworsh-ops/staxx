export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-staxx-warm-bg px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 no-underline">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-staxx-purple text-white text-xl font-bold font-display">
              S
            </span>
            <span className="text-2xl font-bold tracking-tight text-staxx-indigo font-display">
              Staxx
            </span>
          </a>
          <p className="mt-2 text-sm text-muted-foreground">
            Stack smarter. Create freer.
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
