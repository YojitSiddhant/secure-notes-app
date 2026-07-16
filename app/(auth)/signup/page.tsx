import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { SignupForm } from "@/components/forms/SignupForm";
import { getAuthenticatedUserFromCookies } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Sign Up | Secure Notes",
  description: "Create your account to continue to your Notes Dashboard.",
};

export default async function SignUpPage() {
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
      <SignupForm />
    </AuthPageShell>
  );
}
