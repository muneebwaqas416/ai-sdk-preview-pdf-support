'use client';

import { useState, useEffect } from 'react';
import { Question, QuizState } from './types';
import Flashcard from './flashCard';
import QuizControls from './QuizControls';
import Progress from './Progress';
import { useFiles } from '../context/FileContext';
import { generateQuizTitle } from '../actions';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const {files} = useFiles();
  const [sampleQuestions, setSampleQuestions] = useState<Question[]>([]);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    totalQuestions: sampleQuestions.length,
    showAnswer: false,
    questions: sampleQuestions,
  });
  const [title, setTitle] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFlashCards = sessionStorage.getItem("flashCard");
      if (storedFlashCards) {
        setSampleQuestions(JSON.parse(storedFlashCards));
      }
    }
  }, []);

  const setHeading = async ()=>{
    const generatedTitle = await generateQuizTitle(files[0].name);
    setTitle(generatedTitle);
  }

  useEffect(() => {
    setQuizState(prev => ({
      ...prev,
      questions: sampleQuestions,
      totalQuestions: sampleQuestions.length,
    }));
    setHeading();
  }, [sampleQuestions]);

  const handleNext = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, prev.totalQuestions - 1),
      showAnswer: false,
    }));
  };

  const handlePrevious = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0),
      showAnswer: false,
    }));
  };

  const handleToggleAnswer = () => {
    setQuizState(prev => ({
      ...prev,
      showAnswer: !prev.showAnswer,
    }));
  };

  const handleShowHint = () => {
    // Implement hint functionality
    console.log('Show hint');
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 relative">
      <button 
        onClick={() => router.push('/')}
        className="absolute top-4 left-4 text-white hover:text-gray-300 transition-colors flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8 text-center">
          {title}
        </h1>
        
        <Progress
          current={quizState.currentQuestionIndex + 1}
          total={quizState.totalQuestions}
        />

        <Flashcard
          question={quizState.questions[quizState.currentQuestionIndex]}
          showAnswer={quizState.showAnswer}
          onShowHint={handleShowHint}
        />

        <QuizControls
          onNext={handleNext}
          onPrevious={handlePrevious}
          onToggleAnswer={handleToggleAnswer}
          canGoNext={quizState.currentQuestionIndex < quizState.totalQuestions - 1}
          canGoPrevious={quizState.currentQuestionIndex > 0}
          showingAnswer={quizState.showAnswer}
        />
      </div>
    </div>
  );
}