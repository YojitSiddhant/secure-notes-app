import Image from "next/image";
import { cn } from "@/lib/cn";

type BrandLogoProps = {
  className?: string;
  variant?: "mobile" | "header" | "sidebar" | "auth";
};

const variantClasses: Record<NonNullable<BrandLogoProps["variant"]>, string> = {
  mobile: "h-9 w-[7rem]",
  header: "h-11 w-[8rem]",
  sidebar: "h-11 w-[8rem]",
  auth: "h-16 w-[11rem]",
};

const variantSizes: Record<NonNullable<BrandLogoProps["variant"]>, string> = {
  mobile: "112px",
  header: "128px",
  sidebar: "128px",
  auth: "176px",
};

export function BrandLogo({ className, variant = "header" }: BrandLogoProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white shadow-sm",
        variantClasses[variant],
        className
      )}
    >
      <Image
        src="/secure-notes-logo.jpeg"
        alt="Secure Notes App logo"
        fill
        priority
        sizes={variantSizes[variant]}
        className="object-contain p-1"
      />
    </div>
  );
}
