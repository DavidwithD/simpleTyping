import { forwardRef } from "react";

type CursorLockedInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const CursorLockedInput = forwardRef<HTMLInputElement, CursorLockedInputProps>(
  (props, ref) => {
    if (!ref) {
      throw new Error("Ref is required for InputWithRef component");
    }
    const moveCursorToEnd = () => {
      let input: HTMLInputElement | null = null;
      if (typeof ref === "function") {
        // Not possible to get the current value from a function ref
        // So we can't support moving the cursor in this case
        return;
      } else if (ref && "current" in ref) {
        input = ref.current;
      }
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

      const isCmdA =
        (e.ctrlKey || e.metaKey) && (e.key === "a" || e.key === "A");

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
        ref={ref}
        type="text"
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onFocus={handleFocus}
        {...props}
      />
    );
  },
);

CursorLockedInput.displayName = "InputWithRef";

export default CursorLockedInput;
