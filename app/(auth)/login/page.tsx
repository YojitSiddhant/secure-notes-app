import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { LoginForm } from "@/components/forms/LoginForm";
import { getAuthenticatedUserFromCookies } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Login | Secure Notes",
  description: "Sign in to continue to your Notes Dashboard.",
};

export default async function LoginPage() {
  const authUser = await getAuthenticatedUserFromCookies();

  if (authUser) {
    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({
      where: {
        id: authUser.userId,
      },
      select: {
        id: true,
      },
    });

    if (user) {
      redirect("/dashboard");
    }
  }

  return (
    <AuthPageShell>
      <LoginForm />
    </AuthPageShell>
  );
}
