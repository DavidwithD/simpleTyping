export type TypingHistoryItem = {
  id: string;
  originalText: string;
  typingText: string;
  createdAt: number;
};

export type Folder = {
  id: string;
  name: string;
  createdAt: number;
};
