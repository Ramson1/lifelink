import Link from "next/link";

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  type,
  disabled,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-60";

  const styles =
    variant === "primary"
      ? "bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90"
      : variant === "secondary"
        ? "border border-black/10 bg-white/70 text-black hover:bg-white"
        : "text-black/70 hover:text-black hover:bg-black/5";

  const merged = `${base} ${styles} ${className}`;

  if (href) {
    return (
      <Link href={href} className={merged}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type ?? "button"}
      className={merged}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
