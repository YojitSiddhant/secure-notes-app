import { getAuthenticatedUserFromRequest } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma";
import { createGenericServerErrorResponse, createNoStoreJsonResponse, createUnauthorizedResponse } from "@/lib/security";

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
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return createUnauthorizedResponse();
    }

    return createNoStoreJsonResponse(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Session API error:", error);
    return createGenericServerErrorResponse();
  }
}
