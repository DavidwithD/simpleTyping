import { useRef } from "react";

type CursorLockedInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const CursorLockedInput = ({ ...props }: CursorLockedInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const moveCursorToEnd = () => {
    const input = inputRef.current;
    if (input) {
      const length = input.value.length;
      input.setSelectionRange(length, length);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isArrorwKey =
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown";

    const isCmdA = (e.ctrlKey || e.metaKey) && (e.key === "a" || e.key === "A");

    if (
      isArrorwKey ||
      isCmdA ||
      e.key === "Home" ||
      e.key === "End" ||
      e.key === "PageUp" ||
      e.key === "PageDown" ||
      e.key === "Tab" ||
      e.key === "Enter" ||
      e.key === "Escape"
    ) {
      e.preventDefault();
      setTimeout(moveCursorToEnd, 0);
    }
  };

  const handleInput = () => {
    moveCursorToEnd();
  };

  const handleFocus = () => {
    moveCursorToEnd();
  };

  return (
    <input
      ref={inputRef}
      type="text"
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      onFocus={handleFocus}
      {...props}
    />
  );
};

export default CursorLockedInput;
