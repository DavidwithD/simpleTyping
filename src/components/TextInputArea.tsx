import React from "react";
import PasteFromClipboardButton from "./PasteFromClipboardButton";

interface TextInputAreaProps {
  value: string;
  setValue: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  showPasteButton?: boolean;
}

export default function TextInputArea({
  value,
  setValue,
  placeholder = "Enter text...",
  autoFocus = false,
  className = "",
  showPasteButton = true,
}: TextInputAreaProps) {
  return (
    <div
      className={`w-full max-w-2xl relative group flex flex-col ${className}`}
    >
      <textarea
        className="w-full flex-1 p-4 text-lg bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder={placeholder}
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {showPasteButton && (
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <PasteFromClipboardButton onPaste={setValue} />
        </div>
      )}
    </div>
  );
}
