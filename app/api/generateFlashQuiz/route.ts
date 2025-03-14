import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { flashcardsSchema } from '@/lib/flashCardSchema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { files } = body;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided.' }, { status: 400 });
    }

    const firstFile = files[0].data;

    const result = streamObject({
      model: google('gemini-1.5-pro-latest'),
      messages: [
        {
          role: 'system',
          content:
            'You are an educator. Your task is to create flashcards from the provided document. Each flashcard should include a question, a correct answer, and an optional hint to assist understanding.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Generate 12 flashcards based on this document.',
            },
            {
              type: 'file',
              data: firstFile,
              mimeType: 'application/pdf',
            },
          ],
        },
      ],
      schema: flashcardsSchema,
      output: 'array',
      onFinish: ({ object }) => {
        // Log the object to see its structure
        console.log("Object structure:", JSON.stringify(object).slice(0, 100));
        
        // Use try-catch to handle any validation errors
        try {
          // Flatten the nested array
          const flattenedObject = Array.isArray(object) && Array.isArray(object[0]) ? object[0] : object;

          // Validate the flattened array against the schema
          const res = flashcardsSchema.safeParse(flattenedObject);
          if (res.error) {
            console.error("Schema validation error:", res.error);
            throw new Error(res.error.errors.map((e : any ) => e.message).join("\n"));
          }
        } catch (error) {
          console.error("Validation error:", error);
        }
      },
    });
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating flashcards.' },
      { status: 500 }
    );
  }
}
