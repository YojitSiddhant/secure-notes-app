"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type ProtectedAppShellProps = {
  loadingFallback: ReactNode;
  children: ReactNode;
};

export function ProtectedAppShell({
  loadingFallback,
  children,
}: ProtectedAppShellProps) {
  const router = useRouter();
  const currentUserQuery = useCurrentUser();

  useEffect(() => {
    if (currentUserQuery.isError) {
      router.replace("/login");
    }
  }, [currentUserQuery.isError, router]);

  if (currentUserQuery.isLoading) {
    return (
      <AppLayout isCurrentUserLoading currentUser={null}>
        {loadingFallback}
      </AppLayout>
    );
  }

  if (currentUserQuery.isError) {
    return null;
  }

  return (
    <AppLayout currentUser={currentUserQuery.user} isCurrentUserLoading={false}>
      {children}
    </AppLayout>
  );
}
