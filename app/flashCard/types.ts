export interface Question {
    id: string;
    question: string;
    answer: string;
    hint?: string;
  }
  
  export interface QuizState {
    currentQuestionIndex: number;
    totalQuestions: number;
    showAnswer: boolean;
    questions: Question[];
  }
  
  export interface QuizControlsProps {
    onNext: () => void;
    onPrevious: () => void;
    onToggleAnswer: () => void;
    canGoNext: boolean;
    canGoPrevious: boolean;
    showingAnswer: boolean;
  }
  
  export interface FlashcardProps {
    question: Question;
    showAnswer: boolean;
    onShowHint: () => void;
  }
  
  export interface ProgressProps {
    current: number;
    total: number;
  }