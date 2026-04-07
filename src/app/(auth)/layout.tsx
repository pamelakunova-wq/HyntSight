export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-background p-4"
      style={{
        backgroundImage: [
          "linear-gradient(to right, color-mix(in oklch, var(--foreground) 4%, transparent) 1px, transparent 1px)",
          "linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 4%, transparent) 1px, transparent 1px)",
        ].join(","),
        backgroundSize: "40px 40px",
      }}
    >
      {children}
    </div>
  );
}
