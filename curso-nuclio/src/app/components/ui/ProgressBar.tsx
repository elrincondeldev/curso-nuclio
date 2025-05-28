"use client";

interface ProgressBarProps {
  value: number;
  max: number;
  variant?: "emerald" | "amber" | "sky";
  label: string;
  valueLabel: string;
}

export default function ProgressBar({
  value,
  max,
  variant = "emerald",
  label,
  valueLabel,
}: ProgressBarProps) {
  const variants = {
    emerald: "bg-gradient-to-r from-emerald-400 to-teal-400",
    amber: "bg-gradient-to-r from-amber-400 to-orange-400",
    sky: "bg-gradient-to-r from-sky-400 to-blue-400",
  };

  const bgColors = {
    emerald: "bg-emerald-100",
    amber: "bg-amber-100",
    sky: "bg-sky-100",
  };

  const percentage = (value / max) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-emerald-700">{label}</span>
        <span className="font-medium text-emerald-800">{valueLabel}</span>
      </div>
      <div className={`h-2 ${bgColors[variant]} rounded-full`}>
        <div
          className={`h-full ${variants[variant]} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
