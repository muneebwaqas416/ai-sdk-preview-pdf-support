'use client';

import { useState, useEffect } from 'react';
import { Question, QuizState } from './types';
import Flashcard from './flashCard';
import QuizControls from './QuizControls';
import Progress from './Progress';

export default function Page() {
  const [sampleQuestions, setSampleQuestions] = useState<Question[]>([]);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    totalQuestions: sampleQuestions.length,
    showAnswer: false,
    questions: sampleQuestions,
  });

  useEffect(() => {
    console.log(sampleQuestions)
  }, [sampleQuestions])
  

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFlashCards = sessionStorage.getItem("flashCard");
      if (storedFlashCards) {
        console.log(JSON.parse(storedFlashCards))
        setSampleQuestions(JSON.parse(storedFlashCards));
      }
    }
  }, []);

  useEffect(() => {
    setQuizState(prev => ({
      ...prev,
      questions: sampleQuestions,
      totalQuestions: sampleQuestions.length,
    }));
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
    <div className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8 text-center">
          Finance Quiz 1
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