'use client';

import { useEffect, useState } from "react";
import { experimental_useObject } from "ai/react";
import { questionsSchema } from "@/lib/schemas";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Quiz from "@/components/quiz";
import { Link } from "@/components/ui/link";
import { generateQuizTitle } from "./actions";
import FileUpload from "@/components/FileUpload";
import { useFiles } from "./context/FileContext";
import { flashcardsSchema } from "@/lib/flashCardSchema";
import { useRouter } from "next/navigation";

export default function ChatWithFiles() {
  const { files } = useFiles();
  const [questions, setQuestions] = useState<z.infer<typeof questionsSchema>>([]);
  const [title, setTitle] = useState<string>();
  const [flashCards, setFlashCards] = useState<z.infer<typeof flashcardsSchema>>([]);
  const router = useRouter();
  
  const {
    submit: submitQuiz,
    object: partialQuestions,
    isLoading: isLoadingQuiz,
  } = experimental_useObject({
    api: "/api/generate-quiz",
    schema: questionsSchema,
    initialValue: undefined,
    onError: () => toast.error("Failed to generate quiz."),
    onFinish: ({ object }) => setQuestions(object ?? []),
  });
  
  const {
    submit: submitFlashCards,
    object: flashCardsQues,
    isLoading: isLoadingFlashCards,
  } = experimental_useObject({
    api: "/api/generateFlashQuiz",
    schema: flashcardsSchema, // Define this schema
    initialValue: undefined,
    onError: () => toast.error("Failed to generate flashcards."),
    onFinish: ({ object }) => {
      console.log(object)
      setFlashCards(object ?? [])
    }
  });
  console.log(flashCardsQues)
  useEffect(()=>{ 
    if(flashCardsQues && flashCardsQues[0] && flashCardsQues.length>0){
      sessionStorage.setItem('flashCard' , JSON.stringify(flashCardsQues[0]));
      router.push('/flashCard')
    }
    
  },[flashCards])
  
  // const {
  //   submit: submitMatching,
  //   object: matchingPairs,
  //   isLoading: isLoadingMatching,
  // } = experimental_useObject({
  //   api: "/api/generate-matching",
  //   schema: matchingSchema, // Define this schema
  //   initialValue: undefined,
  //   onError: () => toast.error("Failed to generate matching exercise."),
  //   onFinish: ({ object }) => setMatchingPairs(object ?? []),
  // });
  

  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmitWithFiles = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
    type: "quiz" | "flashcards" | "matching"
  ) => {
    e.preventDefault();
    if (files.length === 0) return;
  
    const encodedFiles = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type,
        data: await encodeFileAsBase64(file.file),
      }))
    );

    if (type === "quiz") submitQuiz({ files: encodedFiles });
    else if (type === "flashcards") submitFlashCards({ files: encodedFiles });
    //else submitMatching({ files: encodedFiles });

    const generatedTitle = await generateQuizTitle(encodedFiles[0].name);
    setTitle(generatedTitle);
  };
  

  const clearPDF = () => {
    setQuestions([]);
  };

  const progress = partialQuestions ? (partialQuestions.length / 4) * 100 : 0;

  if (questions.length === 4) {
    return (
      <Quiz title={title ?? "Quiz"} questions={questions} clearPDF={clearPDF} />
    );
  }

  return (
    <div className="min-h-[100dvh] w-full flex justify-center">
      <Card className="w-full max-w-md h-full border-0 sm:border sm:h-fit mt-12">
        <CardHeader className="text-center space-y-6">
          <div className="mx-auto flex items-center justify-center space-x-2 text-muted-foreground">
            <div className="rounded-full bg-primary/10 p-2">
              <Plus className="h-4 w-4" />
            </div>
            <div className="rounded-full bg-primary/10 p-2">
              <Loader2 className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">
              PDF Quiz Generator
            </CardTitle>
            <CardDescription className="text-base">
              Upload a PDF to generate an interactive quiz based on its content
              using the <Link href="https://sdk.vercel.ai">AI SDK</Link> and{" "}
              <Link href="https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai">
                Google&apos;s Gemini Pro
              </Link>
              .
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <FileUpload 
              maxFiles={1}
              acceptedTypes={['application/pdf']}
              onUploadError={(error) => toast.error(error)}
            />
<Button
  type="submit"
  className="w-full"
  disabled={files.length === 0}
  onClick={(e) => handleSubmitWithFiles(e, "quiz")}  // Pass "quiz" instead of function
>
  {isLoadingQuiz ? (
    <span className="flex items-center space-x-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Generating Quiz...</span>
    </span>
  ) : (
    "Generate Quiz"
  )}
</Button>

<Button
  type="submit"
  className="w-full"
  disabled={files.length === 0}
  onClick={(e) => handleSubmitWithFiles(e, "flashcards")}  // Pass "flashcards"
>
  {isLoadingFlashCards ? (
    <span className="flex items-center space-x-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Generating Flash Cards...</span>
    </span>
  ) : (
    "Generate Flash Cards"
  )}
</Button>

<Button
  type="submit"
  className="w-full"
  disabled={files.length === 0}
  onClick={(e) => handleSubmitWithFiles(e, "matching")}  // Pass "matching"
>
  {/* {isLoadingMatching ? (
    <span className="flex items-center space-x-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Generating Matching...</span>
    </span>
  ) : (
    "Generate Matching"
  )} */}
</Button>


          </form>
        </CardContent>
        {isLoadingQuiz && (
          <CardFooter className="flex flex-col space-y-4">
            <div className="w-full space-y-1">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="w-full space-y-2">
              <div className="grid grid-cols-6 sm:grid-cols-4 items-center space-x-2 text-sm">
                <div
                  className={`h-2 w-2 rounded-full ${
                    isLoadingQuiz ? "bg-yellow-500/50 animate-pulse" : "bg-muted"
                  }`}
                />
                <span className="text-muted-foreground text-center col-span-4 sm:col-span-2">
                  {partialQuestions
                    ? `Generating question ${partialQuestions.length + 1} of 4`
                    : "Analyzing PDF content"}
                </span>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}