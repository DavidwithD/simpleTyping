import React, { useState } from "react";
import { languageOptions } from "../constants/languageOptions";

export default function TranslateArea({
  value,
  setValue
}: {
  value: string;
  setValue: (v: string) => void;
}) {
  const [targetLang, setTargetLang] = useState("auto");

  const handleTranslate = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {}
    const url = `https://translate.google.com/?sl=auto&tl=${targetLang}&text=${encodeURIComponent(value)}&op=translate`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full max-w-2xl mb-4">
      <textarea
        className="w-full h-24 p-4 text-lg bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        placeholder="Enter text to translate..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={handleTranslate}
        >
          Translate
        </button>
        <span className="text-white">to</span>
        <select
          className="px-2 py-1 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
        >
          {languageOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
