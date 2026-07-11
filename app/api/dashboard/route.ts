import { getAuthenticatedUserFromRequest } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma";
import { createGenericServerErrorResponse, createNoStoreJsonResponse, createUnauthorizedResponse } from "@/lib/security";
import { getDashboardStats } from "@/services/note.service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const authUser = await getAuthenticatedUserFromRequest(request);

    if (!authUser) {
      return createUnauthorizedResponse();
    }

    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({
      where: {
        id: authUser.userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return createUnauthorizedResponse();
    }

    const stats = await getDashboardStats(authUser.userId);

    return createNoStoreJsonResponse(stats, { status: 200 });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return createGenericServerErrorResponse();
  }
}
