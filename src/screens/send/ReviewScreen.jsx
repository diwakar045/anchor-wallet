// src/screens/send/ReviewScreen.jsx
import { useEffect, useState } from "react";
import { Check, Clock, Radio } from "lucide-react";
import BottomSheet from "../../components/BottomSheet";
import DetailsCard, { DetailsRow } from "../../components/DetailsCard";
import HomeIndicator from "../../components/HomeIndicator";
import NoteBox from "../../components/NoteBox";
import Pill from "../../components/Pill";
import PrimaryButton from "../../components/PrimaryButton";
import ScreenHeader from "../../components/ScreenHeader";
import StatusBar from "../../components/StatusBar";
import {
  DEMO_RECENTS,
  formatSats,
  LARGE_PAYMENT_USD_THRESHOLD,
  ONCHAIN_FEE_TIERS,
  satsToFiat,
} from "../../config";
import { truncateMiddle } from "../../utils/parser";
import { track } from "../../track";

export default function ReviewScreen({
  sendData,
  wallet,
  onBack,
  onProceedToPin,
  onEditRecipient,
}) {
  const { recipient, network = "bitcoin", isInvoiceLocked = false } = sendData;

  const [selectedSpeed, setSelectedSpeed] = useState("standard");
  const [isSpeedSheetOpen, setIsSpeedSheetOpen] = useState(false);
  const [isFeeChangedSheetOpen, setIsFeeChangedSheetOpen] = useState(false);
  const [isFirstTimeSheetOpen, setIsFirstTimeSheetOpen] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(false);

  // Large payment checkboxes (C2)
  const [checkAddressMatches, setCheckAddressMatches] = useState(false);
  const [checkCannotBeUndone, setCheckCannotBeUndone] = useState(false);

  // Countdown timer for lightning invoice
  const [countdown, setCountdown] = useState(sendData.expiresIn || "09:42");

  useEffect(() => {
    if (network !== "lightning") return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        const [min, sec] = prev.split(":").map(Number);
        if (min === 0 && sec <= 1) {
          clearInterval(interval);
          return "00:00";
        }
        const totalSec = min * 60 + sec - 1;
        const m = String(Math.floor(totalSec / 60)).padStart(2, "0");
        const s = String(totalSec % 60).padStart(2, "0");
        return `${m}:${s}`;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [network]);

  const amount = sendData.amount || 12;

  // Fee calculation:
  // If lightning: 1 or 2 sats
  // If on-chain: default 1 sat for small amounts (matches happy path 12 sats Review),
  // or use tiered fee if user opened speed or amount >= 1000
  const isLightning = network === "lightning";

  let fee = sendData.fee || 1;
  let speedTime = "Usually 10–60 min";

  if (!isLightning) {
    if (amount >= 1000 || isSpeedSheetOpen || selectedSpeed !== "standard") {
      fee = ONCHAIN_FEE_TIERS[selectedSpeed].fee;
      speedTime = ONCHAIN_FEE_TIERS[selectedSpeed].time;
    }
  }

  const total = amount + fee;

  // Fee ratio check (B6: High fee warning when fee >= 5% of amount)
  const feeRatio = amount > 0 ? (fee / amount) * 100 : 0;
  const isHighFee = feeRatio >= 5;

  const feePillType = isHighFee ? "fee-high" : fee <= 2 ? "fee-low" : "fee-normal";
  const feePillLabel = isHighFee ? "High" : "Low";

  // Check C2: Large payment condition ($1000 threshold or 2.5M sats)
  const isLargePayment =
    amount >= 2500000 || (amount * 0.0014 >= LARGE_PAYMENT_USD_THRESHOLD);

  // Check C1: First-time recipient check
  const isFirstTimeRecipient = !DEMO_RECENTS.some(
    (r) => r.label.toLowerCase() === recipient.toLowerCase()
  );

  // Track review edge cases
  useEffect(() => {
    if (isHighFee) {
      track("edge_case_shown", { case_id: "B6", screen: "send_review" });
    }
    if (isLargePayment) {
      track("edge_case_shown", { case_id: "C2", screen: "send_review" });
    }
  }, [isHighFee, isLargePayment]);

  useEffect(() => {
    if (isSpeedSheetOpen) {
      track("edge_case_shown", { case_id: "B4", screen: "send_review_speed" });
    }
  }, [isSpeedSheetOpen]);

  useEffect(() => {
    if (isFeeChangedSheetOpen) {
      track("edge_case_shown", { case_id: "B5", screen: "send_review_feechanged" });
    }
  }, [isFeeChangedSheetOpen]);

  useEffect(() => {
    if (isFirstTimeSheetOpen) {
      track("edge_case_shown", { case_id: "C1", screen: "send_review_firsttime" });
    }
  }, [isFirstTimeSheetOpen]);

  const handleSendPress = () => {
    // If first-time recipient, trigger C1 sheet first!
    if (isFirstTimeRecipient) {
      setIsFirstTimeSheetOpen(true);
      return;
    }
    onProceedToPin({
      ...sendData,
      amount,
      fee,
      total,
      network,
    });
  };

  const handleFirstTimeConfirmed = () => {
    setIsFirstTimeSheetOpen(false);
    onProceedToPin({
      ...sendData,
      amount,
      fee,
      total,
      network,
    });
  };

  const canSubmit = !isLargePayment || (checkAddressMatches && checkCannotBeUndone);

  return (
    <div className="wallet-screen">
      <StatusBar />
      <ScreenHeader title="Review payment" onBack={onBack} screenName="send_review" />

      <div className="screen-content" style={{ padding: "4px 16px 12px" }}>
        {/* Hero Section */}
        <div style={{ textAlign: "center", margin: "14px 0 16px" }}>
          <div style={{ fontSize: 15, color: "#81848B", fontWeight: 400 }}>You're sending</div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: 6,
              marginTop: 4,
            }}
          >
            <span
              style={{
                fontSize: 52,
                fontWeight: 600,
                color: "#0051FE",
                lineHeight: 1.1,
              }}
            >
              {formatSats(amount)}
            </span>
            <span style={{ fontSize: 18, color: "#989CA3", fontWeight: 500 }}>sats</span>
          </div>
          <div style={{ fontSize: 16, color: "#81848B", marginTop: 4, fontWeight: 500 }}>
            ≈ {satsToFiat(amount)}
          </div>
        </div>

        {/* Details Card */}
        <DetailsCard>
          {/* To Row */}
          <DetailsRow
            label="To"
            value={
              isLightning ? (
                <span>{truncateMiddle(recipient, 8, 6)}</span>
              ) : (
                <div style={{ textAlign: "right" }}>
                  <span>
                    <strong>{recipient.slice(0, 6)}</strong>
                    <span style={{ color: "#989CA3" }}>…</span>
                    <strong>{recipient.slice(-6)}</strong>
                  </span>
                </div>
              )
            }
            action={
              isLightning ? (
                <div
                  style={{
                    fontSize: 12,
                    color: "#989CA3",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginTop: 3,
                  }}
                >
                  <Clock size={13} />
                  <span>Lightning invoice · expires in {countdown}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const next = !showFullAddress;
                    setShowFullAddress(next);
                    if (next) track("view_full_address", {});
                    track("tap", { screen: "send_review", target: "toggle_full_address" });
                  }}
                  style={{
                    fontSize: 13,
                    color: "#0051FE",
                    fontWeight: 500,
                    marginTop: 3,
                    textAlign: "right",
                  }}
                >
                  {showFullAddress ? "Hide full address" : "View full address"}
                </button>
              )
            }
          />

          {showFullAddress && !isLightning && (
            <div
              style={{
                padding: "8px 16px 14px",
                fontSize: 12,
                lineHeight: "17px",
                wordBreak: "break-all",
                color: "#61666E",
                background: "#EEF0F4",
              }}
            >
              {recipient}
            </div>
          )}

          {/* From Row */}
          <DetailsRow label="From" value={wallet.account} />

          {/* Network Row */}
          <DetailsRow
            label="Network"
            value={<Pill type="network" network={network} />}
            subvalue={isLightning ? "Arrives in seconds" : speedTime}
          />

          {/* Network Fee Row */}
          <DetailsRow
            label="Network fee"
            value={
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span>{fee} sat{fee > 1 ? "s" : ""}</span>
                <Pill type={feePillType}>{feePillLabel}</Pill>
              </span>
            }
            subvalue={
              isHighFee
                ? `≈ ${satsToFiat(fee)} · ${Math.round(feeRatio)}% of amount`
                : undefined
            }
            action={
              !isLightning && (
                <button
                  type="button"
                  onClick={() => setIsSpeedSheetOpen(true)}
                  style={{
                    fontSize: 13,
                    color: "#0051FE",
                    fontWeight: 500,
                    marginTop: 3,
                  }}
                >
                  Change speed
                </button>
              )
            }
          />

          {/* Total Row */}
          <DetailsRow
            dashedAbove
            isTotal
            label="Total"
            sublabel="Amount + fee"
            value={`${formatSats(total)} sats`}
            subvalue={`≈ ${satsToFiat(total)}`}
          />
        </DetailsCard>

        {/* ------------------------------------------------------------- */}
        {/* EDGE CASE B6: High Fee Warning Note                            */}
        {/* ------------------------------------------------------------- */}
        {isHighFee && (
          <NoteBox
            type="warning"
            title={`The fee is ${Math.round(feeRatio)}% of what you're sending`}
          >
            On-chain fees are high for small amounts. Pick a slower speed, or ask for a Lightning
            invoice.
          </NoteBox>
        )}

        {/* ------------------------------------------------------------- */}
        {/* EDGE CASE C2: Large Payment Checkboxes                         */}
        {/* ------------------------------------------------------------- */}
        {isLargePayment && (
          <div style={{ margin: "8px 0" }}>
            <NoteBox type="warning" title="Large payment">
              This is about {satsToFiat(amount)}. Check both boxes before you send.
            </NoteBox>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "8px 0" }}>
              <div
                className="checkbox-row"
                onClick={() => setCheckAddressMatches(!checkAddressMatches)}
              >
                <div className={`custom-checkbox ${checkAddressMatches ? "checked" : ""}`}>
                  {checkAddressMatches && <Check size={16} strokeWidth={2.5} />}
                </div>
                <span className="checkbox-label">The address matches what I was given</span>
              </div>

              <div
                className="checkbox-row"
                onClick={() => setCheckCannotBeUndone(!checkCannotBeUndone)}
              >
                <div className={`custom-checkbox ${checkCannotBeUndone ? "checked" : ""}`}>
                  {checkCannotBeUndone && <Check size={16} strokeWidth={2.5} />}
                </div>
                <span className="checkbox-label">I understand this can't be undone</span>
              </div>
            </div>
          </div>
        )}

        {/* Standard Safety Note */}
        {!isHighFee && !isLargePayment && (
          <NoteBox type="warning" title="Sent bitcoin can't be reversed">
            {isLightning
              ? "Check the amount and recipient before you send."
              : "Check the start and end of the address against what your friend sent you."}
          </NoteBox>
        )}

        {/* Send Button with 1-Second Hold-to-Confirm */}
        <div style={{ marginTop: "auto", paddingTop: 12 }}>
          <PrimaryButton
            holdToConfirm
            holdDurationMs={1000}
            disabled={!canSubmit}
            onClick={handleSendPress}
            hint={
              isLargePayment && !canSubmit
                ? "Tick both boxes to continue"
                : "Press and hold for 1 second to confirm"
            }
            screenName="send_review"
            targetName="hold_to_send"
          >
            Send
          </PrimaryButton>
        </div>
      </div>

      <HomeIndicator />

      {/* --------------------------------------------------------------- */}
      {/* SHEET B4: Choose Speed Bottom Sheet                              */}
      {/* --------------------------------------------------------------- */}
      <BottomSheet
        isOpen={isSpeedSheetOpen}
        onClose={() => setIsSpeedSheetOpen(false)}
        title="Choose speed"
        subtitle="Fees depend on how busy the network is right now."
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "12px 0 20px" }}>
          {Object.values(ONCHAIN_FEE_TIERS).map((tier) => {
            const isSelected = selectedSpeed === tier.id;
            return (
              <div
                key={tier.id}
                onClick={() => {
                  track("speed_changed", { from: selectedSpeed, to: tier.id });
                  track("tap", { screen: "send_review_speed", target: `speed_${tier.id}` });
                  setSelectedSpeed(tier.id);
                }}
                style={{
                  border: `1.5px solid ${isSelected ? "#0051FE" : "#E7E7E7"}`,
                  background: isSelected ? "#E7EEFF" : "#FFFFFF",
                  borderRadius: 12,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: `2px solid ${isSelected ? "#0051FE" : "#989CA3"}`,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {isSelected && (
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: "#0051FE",
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: "#080B0A" }}>
                        {tier.name}
                      </span>
                      {tier.recommended && (
                        <span
                          style={{
                            background: "#0051FE",
                            color: "#FFFFFF",
                            borderRadius: 100,
                            padding: "2px 8px",
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          Recommended
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: "#61666E", marginTop: 2 }}>{tier.time}</div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#080B0A" }}>
                    {tier.fee} sats
                  </div>
                  <div style={{ fontSize: 12, color: "#989CA3", marginTop: 2 }}>{tier.fiat}</div>
                </div>
              </div>
            );
          })}
        </div>

        <PrimaryButton onClick={() => setIsSpeedSheetOpen(false)}>Done</PrimaryButton>
      </BottomSheet>

      {/* --------------------------------------------------------------- */}
      {/* SHEET B5: Network Fees Changed Simulation Sheet                  */}
      {/* --------------------------------------------------------------- */}
      <BottomSheet
        isOpen={isFeeChangedSheetOpen}
        onClose={() => setIsFeeChangedSheetOpen(false)}
        title="Network fees changed"
        subtitle="Fees went up while you were reviewing. Here is the new cost before anything is sent."
      >
        <DetailsCard>
          <DetailsRow
            label="Network fee"
            value="360 sats"
            subvalue={<span style={{ color: "#B7791F" }}>was 280 sats</span>}
          />
          <DetailsRow
            dashedAbove
            isTotal
            label="New total"
            value={`${formatSats(amount + 360)} sats`}
            subvalue={`≈ ${satsToFiat(amount + 360)}`}
          />
        </DetailsCard>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
          <PrimaryButton onClick={() => setIsFeeChangedSheetOpen(false)}>
            Accept and continue
          </PrimaryButton>
          <PrimaryButton
            variant="secondary"
            onClick={() => {
              setIsFeeChangedSheetOpen(false);
              setIsSpeedSheetOpen(true);
            }}
          >
            Choose a slower speed
          </PrimaryButton>
        </div>
      </BottomSheet>

      {/* --------------------------------------------------------------- */}
      {/* SHEET C1: First-Time Recipient Verification Sheet                */}
      {/* --------------------------------------------------------------- */}
      <BottomSheet
        isOpen={isFirstTimeSheetOpen}
        onClose={() => setIsFirstTimeSheetOpen(false)}
        title="First time sending to this address"
        subtitle="Compare the start and end with what your friend sent you. If they don't match, don't send."
      >
        <div
          style={{
            background: "#F4F4F6",
            borderRadius: 14,
            padding: "18px 16px",
            textAlign: "center",
            margin: "8px 0 16px",
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#0051FE",
              letterSpacing: "-0.5px",
            }}
          >
            {recipient.slice(0, 6)}
            <span style={{ color: "#989CA3" }}>…</span>
            {recipient.slice(-6)}
          </div>
          <div style={{ fontSize: 13, color: "#61666E", marginTop: 8 }}>
            Starts with <strong>{recipient.slice(0, 6)}</strong> · Ends with{" "}
            <strong>{recipient.slice(-6)}</strong>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
          <PrimaryButton onClick={handleFirstTimeConfirmed}>
            They match, continue
          </PrimaryButton>
          <PrimaryButton
            variant="text"
            onClick={() => {
              setIsFirstTimeSheetOpen(false);
              if (onEditRecipient) onEditRecipient();
            }}
          >
            Edit recipient
          </PrimaryButton>
        </div>
      </BottomSheet>
    </div>
  );
}
