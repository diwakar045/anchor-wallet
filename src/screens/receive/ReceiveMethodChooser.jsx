// src/screens/receive/ReceiveMethodChooser.jsx
// First-time receive method bottom sheet matching the exact Figma screenshot
// Props: onClose, onContinue(method: "lightning" | "onchain")

import { useState } from "react";
import { Link as LinkIcon, X, Zap } from "lucide-react";
import HomeIndicator from "../../components/HomeIndicator";
import PrimaryButton from "../../components/PrimaryButton";
import { track } from "../../track";

export default function ReceiveMethodChooser({
  isOpen = true,
  onClose,
  onContinue,
}) {
  const [selectedMethod, setSelectedMethod] = useState("lightning"); // "lightning" | "onchain"

  if (!isOpen) return null;

  const handleClose = () => {
    track("guide_dismissed", { step: "receive_chooser" });
    if (onClose) onClose();
  };

  const handleContinue = () => {
    track("guide_completed", { step: "receive_chooser" });
    track("tap", { screen: "receive_chooser", target: `receive_method_${selectedMethod}` });
    if (onContinue) {
      onContinue(selectedMethod);
    }
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
          padding: "24px 20px 16px",
          background: "#FFFFFF",
          maxHeight: "90%",
        }}
      >
        {/* ── Header: Title & Close Button ─────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <div style={{ flex: 1, paddingRight: 12 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#080B0A",
                margin: "0 0 6px",
                letterSpacing: "-0.32px",
              }}
            >
              Receiving Bitcoin for the first time?
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "#989CA3",
                margin: 0,
                fontWeight: 400,
                letterSpacing: "-0.2px",
              }}
            >
              Lets guide you through it.
            </p>
          </div>

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
              flexShrink: 0,
              marginTop: -4,
              marginRight: -4,
            }}
          >
            <X size={20} strokeWidth={2.2} />
          </button>
        </div>

        {/* ── Prompt Label ─────────────────────────────────────── */}
        <div
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: "#080B0A",
            margin: "24px 0 16px",
            letterSpacing: "-0.2px",
          }}
        >
          Choose how you want to receive the payment.
        </div>

        {/* ── Option Cards ─────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Option 1: Lightning */}
          <div
            onClick={() => setSelectedMethod("lightning")}
            style={{
              borderRadius: 14,
              padding: "16px 16px 14px",
              border:
                selectedMethod === "lightning"
                  ? "1.5px solid #6E9BFF"
                  : "1px solid #E7E7E7",
              background:
                selectedMethod === "lightning" ? "#EBF2FF" : "#FFFFFF",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {/* Title with icon */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <Zap
                size={18}
                strokeWidth={2.4}
                fill={selectedMethod === "lightning" ? "#0051FE" : "none"}
                color={selectedMethod === "lightning" ? "#0051FE" : "#080B0A"}
              />
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color:
                    selectedMethod === "lightning" ? "#0051FE" : "#080B0A",
                  letterSpacing: "-0.2px",
                }}
              >
                Lightning
              </span>
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: 14,
                lineHeight: "20px",
                margin: "0 0 12px",
                color:
                  selectedMethod === "lightning" ? "#3C6CE7" : "#61666E",
                letterSpacing: "-0.15px",
              }}
            >
              Instant payments with minimal fees. Best for small amounts.
            </p>

            {/* Expected time (right aligned) */}
            <div
              style={{
                textAlign: "right",
                fontSize: 13,
                letterSpacing: "-0.1px",
              }}
            >
              <span style={{ color: "#81848B" }}>Expected time: </span>
              <strong style={{ color: "#080B0A", fontWeight: 600 }}>
                a few seconds
              </strong>
            </div>
          </div>

          {/* Option 2: On-chain */}
          <div
            onClick={() => setSelectedMethod("onchain")}
            style={{
              borderRadius: 14,
              padding: "16px 16px 14px",
              border:
                selectedMethod === "onchain"
                  ? "1.5px solid #6E9BFF"
                  : "1px solid #E7E7E7",
              background:
                selectedMethod === "onchain" ? "#EBF2FF" : "#FFFFFF",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {/* Title with icon */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <LinkIcon
                size={18}
                strokeWidth={2.4}
                color={selectedMethod === "onchain" ? "#0051FE" : "#080B0A"}
              />
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color:
                    selectedMethod === "onchain" ? "#0051FE" : "#080B0A",
                  letterSpacing: "-0.2px",
                }}
              >
                On-chain
              </span>
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: 14,
                lineHeight: "20px",
                margin: "0 0 12px",
                color:
                  selectedMethod === "onchain" ? "#3C6CE7" : "#61666E",
                letterSpacing: "-0.15px",
              }}
            >
              Regular Bitcoin transfer. Secure but can take a few minutes.
            </p>

            {/* Expected time (right aligned) */}
            <div
              style={{
                textAlign: "right",
                fontSize: 13,
                letterSpacing: "-0.1px",
              }}
            >
              <span style={{ color: "#81848B" }}>Expected time: </span>
              <strong style={{ color: "#080B0A", fontWeight: 600 }}>
                ~10-30 minutes
              </strong>
            </div>
          </div>
        </div>

        {/* ── Primary Action Button ────────────────────────────── */}
        <div style={{ marginTop: 28, paddingBottom: 4 }}>
          <PrimaryButton onClick={handleContinue}>Continue</PrimaryButton>
        </div>

        <HomeIndicator />
      </div>
    </div>
  );
}
