// src/screens/receive/ReceiveScreen.jsx
import { useState } from "react";
import {
  Check,
  Clock,
  Copy,
  Info,
  Link as LinkIcon,
  QrCode,
  Share2,
  Zap,
} from "lucide-react";
import HomeIndicator from "../../components/HomeIndicator";
import NoteBox from "../../components/NoteBox";
import PrimaryButton from "../../components/PrimaryButton";
import ScreenHeader from "../../components/ScreenHeader";
import StatusBar from "../../components/StatusBar";
import { DEMO_OWN_ADDRESS } from "../../config";

export default function ReceiveScreen({
  wallet,
  onBack,
  onRequestCreated,
  isFirstTime = false,
}) {
  const [showGuideOverlay, setShowGuideOverlay] = useState(isFirstTime);
  const [mode, setMode] = useState("lightning"); // "lightning" | "onchain"
  const [isReusable, setIsReusable] = useState(false);
  const [amountInput, setAmountInput] = useState("");
  const [copied, setCopied] = useState(false);

  const lightningInvoice =
    "lnbc2500u1p3x0wlhpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdpk22ex2cqzpgxq97zvuq8vqqx4qz9s";
  const lightningAddress = `${wallet.account.toLowerCase()}@anchor.me`;
  const onchainAddress = wallet.ownAddress || DEMO_OWN_ADDRESS;

  const currentDisplayAddress =
    mode === "lightning"
      ? isReusable
        ? lightningAddress
        : lightningInvoice
      : onchainAddress;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentDisplayAddress);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (onRequestCreated) {
      onRequestCreated({
        id: `req-${Date.now()}`,
        address: currentDisplayAddress,
        amount: amountInput ? parseInt(amountInput, 10) : 0,
        network: mode === "lightning" ? "lightning" : "bitcoin",
        time: "just now",
        isRequest: true,
      });
    }
    alert("Payment request shared and saved to your transactions!");
    onBack();
  };

  return (
    <div className="wallet-screen">
      <StatusBar />
      <ScreenHeader
        title="Receive Bitcoin"
        subTitle={wallet.account}
        onBack={onBack}
      />

      {/* ------------------------------------------------------------- */}
      {/* First-Time Guide Overlay                                       */}
      {/* ------------------------------------------------------------- */}
      {showGuideOverlay ? (
        <div
          className="screen-content"
          style={{
            justifyContent: "space-between",
            padding: "8px 20px 16px",
          }}
        >
          <div>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: "#E7EEFF",
                color: "#0051FE",
                display: "grid",
                placeItems: "center",
                margin: "12px 0 16px",
              }}
            >
              <Info size={30} />
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#080B0A", margin: "0 0 8px" }}>
              Receiving for the first time?
            </h2>
            <p style={{ fontSize: 14, color: "#61666E", lineHeight: "20px", margin: "0 0 24px" }}>
              Bitcoin has two ways to receive funds. Choose the one that matches how you're being paid.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Option 1: Lightning */}
              <div
                onClick={() => {
                  setMode("lightning");
                  setShowGuideOverlay(false);
                }}
                style={{
                  border: "1.5px solid #0051FE",
                  background: "#E7EEFF",
                  borderRadius: 14,
                  padding: "16px",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <Zap size={20} color="#0051FE" />
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#0051FE" }}>
                    Lightning (Recommended)
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "#4D4D52", margin: 0, lineHeight: "18px" }}>
                  Fastest and cheapest. Perfect for small, everyday amounts. Arrives in seconds with
                  almost zero fees.
                </p>
              </div>

              {/* Option 2: On-chain */}
              <div
                onClick={() => {
                  setMode("onchain");
                  setShowGuideOverlay(false);
                }}
                style={{
                  border: "1px solid #E7E7E7",
                  background: "#FFFFFF",
                  borderRadius: 14,
                  padding: "16px",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <LinkIcon size={20} color="#61666E" />
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#080B0A" }}>
                    Bitcoin On-chain
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "#61666E", margin: 0, lineHeight: "18px" }}>
                  Direct on the Bitcoin blockchain. Best for larger transfers or cold storage wallets.
                  Takes 10–60 minutes.
                </p>
              </div>
            </div>
          </div>

          <div style={{ paddingBottom: 8 }}>
            <PrimaryButton onClick={() => setShowGuideOverlay(false)}>Continue</PrimaryButton>
          </div>
        </div>
      ) : (
        /* ----------------------------------------------------------- */
        /* Standard Receive Screen                                     */
        /* ----------------------------------------------------------- */
        <div className="screen-content" style={{ padding: "0 16px 12px" }}>
          {/* Lightning / On-chain Mode Switcher */}
          <div
            style={{
              display: "flex",
              background: "#EEF0F4",
              borderRadius: 100,
              padding: 4,
              margin: "6px 0 16px",
            }}
          >
            <button
              type="button"
              onClick={() => setMode("lightning")}
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: 100,
                fontSize: 14,
                fontWeight: 600,
                border: "none",
                background: mode === "lightning" ? "#0051FE" : "transparent",
                color: mode === "lightning" ? "#FFFFFF" : "#61666E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                cursor: "pointer",
              }}
            >
              <Zap size={15} />
              Lightning
            </button>

            <button
              type="button"
              onClick={() => setMode("onchain")}
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: 100,
                fontSize: 14,
                fontWeight: 600,
                border: "none",
                background: mode === "onchain" ? "#0051FE" : "transparent",
                color: mode === "onchain" ? "#FFFFFF" : "#61666E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                cursor: "pointer",
              }}
            >
              <LinkIcon size={15} />
              On-chain
            </button>
          </div>

          {/* Simulated QR Code Card */}
          <div
            style={{
              background: "#F4F4F6",
              borderRadius: 16,
              padding: "20px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* SVG QR Code Mockup */}
            <div
              style={{
                width: 180,
                height: 180,
                background: "#FFFFFF",
                borderRadius: 12,
                padding: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <svg viewBox="0 0 100 100" width="100%" height="100%" fill="#080B0A">
                {/* QR Pattern Representation */}
                <rect x="0" y="0" width="30" height="30" rx="3" fill="#080B0A" />
                <rect x="5" y="5" width="20" height="20" rx="2" fill="#FFFFFF" />
                <rect x="9" y="9" width="12" height="12" rx="1" fill="#080B0A" />

                <rect x="70" y="0" width="30" height="30" rx="3" fill="#080B0A" />
                <rect x="75" y="5" width="20" height="20" rx="2" fill="#FFFFFF" />
                <rect x="79" y="9" width="12" height="12" rx="1" fill="#080B0A" />

                <rect x="0" y="70" width="30" height="30" rx="3" fill="#080B0A" />
                <rect x="5" y="75" width="20" height="20" rx="2" fill="#FFFFFF" />
                <rect x="9" y="79" width="12" height="12" rx="1" fill="#080B0A" />

                <rect x="36" y="8" width="6" height="16" rx="1" fill="#080B0A" />
                <rect x="48" y="12" width="14" height="6" rx="1" fill="#080B0A" />
                <rect x="36" y="36" width="28" height="28" rx="2" fill="#0051FE" />
                <rect x="12" y="44" width="16" height="8" rx="1" fill="#080B0A" />
                <rect x="72" y="44" width="18" height="6" rx="1" fill="#080B0A" />
                <rect x="44" y="76" width="18" height="14" rx="1" fill="#080B0A" />
                <rect x="74" y="74" width="16" height="16" rx="1" fill="#080B0A" />
              </svg>
            </div>

            {/* Address String & Copy Button */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                width: "100%",
                background: "#FFFFFF",
                borderRadius: 10,
                padding: "8px 12px",
                marginTop: 16,
                border: "1px solid #E7E7E7",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#080B0A",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {currentDisplayAddress}
              </span>

              <button
                type="button"
                onClick={handleCopy}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 13,
                  fontWeight: 600,
                  color: copied ? "#19A86B" : "#0051FE",
                  flexShrink: 0,
                  padding: "4px 8px",
                  borderRadius: 6,
                  background: copied ? "#E6F7EE" : "#E7EEFF",
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            {/* Context meta info */}
            {mode === "lightning" ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12,
                  color: "#989CA3",
                  marginTop: 10,
                }}
              >
                <Clock size={13} />
                <span>Valid for 1 hour · Arrives in seconds</span>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: "#989CA3", marginTop: 10 }}>
                Confirmation requires 1 block on-chain (approx. 10–60 min)
              </div>
            )}
          </div>

          {/* Lightning specific: Reusable vs Single-Use Toggle */}
          {mode === "lightning" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                background: "#F4F4F6",
                borderRadius: 12,
                marginTop: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#080B0A" }}>
                  {isReusable ? "Reusable Lightning Address" : "Single-Use Invoice"}
                </div>
                <div style={{ fontSize: 12, color: "#61666E", marginTop: 2 }}>
                  {isReusable
                    ? "Can be used repeatedly like an email address"
                    : "Expires after being paid once for maximum privacy"}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsReusable(!isReusable)}
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 100,
                  background: isReusable ? "#0051FE" : "#DEDEE0",
                  position: "relative",
                  transition: "background 0.2s",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#FFFFFF",
                    position: "absolute",
                    top: 2,
                    left: isReusable ? 22 : 2,
                    transition: "left 0.2s",
                  }}
                />
              </button>
            </div>
          )}

          {/* On-chain Fee Info Note */}
          {mode === "onchain" && (
            <div style={{ marginTop: 10 }}>
              <NoteBox type="info" title="Network fee information">
                The sender pays the Bitcoin network fee when sending to this address. Anchor does not
                charge any deposit fees.
              </NoteBox>
            </div>
          )}

          {/* Optional Amount Input Field */}
          <div
            style={{
              background: "#F4F4F6",
              borderRadius: 12,
              padding: "10px 14px",
              marginTop: 10,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 500, color: "#81848B", marginBottom: 4 }}>
              Specify amount (optional)
            </div>
            <input
              type="number"
              placeholder="0 sats"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 16,
                fontWeight: 600,
                color: "#080B0A",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Share Button */}
          <div style={{ marginTop: 16 }}>
            <PrimaryButton icon={<Share2 size={18} />} onClick={handleShare}>
              Share payment request
            </PrimaryButton>
          </div>
        </div>
      )}

      <HomeIndicator />
    </div>
  );
}
