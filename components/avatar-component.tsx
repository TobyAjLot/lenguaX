import Image from "next/image";
import { getInitials } from "@/lib/utils-extra";

interface AvatarProps {
  src?: string;
  alt: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({
  src,
  alt,
  name,
  size = "md",
  className = "",
}: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-lg",
  };

  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size === "sm" ? 32 : size === "md" ? 48 : 64}
        height={size === "sm" ? 32 : size === "md" ? 48 : 64}
        className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold ${sizeClasses[size]} ${className}`}
    >
      {name ? getInitials(name) : "?"}
    </div>
  );
}
