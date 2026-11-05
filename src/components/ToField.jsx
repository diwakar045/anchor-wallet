// src/components/ToField.jsx
import { useRef, useState } from "react";
import { X } from "lucide-react";
import { track } from "../track";

export default function ToField({
  value,
  chipValue,
  placeholder = "bc1...xx or name@domain",
  onChange,
  onPaste,
  onClear,
  status = "normal", // "normal" | "error" | "warning"
  disabled = false,
  screenName = "send_input",
}) {
  const [hasFocus, setHasFocus] = useState(false);
  const inputRef = useRef(null);

  const containerStatusClass =
    status === "error"
      ? "error"
      : status === "warning"
      ? "warning"
      : hasFocus
      ? "has-focus"
      : "";

  return (
    <div className={`to-field-container ${containerStatusClass}`}>
      <span className="to-label">To:</span>

      <div className="to-input-wrapper">
        {chipValue ? (
          <div className="recipient-chip">
            <span>{chipValue}</span>
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            className="to-input"
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
          />
        )}
      </div>

      {chipValue || value ? (
        <button
          type="button"
          className="clear-chip-btn"
          onClick={() => {
            track("tap", { screen: screenName, target: "clear_recipient" });
            if (onClear) onClear();
          }}
          aria-label="Clear recipient"
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      ) : (
        <button
          type="button"
          className="paste-chip-btn"
          onClick={() => {
            track("tap", { screen: screenName, target: "paste" });
            if (onPaste) onPaste();
          }}
          aria-label="Paste from clipboard"
        >
          Paste
        </button>
      )}
    </div>
  );
}
