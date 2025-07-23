// schemas/quizSchema.ts
import { z } from "zod"

export const quizSchema = z.object({
  topic: z
    .string()
    .min(2, "Topic must be at least 2 characters")
    .max(100, "Topic must be at most 100 characters"),

  numberOfQuestions: z
    .number({
      required_error: "Number of questions is required",
      invalid_type_error: "Must be a number",
    })
    .min(1, "At least 1 question")
    .max(50, "Maximum 50 questions"),

  difficulty: z.enum(["easy", "medium", "hard"], {
    errorMap: () => ({ message: "Select a difficulty: easy, medium, or hard" }),
  }),
})

export type QuizFormSchema = z.infer<typeof quizSchema>

export const eventSchema = z.object({
  eventId: z.string().min(1),
  title: z.string().min(3, "Title is too short"),
  description: z.string().min(5, "Description is required"),
  isDurationEnabled: z.boolean(),
  durationLimitSeconds: z
    .number()
    .min(60, "At least 1 minute")
    .max(7200, "Max 2 hours"),
  sendEmailFeatureEnabled: z.boolean(),
  participantLimitEnabled: z.boolean(),
  participantLimit: z
    .number()
    .min(1, "Minimum 1 participant")
    .max(1000, "Maximum 1000 participants"),
  isPublic: z.boolean(),
  creatorId: z.string().min(1),
})

export type EventFormSchema = z.infer<typeof eventSchema>
