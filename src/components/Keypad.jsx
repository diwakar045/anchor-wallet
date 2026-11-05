// src/components/Keypad.jsx
import { Delete } from "lucide-react";
import { track } from "../track";

export default function Keypad({
  onDigit,
  onDelete,
  onDot,
  hideDot = false,
  screenName = "keypad",
}) {
  const handleDigitTap = (digit) => {
    track("tap", { screen: screenName, target: `keypad_${digit}` });
    if (onDigit) onDigit(digit);
  };

  const handleDeleteTap = () => {
    track("tap", { screen: screenName, target: "keypad_backspace" });
    if (onDelete) onDelete();
  };

  const handleDotTap = () => {
    track("tap", { screen: screenName, target: "keypad_dot" });
    if (onDot) onDot();
  };

  return (
    <div className="keypad-grid" role="group" aria-label="Keypad">
      <button type="button" className="keypad-key" onClick={() => handleDigitTap("1")}>1</button>
      <button type="button" className="keypad-key" onClick={() => handleDigitTap("2")}>2</button>
      <button type="button" className="keypad-key" onClick={() => handleDigitTap("3")}>3</button>

      <button type="button" className="keypad-key" onClick={() => handleDigitTap("4")}>4</button>
      <button type="button" className="keypad-key" onClick={() => handleDigitTap("5")}>5</button>
      <button type="button" className="keypad-key" onClick={() => handleDigitTap("6")}>6</button>

      <button type="button" className="keypad-key" onClick={() => handleDigitTap("7")}>7</button>
      <button type="button" className="keypad-key" onClick={() => handleDigitTap("8")}>8</button>
      <button type="button" className="keypad-key" onClick={() => handleDigitTap("9")}>9</button>

      {hideDot ? (
        <div className="keypad-key blank" aria-hidden="true" />
      ) : (
        <button
          type="button"
          className="keypad-key"
          onClick={handleDotTap}
          aria-label="Decimal point"
        >
          .
        </button>
      )}

      <button type="button" className="keypad-key" onClick={() => handleDigitTap("0")}>0</button>

      <button
        type="button"
        className="keypad-key"
        onClick={handleDeleteTap}
        aria-label="Backspace"
      >
        <Delete size={26} strokeWidth={1.8} />
      </button>
    </div>
  );
}
