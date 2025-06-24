"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type TextContextType = {
  text: string;
  setText: (value: string) => void;
};

const TextContext = createContext<TextContextType | undefined>(undefined);

export function TextProvider({ children }: { children: ReactNode }) {
  const [text, setText] = useState<string>("");
  return (
    <TextContext.Provider value={{ text, setText }}>
      {children}
    </TextContext.Provider>
  );
}

export function useText() {
  const context = useContext(TextContext);
  if (!context) throw new Error("useText must be used within a TextProvider");
  return context;
}
