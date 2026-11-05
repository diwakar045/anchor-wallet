// src/screens/receive/SetAmountSheet.jsx
// Pixel-perfect "Set amount" bottom sheet matching the Figma screenshot

import { useState } from "react";
import { ArrowDownUp, QrCode, X } from "lucide-react";
import HomeIndicator from "../../components/HomeIndicator";
import Keypad from "../../components/Keypad";
import { formatSats, satsToFiat } from "../../config";

export default function SetAmountSheet({
  isOpen = true,
  onClose,
  onGenerate,
  initialAmount = null,
}) {
  const [amountStr, setAmountStr] = useState(
    initialAmount ? String(initialAmount) : "0"
  );

  if (!isOpen) return null;

  const amount = parseInt(amountStr, 10) || 0;

  const handleDigit = (digit) => {
    setAmountStr((prev) => {
      if (prev === "0") return digit;
      if (prev.length >= 8) return prev;
      return prev + digit;
    });
  };

  const handleDelete = () => {
    setAmountStr((prev) => {
      if (prev.length <= 1) return "0";
      return prev.slice(0, -1);
    });
  };

  const handleGenerate = () => {
    if (onGenerate) {
      onGenerate(amount);
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
          maxHeight: "92%",
        }}
      >
        {/* ── Header: Title & Close Button ─────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
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
            Set amount
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

        {/* ── Amount Display Block (Matching Screenshot) ───────── */}
        <div
          style={{
            textAlign: "center",
            padding: "8px 0 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 56,
                fontWeight: 600,
                color: "#0051FE",
                lineHeight: 1,
                letterSpacing: "-1.5px",
              }}
            >
              {formatSats(amount)}
            </span>
            <span
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: "#080B0A",
              }}
            >
              sats
            </span>
            <button
              type="button"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "0 0 0 6px",
                display: "inline-flex",
                alignItems: "center",
                color: "#61666E",
              }}
              aria-label="Toggle currency unit"
            >
              <ArrowDownUp size={18} strokeWidth={2} />
            </button>
          </div>

          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#81848B",
              marginTop: 6,
            }}
          >
            {satsToFiat(amount)}
          </div>
        </div>

        {/* ── Keypad for Typing Amount ─────────────────────────── */}
        <div style={{ margin: "4px auto 16px", width: "100%", maxWidth: 360 }}>
          <Keypad
            onDigit={handleDigit}
            onDelete={handleDelete}
            hideDot
          />
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
