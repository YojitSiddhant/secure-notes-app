import { z } from "zod";

// Shared priority schema used by note creation, updates, and note filtering.
export const notePrioritySchema = z.enum(["HIGH", "MEDIUM", "LOW"], {
  error: "Priority is required.",
});

// Schema for the data we expect when a user creates a note.
export const createNoteSchema = z
  .object({
    // Title must exist and stay within a reasonable note length.
    title: z
      .string({ error: "Title is required." })
      .trim()
      .min(1, "Title must be at least 1 character.")
      .max(200, "Title cannot exceed 200 characters."),
    // Description must exist and allow long-form note content.
    description: z
      .string({ error: "Description is required." })
      .trim()
      .min(1, "Description must be at least 1 character.")
      .max(5000, "Description cannot exceed 5000 characters."),
    // Priority must be one of the supported note levels.
    priority: notePrioritySchema,
  })
  .strict();

// Schema for the data we expect when a user updates a note.
export const updateNoteSchema = createNoteSchema;

// Schema for optional note filters in list endpoints.
export const listNotesQuerySchema = z
  .object({
    // Optional text search for title and description.
    search: z
      .string()
      .trim()
      .max(200, "Search cannot exceed 200 characters.")
      .optional(),
    // Optional priority filter.
    priority: notePrioritySchema.optional(),
  })
  .strict();

// TypeScript type for validated note creation data.
export type CreateNoteInput = z.infer<typeof createNoteSchema>;

// TypeScript type for validated note update data.
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;

// TypeScript type for validated note listing query data.
export type ListNotesQueryInput = z.infer<typeof listNotesQuerySchema>;
