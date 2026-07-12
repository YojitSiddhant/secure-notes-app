import { z } from "zod";
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
import { updateNoteSchema } from "@/lib/validations/note";
import { deleteNote, NoteForbiddenError, NoteNotFoundError, updateNote } from "@/services/note.service";

export const runtime = "nodejs";

const noteIdSchema = z.string().uuid("Invalid note id.");

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
    },
  });

  if (!user) {
    return null;
  }

  return authUser;
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const originResponse = enforceTrustedOrigin(request);

    if (originResponse) {
      return originResponse;
    }

    const authUser = await getAuthenticatedExistingUser(request);

    if (!authUser) {
      return createUnauthorizedResponse();
    }

    const { id } = await params;
    const idResult = noteIdSchema.safeParse(id);

    if (!idResult.success) {
      return createValidationErrorResponse("Validation failed.", { id: ["Invalid note id."] });
    }

    const rateLimitResponse = await enforceAuthRateLimit(request, "note-update", authUser.userId);

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const parsedBody = await readJsonBody<unknown>(request, {
      maxBytes: JSON_BODY_LIMITS.note,
    });

    if (!parsedBody.ok) {
      return parsedBody.response;
    }

    const validationResult = updateNoteSchema.safeParse(parsedBody.body);

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

    const note = await updateNote(authUser.userId, idResult.data, validationResult.data);

    return createNoStoreJsonResponse(
      {
        success: true,
        message: "Note updated successfully.",
        note,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof NoteNotFoundError) {
      return createNoStoreJsonResponse(
        {
          success: false,
          message: "Note not found.",
        },
        { status: 404 },
      );
    }

    if (error instanceof NoteForbiddenError) {
      return createNoStoreJsonResponse(
        {
          success: false,
          message: "Forbidden.",
        },
        { status: 403 },
      );
    }

    console.error("Update note API error:", error);
    return createGenericServerErrorResponse();
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const originResponse = enforceTrustedOrigin(request);

    if (originResponse) {
      return originResponse;
    }

    const authUser = await getAuthenticatedExistingUser(request);

    if (!authUser) {
      return createUnauthorizedResponse();
    }

    const { id } = await params;
    const idResult = noteIdSchema.safeParse(id);

    if (!idResult.success) {
      return createValidationErrorResponse("Validation failed.", { id: ["Invalid note id."] });
    }

    const rateLimitResponse = await enforceAuthRateLimit(request, "note-delete", authUser.userId);

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    await deleteNote(authUser.userId, idResult.data);

    return createNoStoreJsonResponse(
      {
        success: true,
        message: "Note deleted successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof NoteNotFoundError) {
      return createNoStoreJsonResponse(
        {
          success: false,
          message: "Note not found.",
        },
        { status: 404 },
      );
    }

    if (error instanceof NoteForbiddenError) {
      return createNoStoreJsonResponse(
        {
          success: false,
          message: "Forbidden.",
        },
        { status: 403 },
      );
    }

    console.error("Delete note API error:", error);
    return createGenericServerErrorResponse();
  }
}
