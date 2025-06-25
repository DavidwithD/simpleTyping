import React from "react";

export default function PasteFromClipboardButton({
  onPaste,
}: {
  onPaste: (text: string) => void;
}) {
  const [error, setError] = React.useState("");

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onPaste(text);
      setError("");
    } catch {
      setError("Failed to read from clipboard.");
    }
  };

  return (
    <>
      <button
        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        onClick={handlePaste}
      >
        Paste from Clipboard
      </button>
      {error && <span className="text-red-400 ml-2 text-sm">{error}</span>}
    </>
  );
}
