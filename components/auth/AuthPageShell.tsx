import type { ReactNode } from "react";
import { BrandLogo } from "@/components/shared/BrandLogo";

type AuthPageShellProps = {
  children: ReactNode;
};

export function AuthPageShell({
  children,
}: AuthPageShellProps) {
  return (
    <main className="relative isolate min-h-[100dvh] overflow-x-clip bg-white px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">

      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-xl items-center">
        <section className="w-full">
          <div className="ui-animate-rise-in mb-4 flex justify-center sm:mb-5">
            <BrandLogo variant="auth" />
          </div>

          <div className="ui-animate-rise-in-delay-1 rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-5 shadow-[0_30px_90px_-52px_rgba(15,23,42,0.24)] backdrop-blur-xl sm:p-6 lg:p-8">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
