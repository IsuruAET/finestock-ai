import { z } from "zod";

export const createSessionSchema = z.object({
  role: z.string().min(1, "Role is required"),
  experience: z.string().min(1, "Experience is required"),
  topicsToFocus: z.string().min(1, "Topics to focus on are required"),
  description: z.string().min(1, "Description is required"),
});

export type CreateSessionFormData = z.infer<typeof createSessionSchema>;

