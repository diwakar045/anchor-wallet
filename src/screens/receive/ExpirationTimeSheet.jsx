// src/screens/receive/ExpirationTimeSheet.jsx
// Pixel-perfect "Expiration time" bottom sheet matching the Figma screenshot

import { useState } from "react";
import { Check, QrCode, X } from "lucide-react";
import HomeIndicator from "../../components/HomeIndicator";

const EXPIRATION_OPTIONS = [
  { id: "24h", label: "24 hours", displayTime: "in 24 hours" },
  { id: "12h", label: "12 hours", displayTime: "in 12 hours" },
  { id: "4h", label: "4 hours", displayTime: "in 4 hours" },
  { id: "1h", label: "1 hours", displayTime: "12:56 AM" }, // Matches "1 hours" typo in Figma
];

export default function ExpirationTimeSheet({
  isOpen = true,
  onClose,
  onGenerate,
  currentOption = "1 hours",
}) {
  const [selected, setSelected] = useState(currentOption || "1 hours");

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (onGenerate) {
      const match = EXPIRATION_OPTIONS.find((opt) => opt.label === selected);
      onGenerate(selected, match ? match.displayTime : selected);
    }
    onClose();
  };

  return (
    <div
      className="sheet-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bottom-sheet"
        style={{
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: "20px 20px 16px",
          background: "#FFFFFF",
        }}
      >
        {/* ── Header: Title & Close Button ─────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#080B0A",
              margin: 0,
              letterSpacing: "-0.32px",
            }}
          >
            Expiration time
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 36,
              height: 36,
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              color: "#080B0A",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <X size={20} strokeWidth={2.2} />
          </button>
        </div>

        {/* ── Options List with Dividers (Matching Screenshot) ──── */}
        <div style={{ display: "flex", flexDirection: "column", margin: "4px 0 20px" }}>
          {EXPIRATION_OPTIONS.map((option) => {
            const isSelected = selected === option.label;
            return (
              <div
                key={option.id}
                onClick={() => setSelected(option.label)}
                style={{
                  borderTop: "1px solid #EEF0F4",
                  height: 54,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: isSelected ? 600 : 500,
                    color: isSelected ? "#0051FE" : "#080B0A",
                    letterSpacing: "-0.2px",
                  }}
                >
                  {option.label}
                </span>

                {isSelected && (
                  <Check size={18} color="#0051FE" strokeWidth={2.5} />
                )}
              </div>
            );
          })}
          <div style={{ borderTop: "1px solid #EEF0F4" }} />
        </div>

        {/* ── Footer Actions: [⊞ Generate] & Cancel ───────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            paddingTop: 8,
          }}
        >
          <button
            type="button"
            className="btn-primary"
            onClick={handleGenerate}
            style={{
              flex: 1,
              height: 54,
              borderRadius: 33,
              background: "#0051FE",
              color: "#FFFFFF",
              fontSize: 17,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              border: "none",
              cursor: "pointer",
            }}
          >
            <QrCode size={20} strokeWidth={2} />
            <span>Generate</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: "#080B0A",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "10px 16px",
            }}
          >
            Cancel
          </button>
        </div>

        <HomeIndicator />
      </div>
    </div>
  );
}
