interface MeshGradientProps {
  variant?: "aurora" | "sunset" | "ocean";
  className?: string;
}

export function MeshGradient({ variant = "aurora", className = "" }: MeshGradientProps) {
  const gradients = {
    aurora:
      "bg-[linear-gradient(135deg,rgba(99,102,241,0.15),rgba(6,182,212,0.12),rgba(139,92,246,0.15),rgba(245,158,11,0.1),rgba(99,102,241,0.15))] dark:bg-[linear-gradient(135deg,rgba(99,102,241,0.2),rgba(6,182,212,0.18),rgba(139,92,246,0.2),rgba(245,158,11,0.12),rgba(99,102,241,0.2))]",
    sunset:
      "bg-[linear-gradient(135deg,rgba(244,63,94,0.15),rgba(245,158,11,0.12),rgba(236,72,153,0.15),rgba(139,92,246,0.1),rgba(244,63,94,0.15))] dark:bg-[linear-gradient(135deg,rgba(244,63,94,0.2),rgba(245,158,11,0.18),rgba(236,72,153,0.2),rgba(139,92,246,0.12),rgba(244,63,94,0.2))]",
    ocean:
      "bg-[linear-gradient(135deg,rgba(59,130,246,0.15),rgba(20,184,166,0.12),rgba(99,102,241,0.15),rgba(6,182,212,0.1),rgba(59,130,246,0.15))] dark:bg-[linear-gradient(135deg,rgba(59,130,246,0.2),rgba(20,184,166,0.18),rgba(99,102,241,0.2),rgba(6,182,212,0.12),rgba(59,130,246,0.2))]",
  };

  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-10 bg-[length:400%_400%] animate-mesh-shift ${gradients[variant]} ${className}`}
      aria-hidden="true"
    />
  );
}
