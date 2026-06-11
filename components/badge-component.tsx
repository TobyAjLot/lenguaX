import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "success" | "warning" | "error";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variants = {
    default: "bg-primary/10 text-primary",
    secondary: "bg-secondary text-secondary-foreground",
    success:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100",
    warning:
      "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100",
    error: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
