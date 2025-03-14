'use client';

import { QuizControlsProps } from './types';
import { ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';

const QuizControls: React.FC<QuizControlsProps> = ({
  onNext,
  onPrevious,
  onToggleAnswer,
  canGoNext,
  canGoPrevious,
  showingAnswer,
}) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={`p-4 rounded-full ${
          canGoPrevious
            ? 'bg-slate-700 hover:bg-slate-600 text-white'
            : 'bg-slate-800 text-slate-600 cursor-not-allowed'
        } transition-colors`}
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={onToggleAnswer}
        className="px-6 py-3 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center gap-2 transition-colors"
      >
        {showingAnswer ? (
          <>
            <EyeOff size={20} /> Hide Answer
          </>
        ) : (
          <>
            <Eye size={20} /> Show Answer
          </>
        )}
      </button>

      <button
        onClick={onNext}
        disabled={!canGoNext}
        className={`p-4 rounded-full ${
          canGoNext
            ? 'bg-slate-700 hover:bg-slate-600 text-white'
            : 'bg-slate-800 text-slate-600 cursor-not-allowed'
        } transition-colors`}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default QuizControls;