import { cn } from "@/src/lib/utils";

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  className?: string;
  colorClassName?: string;
}

export function ProgressBar({ value, max = 100, className, colorClassName = "bg-primary" }: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("h-4 w-full bg-muted rounded-full overflow-hidden", className)}>
      <div
        className={cn("h-full transition-all duration-500", colorClassName)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
