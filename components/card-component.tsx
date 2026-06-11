import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

export function Card({
  children,
  className = "",
  interactive = false,
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-lg border border-border p-4 sm:p-6",
        interactive && "transition-all hover:shadow-md cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
}
