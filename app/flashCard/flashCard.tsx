'use client';

import { useState } from 'react';
import { FlashcardProps } from './types';
import { Volume2, Star } from 'lucide-react';

const Flashcard: React.FC<FlashcardProps> = ({ question, showAnswer, onShowHint }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  if(!question){
    return <div>no question</div>
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-slate-800 rounded-lg p-8 min-h-[300px] relative">
        <div className="absolute top-4 right-4 flex gap-4">
          <button
            onClick={() => onShowHint()}
            className="text-white/70 hover:text-white transition-colors"
          >
            <Volume2 size={16} />
          </button>
          <button
            onClick={handleBookmark}
            className={`${
              isBookmarked ? 'text-yellow-400' : 'text-white/70'
            } hover:text-yellow-400 transition-colors`}
          >
            <Star size={16} />
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-white text-2xl text-center mb-8 p-3">
            {showAnswer ? question.answer : question.question}
          </div>
          
          {question.hint && (
            <div className="text-white/60 text-sm mt-4">
              Hint available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Flashcard;