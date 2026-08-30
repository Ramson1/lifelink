interface GradientOrbsProps {
  variant?: "default" | "warm" | "cool";
  className?: string;
}

export function GradientOrbs({ variant = "default", className = "" }: GradientOrbsProps) {
  const colors = {
    default: {
      orb1: "bg-gradient-to-br from-amber-200/30 to-orange-200/20",
      orb2: "bg-gradient-to-br from-blue-300/20 to-indigo-300/15",
    },
    warm: {
      orb1: "bg-gradient-to-br from-amber-200/40 to-orange-200/30",
      orb2: "bg-gradient-to-br from-rose-200/25 to-pink-200/20",
    },
    cool: {
      orb1: "bg-gradient-to-br from-blue-300/30 to-cyan-200/25",
      orb2: "bg-gradient-to-br from-indigo-300/20 to-violet-200/15",
    },
  };

  const c = colors[variant];

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className={`absolute -top-24 -right-24 h-96 w-96 rounded-full blur-3xl ${c.orb1}`} />
      <div className={`absolute -bottom-24 -left-24 h-96 w-96 rounded-full blur-3xl ${c.orb2}`} />
    </div>
  );
}
