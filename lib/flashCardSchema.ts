import { z } from "zod";

// Define the schema for a single flashcard
export const flashcardSchema = z.object({
  question: z.string().describe("The question presented on the flashcard."),
  answer: z.string().describe("The correct answer to the question."),
  hint: z.string().optional().describe("An optional hint to assist with the question."),
}).passthrough();

// Define the schema for an array of flashcards
export const flashcardsSchema = z.array(flashcardSchema).describe("An array of flashcards.");

// Infer the TypeScript type for a flashcard
export type Flashcard = z.infer<typeof flashcardSchema>;