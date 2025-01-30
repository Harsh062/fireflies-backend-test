import { z } from "zod";

export const meetingSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters")
    .trim(),
  date: z
    .string()
    .refine(
      (val) => new Date(val).getTime() >= Date.now(),
      "Date must be in the future or present"
    ),
  participants: z
    .array(z.string().min(1).max(50).trim())
    .min(1, "At least one participant is required")
    .max(50, "Participants cannot exceed 50"),
  transcript: z.string().trim().optional(),
  summary: z.string().trim().optional(),
  actionItems: z.array(z.string()).optional(),
});
