// src/screens/send/AmountScreen.jsx
import { useEffect, useState } from "react";
import { AlertCircle, ArrowDownUp } from "lucide-react";
import HomeIndicator from "../../components/HomeIndicator";
import Keypad from "../../components/Keypad";
import PrimaryButton from "../../components/PrimaryButton";
import ScreenHeader from "../../components/ScreenHeader";
import StatusBar from "../../components/StatusBar";
import { formatSats, ONCHAIN_MIN_SATS, satsToFiat } from "../../config";
import { track } from "../../track";

export default function AmountScreen({
  sendData,
  wallet,
  onBack,
  onProceedToReview,
}) {
  const [amountStr, setAmountStr] = useState("0");
  const [isFiatMode, setIsFiatMode] = useState(false);

  const amount = parseInt(amountStr, 10) || 0;
  const balance = wallet.balance;
  const isLightning = sendData.network === "lightning";
  const fee = isLightning ? (amount <= 100 ? 1 : 2) : 1; // Default 1 sat happy path or tier

  // Validations:
  const isZero = amount === 0;
  const isOverBalance = amount > balance; // B1
  const isFeeNotCovered = !isOverBalance && amount + fee > balance; // B2
  const isBelowOnchainMin = !isLightning && amount > 0 && amount < ONCHAIN_MIN_SATS; // B3

  const hasError = isOverBalance || isFeeNotCovered || isBelowOnchainMin;

  // Track B1-B3 edge cases
  useState(() => {
    // will be checked dynamically in useEffect
  });

  // Track edge cases shown & recovered
  const [activeEdgeCase, setActiveEdgeCase] = useState(null);

  useEffect(() => {
    let currentCase = null;
    if (isOverBalance) currentCase = "B1";
    else if (isFeeNotCovered) currentCase = "B2";
    else if (isBelowOnchainMin) currentCase = "B3";

    if (currentCase !== activeEdgeCase) {
      if (currentCase) {
        track("edge_case_shown", { case_id: currentCase, screen: "send_amount" });
      } else if (activeEdgeCase) {
        track("edge_case_recovered", { case_id: activeEdgeCase });
      }
      setActiveEdgeCase(currentCase);
    }
  }, [isOverBalance, isFeeNotCovered, isBelowOnchainMin, activeEdgeCase]);

  const handleDigit = (digit) => {
    setAmountStr((prev) => {
      if (prev === "0") return digit;
      if (prev.length >= 8) return prev; // prevent overflow
      return prev + digit;
    });
  };

  const handleDelete = () => {
    setAmountStr((prev) => {
      if (prev.length <= 1) return "0";
      return prev.slice(0, -1);
    });
  };

  const handleSetMax = () => {
    const maxAmount = Math.max(0, balance - fee);
    setAmountStr(String(maxAmount));
  };

  const handleContinue = () => {
    if (hasError || isZero) return;
    onProceedToReview({
      ...sendData,
      amount,
      fee,
    });
  };

  return (
    <div className="wallet-screen">
      <StatusBar />
      <ScreenHeader
        title="Send Bitcoin"
        subTitle={wallet.account}
        onBack={onBack}
        screenName="send_amount"
      />

      <div
        className="screen-content"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "8px 16px 4px",
        }}
      >
        <div>
          {/* Recipient Chip at Top */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              background: "#F4F4F6",
              borderRadius: 8,
              border: "1px solid #E7E7E7",
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 500, color: "#080B0A" }}>To:</span>
            <div
              style={{
                background: "#E4E4E7",
                borderRadius: 27,
                padding: "4px 12px",
                fontSize: 14,
                fontWeight: 500,
                color: "#080B0A",
              }}
            >
              {sendData.displayTo || sendData.recipient}
            </div>
          </div>

          {/* Amount Display */}
          <div style={{ textAlign: "center", marginTop: 20 }}>
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
                  fontSize: 76,
                  fontWeight: 600,
                  color: hasError ? "#D62839" : "#0051FE",
                  lineHeight: 1,
                  letterSpacing: "-2px",
                }}
              >
                {formatSats(amount)}
              </span>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 400,
                  color: hasError ? "#D62839" : "#080B0A",
                }}
              >
                sats
              </span>
            </div>

            {/* Fiat Display with Swap Icon */}
            <div
              onClick={() => setIsFiatMode(!isFiatMode)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginTop: 8,
                color: "#81848B",
                fontSize: 18,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <span>{satsToFiat(amount)}</span>
              <ArrowDownUp size={16} strokeWidth={2} color="#61666E" />
            </div>

            {/* ----------------------------------------------------------- */}
            {/* ERROR B1: Amount > Balance                                  */}
            {/* ----------------------------------------------------------- */}
            {isOverBalance && (
              <div style={{ marginTop: 16 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    color: "#D62839",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  <AlertCircle size={16} />
                  <span>Short by {formatSats(amount - balance)} sats</span>
                </div>

                <button
                  type="button"
                  onClick={handleSetMax}
                  style={{
                    marginTop: 10,
                    background: "#E7EEFF",
                    border: "none",
                    borderRadius: 100,
                    padding: "6px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#0051FE",
                    cursor: "pointer",
                  }}
                >
                  You have {formatSats(balance)} sats · Send max
                </button>
              </div>
            )}

            {/* ----------------------------------------------------------- */}
            {/* ERROR B2: Fee Not Covered                                   */}
            {/* ----------------------------------------------------------- */}
            {isFeeNotCovered && (
              <div style={{ marginTop: 16 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    color: "#D62839",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  <AlertCircle size={16} />
                  <span>Not enough left for the fee</span>
                </div>

                <div style={{ fontSize: 13, color: "#61666E", marginTop: 4 }}>
                  {isLightning
                    ? "Lightning fee is about 2 sats."
                    : `Network fee is about ${fee} sats.`}
                </div>

                <button
                  type="button"
                  onClick={handleSetMax}
                  style={{
                    marginTop: 10,
                    background: "#E7EEFF",
                    border: "none",
                    borderRadius: 100,
                    padding: "6px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#0051FE",
                    cursor: "pointer",
                  }}
                >
                  Send max · {formatSats(balance - fee)} sats, fee included
                </button>
              </div>
            )}

            {/* ----------------------------------------------------------- */}
            {/* ERROR B3: Below On-Chain Minimum (294 sats)                  */}
            {/* ----------------------------------------------------------- */}
            {isBelowOnchainMin && (
              <div style={{ marginTop: 16 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    color: "#D62839",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  <AlertCircle size={16} />
                  <span>Too small to send on-chain</span>
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: "#61666E",
                    marginTop: 6,
                    lineHeight: "18px",
                    maxWidth: 280,
                    marginInline: "auto",
                  }}
                >
                  The minimum is {ONCHAIN_MIN_SATS} sats. For small amounts, ask for a Lightning
                  invoice instead.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Keypad & Continue Button */}
        <div>
          <Keypad onDigit={handleDigit} onDelete={handleDelete} hideDot screenName="send_amount" />

          <div style={{ margin: "10px 0" }}>
            <PrimaryButton
              disabled={hasError || isZero}
              onClick={handleContinue}
              screenName="send_amount"
              targetName="amount_continue"
            >
              Continue
            </PrimaryButton>
          </div>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
}
