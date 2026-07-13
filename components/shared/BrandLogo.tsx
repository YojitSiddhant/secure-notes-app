import Image from "next/image";
import { cn } from "@/lib/cn";

type BrandLogoProps = {
  className?: string;
  variant?: "mobile" | "header" | "sidebar" | "auth";
};

const variantClasses: Record<NonNullable<BrandLogoProps["variant"]>, string> = {
  mobile: "h-10 w-10",
  header: "h-11 w-11",
  sidebar: "h-11 w-11",
  auth: "h-20 w-20",
};

const variantSizes: Record<NonNullable<BrandLogoProps["variant"]>, string> = {
  mobile: "40px",
  header: "44px",
  sidebar: "44px",
  auth: "80px",
};

export function BrandLogo({ className, variant = "header" }: BrandLogoProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full border border-[color:var(--border)] bg-white shadow-sm",
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
        className="object-contain p-1.5"
      />
    </div>
  );
}
