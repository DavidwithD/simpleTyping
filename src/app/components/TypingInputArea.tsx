import React from "react";
import PasteFromClipboardButton from "./PasteFromClipboardButton";
import { MdChevronLeft, MdChevronRight, MdClose } from "react-icons/md";

export default function TypingInputArea({
  value,
  setValue,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onClear,
  showClear,
}: {
  value: string;
  setValue: (v: string) => void;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClear: () => void;
  showClear: boolean;
}) {
  return (
    <div className="w-full max-w-2xl mb-2 relative group">
      {/* Chevron left */}
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 bg-transparent text-gray-400 rounded-full opacity-30 group-hover:opacity-80 group-hover:bg-gray-600 group-hover:text-white transition-all duration-200 hover:bg-gray-700 hover:text-white focus:outline-none"
        onClick={onPrev}
        disabled={!hasPrev}
        aria-label="Previous"
      >
        <MdChevronLeft size={24} />
      </button>
      {/* Chevron right */}
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1 bg-transparent text-gray-400 rounded-full opacity-30 group-hover:opacity-80 group-hover:bg-gray-600 group-hover:text-white transition-all duration-200 hover:bg-gray-700 hover:text-white focus:outline-none"
        onClick={onNext}
        disabled={!hasNext}
        aria-label="Next"
      >
        <MdChevronRight size={24} />
      </button>
      {/* Close button */}
      {showClear && (
        <button
          className="absolute top-2 right-2 z-10 p-1 bg-transparent text-gray-400 rounded-full opacity-40 group-hover:opacity-90 group-hover:bg-red-600 group-hover:text-white transition-all duration-200 hover:bg-red-700 hover:text-white focus:outline-none"
          onClick={onClear}
          aria-label="Clear"
        >
          <MdClose size={20} />
        </button>
      )}
      <textarea
        className="w-full h-64 p-4 text-lg bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Put the text here..."
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex justify-end mt-2">
        <PasteFromClipboardButton onPaste={setValue} />
      </div>
    </div>
  );
}
