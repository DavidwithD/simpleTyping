"use client";
import React from "react";
import { useText } from "../context/TextContext";
import CursorLockedInput from "@/app/components/CursorLockInput/index";
import { useRouter } from "next/navigation";
import RemainingSpan from "../components/RemainSpan";
import SettingsToggle from "../components/SettingToggle";

export default function TypingPage() {
  const { text } = useText();
  const [value, setValue] = React.useState<string>("");
  const [showRemaining, setShowRemaining] = React.useState(true);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { identical, incorrect, remaining } = compareStr(text, value);

  React.useEffect(() => {
    if (identical.length === text.length) {
      router.push("/typing/finished");
    }
  }, [identical.length, text.length, router]);

  if (identical.length === text.length) {
    return null;
  }

  if (text.length === 0) {
    router.push("/");
    return null;
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Settings Floating Area */}
      <SettingsToggle
        showRemaining={showRemaining}
        setShowRemaining={setShowRemaining}
      />
      {/* input is invisible but always on focus */}
      <CursorLockedInput
        ref={inputRef}
        className="fixed top-0 left-0 w-full h-full opacity-0 pointer-events-none cursor-none"
        autoFocus
        autoComplete="off"
        spellCheck="false"
        tabIndex={-1}
        value={value}
        onBlur={() => inputRef.current?.focus()}
        onChange={(e) => setValue(e.target.value)}
      />
      {/* Display all text */}
      <div
        className="max-w-2xl p-4 bg-gray-800 rounded-lg shadow-lg text-2xl text-white break-all"
        style={{ lineHeight: "5rem" }}
      >
        <span className="text-white mb-4">{identical}</span>
        <span className="text-green-500">{incorrect}</span>
        <RemainingSpan
          remaining={remaining}
          showRemaining={showRemaining}
          highlightFirstSpace
        />
      </div>
    </div>
  );
}

function compareStr(answer: string, current: string) {
  const minLength = Math.min(answer.length, current.length);
  const temp = [];
  for (let i = 0; i < minLength; i++) {
    if (current[i] == " " || answer[i] === current[i]) {
      temp.push(answer[i]);
    } else break;
  }

  const identical = temp.join("");
  const incorrect = current.slice(identical.length);
  const remaining = answer.slice(identical.length + incorrect.length);

  return {
    identical,
    incorrect,
    remaining,
  };
}
