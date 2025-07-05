import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface SentenceNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  currentIndex: number;
  totalSentences: number;
}

export default function SentenceNavigation({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  currentIndex,
  totalSentences,
}: SentenceNavigationProps) {
  return (
    <div className="flex gap-4 items-center">
      <button
        className="p-2 bg-slate-800 rounded-full shadow hover:bg-slate-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        aria-label="Previous sentence"
        title={`Previous sentence (${currentIndex}/${totalSentences}) - Press ← Left Arrow`}
      >
        <FaArrowLeft
          size={20}
          className={!canGoPrevious ? "text-gray-500" : "text-gray-200"}
        />
      </button>

      <button
        className="p-2 bg-slate-800 rounded-full shadow hover:bg-slate-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
        onClick={onNext}
        disabled={!canGoNext}
        aria-label="Next sentence"
        title={`Next sentence (${currentIndex + 2}/${totalSentences}) - Press → Right Arrow`}
      >
        <FaArrowRight
          size={20}
          className={!canGoNext ? "text-gray-500" : "text-gray-200"}
        />
      </button>
    </div>
  );
}
