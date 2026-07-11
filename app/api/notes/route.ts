import type { NextRequest } from "next/server";

import { getAuthenticatedUserFromRequest } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma";
import { enforceAuthRateLimit } from "@/lib/rate-limit";
import {
  createGenericServerErrorResponse,
  createNoStoreJsonResponse,
  createUnauthorizedResponse,
  enforceTrustedOrigin,
  JSON_BODY_LIMITS,
  readJsonBody,
} from "@/lib/security";
import { createNote, getUserNotes } from "@/services/note.service";
import { createNoteSchema, listNotesQuerySchema } from "@/lib/validations/note";
export const runtime = "nodejs";

function createValidationErrorResponse(message: string, fieldErrors: Record<string, string[]>) {
  return createNoStoreJsonResponse(
    {
      success: false,
      message,
      errors: {
        formErrors: [message],
        fieldErrors,
      },
    },
    { status: 400 },
  );
}

async function getAuthenticatedExistingUser(request: Request) {
  const authUser = await getAuthenticatedUserFromRequest(request);

  if (!authUser) {
    return null;
  }

  const prisma = getPrismaClient();
  const user = await prisma.user.findUnique({
    where: {
      id: authUser.userId,
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    return null;
  }

  return { ...authUser, email: user.email };
}

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedExistingUser(request);

    if (!authUser) {
      return createUnauthorizedResponse();
    }

    const { searchParams } = new URL(request.url);
    const queryResult = listNotesQuerySchema.safeParse({
      search: searchParams.get("search") ?? undefined,
      priority: searchParams.get("priority") ?? undefined,
    });

    if (!queryResult.success) {
      return createValidationErrorResponse("Validation failed.", queryResult.error.flatten().fieldErrors);
    }

    const notes = await getUserNotes(authUser.userId, {
      search: queryResult.data.search?.trim() || undefined,
      priority: queryResult.data.priority,
    });

    return createNoStoreJsonResponse(
      {
        success: true,
        notes,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("List notes API error:", error);
    return createGenericServerErrorResponse();
  }
}

export async function POST(request: Request) {
  try {
    const originResponse = enforceTrustedOrigin(request);

    if (originResponse) {
      return originResponse;
    }

    const authUser = await getAuthenticatedExistingUser(request);

    if (!authUser) {
      return createUnauthorizedResponse();
    }

    const rateLimitResponse = await enforceAuthRateLimit(request, "note-create", authUser.userId);

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const parsedBody = await readJsonBody<unknown>(request, {
      maxBytes: JSON_BODY_LIMITS.note,
    });

    if (!parsedBody.ok) {
      return parsedBody.response;
    }

    const validationResult = createNoteSchema.safeParse(parsedBody.body);

    if (!validationResult.success) {
      return createNoStoreJsonResponse(
        {
          success: false,
          message: "Validation failed.",
          errors: validationResult.error.flatten(),
        },
        { status: 400 },
      );
    }

    const note = await createNote(authUser.userId, validationResult.data);

    return createNoStoreJsonResponse(
      {
        success: true,
        message: "Note created successfully.",
        note,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create note API error:", error);
    return createGenericServerErrorResponse();
  }
}
