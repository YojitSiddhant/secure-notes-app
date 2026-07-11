import { Prisma, Priority } from "@prisma/client";

import { getPrismaClient } from "@/lib/prisma";
import { logSecurityEvent } from "@/lib/security";

const noteResponseSelect = {
  id: true,
  title: true,
  description: true,
  priority: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type NoteResponse = Prisma.NoteGetPayload<{
  select: typeof noteResponseSelect;
}>;

export type GetUserNotesInput = {
  search?: string;
  priority?: Priority;
};

export type CreateNoteInput = {
  title: string;
  description: string;
  priority: Priority;
};

export type UpdateNoteInput = CreateNoteInput;

export type DashboardStats = {
  totalNotes: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
};

export class NoteNotFoundError extends Error {
  readonly status = 404;

  constructor() {
    super("Note not found.");
    this.name = "NoteNotFoundError";
  }
}

export class NoteForbiddenError extends Error {
  readonly status = 403;

  constructor() {
    super("Forbidden.");
    this.name = "NoteForbiddenError";
  }
}

type PrismaDb = ReturnType<typeof getPrismaClient>;

function toNoteResponse(note: NoteResponse): NoteResponse {
  return note;
}

function sortNotes(notes: NoteResponse[]) {
  const priorityOrder: Record<Priority, number> = {
    HIGH: 0,
    MEDIUM: 1,
    LOW: 2,
  };

  return [...notes].sort((a, b) => {
    const priorityDifference = priorityOrder[a.priority] - priorityOrder[b.priority];

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

function buildNotesWhereClause(userId: string, input: GetUserNotesInput) {
  const where: Prisma.NoteWhereInput = {
    userId,
  };

  if (input.priority) {
    where.priority = input.priority;
  }

  if (input.search && input.search.trim().length > 0) {
    where.OR = [
      {
        title: {
          contains: input.search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: input.search,
          mode: "insensitive",
        },
      },
    ];
  }

  return where;
}

export async function createNote(
  userId: string,
  input: CreateNoteInput,
  db: PrismaDb = getPrismaClient(),
): Promise<NoteResponse> {
  const note = await db.note.create({
    data: {
      title: input.title,
      description: input.description,
      priority: input.priority,
      userId,
    },
    select: noteResponseSelect,
  });

  return toNoteResponse(note);
}

export async function getUserNotes(
  userId: string,
  input: GetUserNotesInput = {},
  db: PrismaDb = getPrismaClient(),
): Promise<NoteResponse[]> {
  const notes = await db.note.findMany({
    where: buildNotesWhereClause(userId, input),
    select: noteResponseSelect,
  });

  return sortNotes(notes.map(toNoteResponse));
}

export async function updateNote(
  userId: string,
  noteId: string,
  input: UpdateNoteInput,
  db: PrismaDb = getPrismaClient(),
): Promise<NoteResponse> {
  const result = await db.note.updateMany({
    where: { id: noteId, userId },
    data: {
      title: input.title,
      description: input.description,
      priority: input.priority,
    },
  });

  if (result.count === 0) {
    const existingNote = await db.note.findUnique({
      where: { id: noteId },
      select: { userId: true },
    });

    if (!existingNote) {
      throw new NoteNotFoundError();
    }

    logSecurityEvent("note.forbidden_ownership", { action: "update" });
    throw new NoteForbiddenError();
  }

  const updatedNote = await db.note.findUnique({
    where: { id: noteId },
    select: noteResponseSelect,
  });

  if (!updatedNote) {
    throw new NoteNotFoundError();
  }

  return toNoteResponse(updatedNote);
}

export async function deleteNote(
  userId: string,
  noteId: string,
  db: PrismaDb = getPrismaClient(),
): Promise<void> {
  const result = await db.note.deleteMany({
    where: { id: noteId, userId },
  });

  if (result.count === 0) {
    const existingNote = await db.note.findUnique({
      where: { id: noteId },
      select: { userId: true },
    });

    if (!existingNote) {
      throw new NoteNotFoundError();
    }

    logSecurityEvent("note.forbidden_ownership", { action: "delete" });
    throw new NoteForbiddenError();
  }
}

export async function getDashboardStats(
  userId: string,
  db: PrismaDb = getPrismaClient(),
): Promise<DashboardStats> {
  const [totalNotes, highPriority, mediumPriority, lowPriority] = await Promise.all([
    db.note.count({
      where: { userId },
    }),
    db.note.count({
      where: { userId, priority: "HIGH" },
    }),
    db.note.count({
      where: { userId, priority: "MEDIUM" },
    }),
    db.note.count({
      where: { userId, priority: "LOW" },
    }),
  ]);

  return {
    totalNotes,
    highPriority,
    mediumPriority,
    lowPriority,
  };
}
