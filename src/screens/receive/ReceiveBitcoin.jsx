// src/screens/receive/ReceiveBitcoin.jsx
// Lightning Receive Screen matching the exact Figma design from the user's screenshot
// Fully interactive: Set amount sheet, Expiration time sheet, copy preview, and Share

import { useState } from "react";
import { ArrowLeft, Check, Copy, Link as LinkIcon, SquarePen, Zap } from "lucide-react";
import HomeIndicator from "../../components/HomeIndicator";
import PrimaryButton from "../../components/PrimaryButton";
import StatusBar from "../../components/StatusBar";
import { formatSats } from "../../config";
import ExpirationTimeSheet from "./ExpirationTimeSheet";
import SetAmountSheet from "./SetAmountSheet";
import { track } from "../../track";

export default function ReceiveBitcoin({
  lightningInvoice = "lnbc2500u1p3x0wlhpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdpk22ex2cqzpgxq97zvuq8vqqx4qz9s",
  onChainAddress = "",
  onBack,
  onEditAmount,
  onEditExpiration,
  onSwitchToOnChain,
  onShare,
  walletName = "Savings21",
}) {
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState(null);
  const [expirationLabel, setExpirationLabel] = useState("12:56 AM");
  const [expirationOption, setExpirationOption] = useState("1 hours");

  // Bottom sheets state
  const [isAmountSheetOpen, setIsAmountSheetOpen] = useState(false);
  const [isExpSheetOpen, setIsExpSheetOpen] = useState(false);

  // Full address for copying / sharing, and preview for UI display
  const fullAddress = lightningInvoice || "lnbc2500u1p3x0wlhpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdpk22ex2cqzpgxq97zvuq8vqqx4qz9s";
  const previewAddress = "ln9087fgryu...iou"; // Matches Figma frame preview exact copy

  const handleCopy = () => {
    track("tap", { screen: "receive_lightning", target: "copy_invoice" });
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullAddress);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenAmount = () => {
    if (onEditAmount) {
      onEditAmount();
    }
    setIsAmountSheetOpen(true);
  };

  const handleOpenExpiration = () => {
    if (onEditExpiration) {
      onEditExpiration();
    }
    setIsExpSheetOpen(true);
  };

  const handleGenerateAmount = (newAmount) => {
    setAmount(newAmount > 0 ? newAmount : null);
  };

  const handleGenerateExpiration = (optionLabel, displayTime) => {
    setExpirationOption(optionLabel);
    setExpirationLabel(displayTime);
  };

  const handleShareClick = () => {
    if (onShare) {
      onShare({
        address: fullAddress,
        previewAddress,
        amount: amount || 0,
        network: "lightning",
        expirationTime: expirationLabel,
      });
    } else {
      alert(`Shared Lightning Payment Request: ${previewAddress} (${amount ? `${formatSats(amount)} sats` : "any amount"})`);
    }
  };

  return (
    <div className="wallet-screen">
      <StatusBar />

      {/* ── Screen Header ─────────────────────────────────────── */}
      <header
        style={{
          height: 48,
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={() => {
            track("tap", { screen: "receive_lightning", target: "back_button" });
            track("back_tapped", { screen: "receive_lightning" });
            if (onBack) onBack();
            else window.history.back();
          }}
          aria-label="Go back"
          style={{
            width: 40,
            height: 40,
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            color: "#080B0A",
            background: "transparent",
            cursor: "pointer",
            border: "none",
            marginLeft: -8,
          }}
        >
          <ArrowLeft size={22} strokeWidth={2.2} />
        </button>

        <h1
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "#080B0A",
            margin: 0,
            display: "flex",
            alignItems: "center",
            letterSpacing: "-0.32px",
          }}
        >
          Receive Bitcoin
          <span style={{ color: "#989CA3", fontWeight: 400, marginLeft: 6 }}>
            - {walletName}
          </span>
        </h1>
      </header>

      {/* ── Main Content ───────────────────────────────────────── */}
      <div
        className="screen-content"
        style={{
          padding: "4px 16px 12px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          {/* ── Segmented Control Pill ──────────────────────────── */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
            <div
              style={{
                background: "#EEF0F4",
                borderRadius: 100,
                padding: 4,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {/* Lightning Tab (Selected) */}
              <button
                type="button"
                style={{
                  background: "#1E2024",
                  color: "#FFFFFF",
                  borderRadius: 100,
                  padding: "7px 18px",
                  fontSize: 14,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "-0.2px",
                }}
              >
                <Zap size={15} fill="#FFFFFF" color="#FFFFFF" />
                <span>lightning</span>
              </button>

              {/* On-chain Tab (Inactive) */}
              <button
                type="button"
                onClick={onSwitchToOnChain}
                style={{
                  background: "transparent",
                  color: "#1E2024",
                  borderRadius: 100,
                  padding: "7px 18px",
                  fontSize: 14,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "-0.2px",
                }}
              >
                <LinkIcon size={15} strokeWidth={2.2} />
                <span>On-chain</span>
              </button>
            </div>
          </div>

          {/* ── Subtitle ───────────────────────────────────────── */}
          <div
            style={{
              textAlign: "center",
              fontSize: 14,
              fontWeight: 500,
              color: "#080B0A",
              marginTop: 18,
              letterSpacing: "-0.2px",
            }}
          >
            Fast payments for small amounts.
          </div>

          {/* ── QR Code ────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 26,
            }}
          >
            <img
              src="/qr-code.svg"
              alt="Bitcoin Lightning QR Code"
              style={{
                width: 216,
                height: 216,
                display: "block",
              }}
            />
          </div>

          {/* ── Address & Copy Row ─────────────────────────────── */}
          <div
            onClick={handleCopy}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 18,
              cursor: "pointer",
              userSelect: "none",
            }}
            title="Click to copy address"
          >
            <span
              style={{
                fontSize: 14,
                color: "#81848B",
                fontWeight: 400,
                letterSpacing: "-0.2px",
              }}
            >
              Address: {previewAddress}
            </span>
            {copied ? (
              <Check size={16} color="#19A86B" strokeWidth={2.5} />
            ) : (
              <Copy size={16} color="#81848B" strokeWidth={1.8} />
            )}
          </div>
        </div>

        {/* ── Bottom Section: Actions & Share Button ──────────── */}
        <div style={{ marginTop: "auto", paddingBottom: 6 }}>
          {/* Row 1: Set amount */}
          <div
            style={{
              borderTop: "1px solid #EEF0F4",
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
            onClick={handleOpenAmount}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "#080B0A",
                letterSpacing: "-0.32px",
              }}
            >
              {amount ? `Amount: ${formatSats(amount)} sats` : "Set amount"}
            </span>
            <SquarePen size={19} color="#0051FE" strokeWidth={1.8} />
          </div>

          {/* Row 2: Expiration time */}
          <div
            style={{
              borderTop: "1px solid #EEF0F4",
              borderBottom: "1px solid #EEF0F4",
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
            onClick={handleOpenExpiration}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "#080B0A",
                letterSpacing: "-0.32px",
              }}
            >
              Expiration time: {expirationLabel}
            </span>
            <SquarePen size={19} color="#0051FE" strokeWidth={1.8} />
          </div>

          {/* Share Button (Always solid blue and clearly visible) */}
          <div style={{ marginTop: 24 }}>
            <PrimaryButton onClick={handleShareClick}>
              Share
            </PrimaryButton>
          </div>
        </div>
      </div>

      <HomeIndicator />

      {/* ── Set Amount Bottom Sheet ─────────────────────────── */}
      <SetAmountSheet
        isOpen={isAmountSheetOpen}
        initialAmount={amount}
        onClose={() => setIsAmountSheetOpen(false)}
        onGenerate={handleGenerateAmount}
      />

      {/* ── Expiration Time Bottom Sheet ─────────────────────── */}
      <ExpirationTimeSheet
        isOpen={isExpSheetOpen}
        currentOption={expirationOption}
        onClose={() => setIsExpSheetOpen(false)}
        onGenerate={handleGenerateExpiration}
      />
    </div>
  );
}
