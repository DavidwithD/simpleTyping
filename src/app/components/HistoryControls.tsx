import React from "react";

function HistoryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "px-3 py-2 text-white rounded-lg disabled:opacity-40 focus:outline-none";
  return (
    <button className={`${base} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default function HistoryControls({
  onPrev,
  onNext,
  onClear,
  hasPrev,
  hasNext,
  canClear,
}: {
  onPrev: () => void;
  onNext: () => void;
  onClear: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  canClear: boolean;
}) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <HistoryButton
        className="bg-gray-600 hover:bg-gray-700"
        onClick={onPrev}
        disabled={!hasPrev}
      >
        Prev
      </HistoryButton>
      <HistoryButton
        className="bg-red-600 hover:bg-red-700"
        onClick={onClear}
        disabled={!canClear}
      >
        Clear
      </HistoryButton>
      <HistoryButton
        className="bg-gray-600 hover:bg-gray-700"
        onClick={onNext}
        disabled={!hasNext}
      >
        Next
      </HistoryButton>
    </div>
  );
}
