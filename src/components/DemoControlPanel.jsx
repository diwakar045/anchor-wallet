// src/components/DemoControlPanel.jsx
import { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Sliders, Sparkles } from "lucide-react";
import { PRESET_INPUTS } from "../config";

export default function DemoControlPanel({
  wallet,
  setWallet,
  currentScreen,
  goToScreen,
  onQuickFillRecipient,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleLargeBalance = () => {
    if (wallet.balance > 100000) {
      setWallet((prev) => ({
        ...prev,
        balance: 567,
        fiat: "$0.79",
      }));
    } else {
      setWallet((prev) => ({
        ...prev,
        balance: 5000000,
        fiat: "$7,000.00",
      }));
    }
  };

  const isLargeBalance = wallet.balance > 100000;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 12,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Collapsible Panel */}
      {isOpen && (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(12px)",
            borderRadius: 16,
            boxShadow: "0 10px 40px rgba(0, 30, 80, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.08)",
            padding: "16px 20px",
            marginBottom: 8,
            maxWidth: "92vw",
            width: 580,
            animation: "slideUp 0.2s ease-out",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 14 }}>
              <Sparkles size={16} color="#0051FE" />
              <span>Anchor Interactive Demo Controls</span>
            </div>
            <span style={{ fontSize: 12, color: "#61666E" }}>
              Screen: <strong>{currentScreen}</strong>
            </span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            <button
              type="button"
              className={`demo-btn ${currentScreen === "onboarding" ? "active" : ""}`}
              onClick={() => goToScreen("onboarding")}
            >
              Onboarding
            </button>

            <button
              type="button"
              className={`demo-btn ${currentScreen === "home" ? "active" : ""}`}
              onClick={() => goToScreen("home")}
            >
              Home (Funded)
            </button>

            <button
              type="button"
              className={`demo-btn ${currentScreen === "receive_lightning" ? "active" : ""}`}
              onClick={() => goToScreen("receive_lightning")}
            >
              Receive: Lightning
            </button>

            <button
              type="button"
              className={`demo-btn ${currentScreen === "receive_onchain" ? "active" : ""}`}
              onClick={() => goToScreen("receive_onchain")}
            >
              Receive: On-chain
            </button>

            <button
              type="button"
              className={`demo-btn ${isLargeBalance ? "active" : ""}`}
              onClick={toggleLargeBalance}
            >
              {isLargeBalance ? "5M Sats (Active)" : "Toggle 5M Sats"}
            </button>
          </div>

          <div style={{ fontSize: 12, fontWeight: 600, color: "#81848B", marginBottom: 6 }}>
            SAMPLE EDGE-CASE RECIPIENTS (Click to copy or fill):
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 6,
              maxHeight: 180,
              overflowY: "auto",
            }}
          >
            {Object.entries(PRESET_INPUTS).map(([key, item]) => (
              <button
                type="button"
                key={key}
                onClick={() => {
                  if (onQuickFillRecipient) onQuickFillRecipient(item.value);
                  if (navigator.clipboard) navigator.clipboard.writeText(item.value);
                }}
                style={{
                  background: "#F4F4F6",
                  border: "1px solid #E7E7E7",
                  borderRadius: 8,
                  padding: "6px 10px",
                  fontSize: 12,
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
                title={item.value}
              >
                <span style={{ fontWeight: 600, color: "#080B0A" }}>{item.label}</span>
                <Copy size={12} color="#0051FE" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle pill */}
      <button
        type="button"
        onClick={() => setIsIsOpen(!isOpen)}
        style={{
          background: "rgba(8, 11, 10, 0.85)",
          backdropFilter: "blur(8px)",
          color: "#FFFFFF",
          border: "none",
          borderRadius: 100,
          padding: "6px 16px",
          fontSize: 13,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 6,
          boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
          cursor: "pointer",
        }}
      >
        <Sliders size={14} />
        <span>Demo Controls</span>
        {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>
    </div>
  );
}
