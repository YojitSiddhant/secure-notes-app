import { createAuthCookieValue } from "@/lib/auth";
import {
  createGenericServerErrorResponse,
  createNoStoreJsonResponse,
  enforceTrustedOrigin,
} from "@/lib/security";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const originResponse = enforceTrustedOrigin(request);

    if (originResponse) {
      return originResponse;
    }

    const response = createNoStoreJsonResponse(
      {
        success: true,
        message: "Logout successful.",
      },
      { status: 200 },
    );

    response.cookies.set({
      ...createAuthCookieValue(""),
      maxAge: 0,
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error("Logout API error:", error);
    return createGenericServerErrorResponse();
  }
}
