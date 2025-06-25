"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type TextContextType = {
  originalText: string;
  setOriginalText: (value: string) => void;
  typingText: string;
  setTypingText: (value: string) => void;
};

const TextContext = createContext<TextContextType | undefined>(undefined);

export function TextProvider({ children }: { children: ReactNode }) {
  const [originalText, setOriginalText] = useState<string>("");
  const [typingText, setTypingText] = useState<string>("");
  return (
    <TextContext.Provider
      value={{ originalText, setOriginalText, typingText, setTypingText }}
    >
      {children}
    </TextContext.Provider>
  );
}

export function useText() {
  const context = useContext(TextContext);
  if (!context) throw new Error("useText must be used within a TextProvider");
  return context;
}
