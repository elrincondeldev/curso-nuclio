"use client";

interface BadgeProps {
  variant: "difficulty" | "light";
  value: string;
  className?: string;
}

export default function Badge({ variant, value, className = "" }: BadgeProps) {
  const variants = {
    difficulty: {
      easy: "bg-emerald-100 text-emerald-800",
      medium: "bg-amber-100 text-amber-800",
      hard: "bg-rose-100 text-rose-800",
    },
    light: {
      low: "bg-sky-100 text-sky-800",
      medium: "bg-amber-100 text-amber-800",
      high: "bg-orange-100 text-orange-800",
    },
  };

  const labels = {
    difficulty: {
      easy: "Fácil",
      medium: "Media",
      hard: "Difícil",
    },
    light: {
      low: "Poca luz",
      medium: "Luz media",
      high: "Mucha luz",
    },
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        variants[variant][value as keyof (typeof variants)[typeof variant]]
      } ${className}`}
    >
      {labels[variant][value as keyof (typeof labels)[typeof variant]]}
    </span>
  );
}
