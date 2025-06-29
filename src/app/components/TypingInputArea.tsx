import React from "react";
import PasteFromClipboardButton from "./PasteFromClipboardButton";

export default function TypingInputArea({
  value,
  setValue,
}: {
  value: string;
  setValue: (v: string) => void;
}) {
  return (
    <div className="w-full max-w-2xl mb-2 relative group">
      <textarea
        className="w-full h-24 p-4 text-lg bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Put the text here..."
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <PasteFromClipboardButton onPaste={setValue} />
      </div>
    </div>
  );
}
