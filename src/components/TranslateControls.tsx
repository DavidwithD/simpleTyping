import React from "react";
import { languageOptions } from "../constants/languageOptions";

interface TranslateControlsProps {
  targetLang: string;
  onTargetLangChange: (lang: string) => void;
  onTranslate: () => void;
  disabled?: boolean;
}

export default function TranslateControls({
  targetLang,
  onTargetLangChange,
  onTranslate,
  disabled = false,
}: TranslateControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
        onClick={onTranslate}
        disabled={disabled}
        tabIndex={-1}
      >
        Translate
      </button>
      <span className="text-white">to</span>
      <select
        className="px-2 py-1 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
        value={targetLang}
        onChange={(e) => onTargetLangChange(e.target.value)}
        disabled={disabled}
        tabIndex={-1}
      >
        {languageOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
