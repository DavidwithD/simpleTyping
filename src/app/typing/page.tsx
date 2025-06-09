"use client";
import React from "react";
import { useText } from "../context/TextContext";
import CursorLockedInput from "@/app/components/CursorLockInput/index";

export default function TypingPage() {
  const { text } = useText();
  const [value, setValue] = React.useState<string>("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const compare = (answer: string, current: string) => {
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
  };

  const { identical, incorrect, remaining } = compare(text, value);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4"
      onClick={() => inputRef.current?.focus()}
    >
      <CursorLockedInput
        ref={inputRef}
        className="fixed top-0 left-0 w-full h-full opacity-10 pointer-events-none"
        autoFocus
        autoComplete="off"
        spellCheck="false"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div
        className="max-w-2xl p-4 bg-gray-800 rounded-lg shadow-lg text-2xl text-white break-all"
        style={{ lineHeight: "5rem" }}
      >
        <span className="text-white mb-4">{identical}</span>
        <span className="text-green-500">{incorrect}</span>
        <RemaingSpan remaining={remaining} />
      </div>
    </div>
  );
}

function RemaingSpan({ remaining }: { remaining: string }) {
  return (
    <>
      <span
        className="text-yellow-400"
        ref={(el) => {
          if (el) {
            el.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "center",
            });
          }
        }}
      >
        {remaining[0]}
      </span>
      <span className="text-gray-500">{remaining.slice(1)}</span>
    </>
  );
}
