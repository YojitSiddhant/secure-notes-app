import type { ReactNode } from "react";
import { BrandLogo } from "@/components/shared/BrandLogo";

type AuthPageShellProps = {
  children: ReactNode;
};

export function AuthPageShell({
  children,
}: AuthPageShellProps) {
  return (
    <main className="relative isolate min-h-[100dvh] overflow-x-clip bg-transparent px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-7rem] top-[-7rem] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-[-6rem] top-[8rem] h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/3 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-xl items-center">
        <section className="w-full">
          <div className="mb-4 flex justify-center sm:mb-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-4 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.24)] backdrop-blur-xl sm:h-28 sm:w-28 sm:p-5">
              <BrandLogo variant="auth" className="h-full w-full" />
            </div>
          </div>

          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-5 shadow-[0_30px_90px_-52px_rgba(15,23,42,0.24)] backdrop-blur-xl sm:p-6 lg:p-8">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
