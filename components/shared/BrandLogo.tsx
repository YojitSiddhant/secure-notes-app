import { PencilLine } from "lucide-react";
import { cn } from "@/lib/cn";

type BrandLogoProps = {
  className?: string;
  variant?: "mobile" | "header" | "sidebar" | "auth";
};

const variantClasses: Record<NonNullable<BrandLogoProps["variant"]>, string> = {
  mobile: "h-10 w-10",
  header: "h-11 w-11",
  sidebar: "h-11 w-11",
  auth: "h-24 w-24",
};

const variantIconClasses: Record<NonNullable<BrandLogoProps["variant"]>, string> = {
  mobile: "h-5 w-5",
  header: "h-5 w-5",
  sidebar: "h-5 w-5",
  auth: "h-11 w-11",
};

export function BrandLogo({ className, variant = "header" }: BrandLogoProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-[1.25rem] border border-white/70 bg-[linear-gradient(135deg,rgba(56,86,240,0.16),rgba(15,132,170,0.12))] shadow-[0_16px_36px_-24px_rgba(15,23,42,0.45)] ring-1 ring-inset ring-white/50",
        variantClasses[variant],
        className
      )}
    >
      <PencilLine
        aria-hidden="true"
        className={cn("text-[color:var(--primary)]", variantIconClasses[variant])}
        strokeWidth={1.8}
      />
    </div>
  );
}
