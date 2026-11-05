// src/screens/send/SendInputScreen.jsx
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Clock,
  Link as LinkIcon,
  QrCode,
  Share2,
  Zap,
} from "lucide-react";
import DetailsCard, { DetailsRow } from "../../components/DetailsCard";
import HomeIndicator from "../../components/HomeIndicator";
import NoteBox from "../../components/NoteBox";
import Pill from "../../components/Pill";
import PrimaryButton from "../../components/PrimaryButton";
import ScreenHeader from "../../components/ScreenHeader";
import StatusBar from "../../components/StatusBar";
import ToField from "../../components/ToField";
import { DEMO_RECENTS } from "../../config";
import { parseRecipient, truncateMiddle } from "../../utils/parser";
import { track } from "../../track";

export default function SendInputScreen({
  wallet,
  initialRecipient = "",
  onBack,
  onProceedToAmount,
  onProceedToReview,
  onOpenScan,
}) {
  const [inputText, setInputText] = useState(initialRecipient);
  const [unifiedSelectedNetwork, setUnifiedSelectedNetwork] = useState("lightning");

  // Sync if initialRecipient changes
  useEffect(() => {
    if (initialRecipient) {
      setInputText(initialRecipient);
    }
  }, [initialRecipient]);

  const parsed = parseRecipient(inputText, wallet.ownAddress);

  // Track input_type_detected whenever input text changes and resolves
  useEffect(() => {
    if (!inputText.trim()) return;
    let detectedType = "unreadable";
    if (parsed.type === "A2_UNIFIED") detectedType = "bip21";
    else if (parsed.type === "A1_INVOICE" || parsed.type === "A4_EXPIRED") detectedType = "lightning_invoice";
    else if (parsed.type === "LIGHTNING_ADDRESS") detectedType = "lightning_address";
    else if (parsed.type === "ONCHAIN_ADDRESS" || parsed.type === "A5_TESTNET" || parsed.type === "A6_OWN_ADDRESS") detectedType = "onchain";
    else detectedType = "unreadable";

    track("input_type_detected", { type: detectedType });
  }, [inputText, parsed.type]);

  const handleSelectRecent = (recent) => {
    setInputText(recent.label);
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputText(text);
          return;
        }
      }
    } catch {
      // Fallback
    }
    // Demo fallback paste
    setInputText("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh");
  };

  const handleClear = () => {
    setInputText("");
    setUnifiedSelectedNetwork("lightning");
  };

  // Determine status of ToField
  const toStatus =
    parsed.type === "A3_INVALID" || parsed.type === "A5_TESTNET"
      ? "error"
      : parsed.type === "A4_EXPIRED" || parsed.type === "A6_OWN_ADDRESS"
      ? "warning"
      : "normal";

  // Track edge cases A1-A6 shown
  useEffect(() => {
    let caseId = null;
    if (parsed.type === "A1_INVOICE") caseId = "A1";
    else if (parsed.type === "A2_UNIFIED") caseId = "A2";
    else if (parsed.type === "A3_INVALID") caseId = "A3";
    else if (parsed.type === "A4_EXPIRED") caseId = "A4";
    else if (parsed.type === "A5_TESTNET") caseId = "A5";
    else if (parsed.type === "A6_OWN_ADDRESS") caseId = "A6";

    if (caseId) {
      track("edge_case_shown", { case_id: caseId, screen: "send_input" });
    }
  }, [parsed.type]);

  const chipValue =
    parsed.type === "A1_INVOICE"
      ? parsed.chip
      : parsed.type === "A2_UNIFIED"
      ? "Payment request"
      : parsed.type === "ONCHAIN_ADDRESS" || parsed.type === "A6_OWN_ADDRESS"
      ? truncateMiddle(parsed.address || inputText, 10, 5)
      : parsed.type === "LIGHTNING_ADDRESS"
      ? parsed.recipient
      : null;

  return (
    <div className="wallet-screen">
      <StatusBar />
      <ScreenHeader
        title="Send Bitcoin"
        subTitle={wallet.account}
        onBack={onBack}
        screenName="send_input"
      />

      <div className="screen-content" style={{ padding: "8px 16px 16px" }}>
        {/* Recipient Input Field */}
        <ToField
          value={inputText}
          chipValue={chipValue}
          onChange={(val) => setInputText(val)}
          onPaste={handlePaste}
          onClear={handleClear}
          status={toStatus}
        />

        {/* ------------------------------------------------------------- */}
        {/* EDGE CASE A1: Valid Lightning Invoice Detected                 */}
        {/* ------------------------------------------------------------- */}
        {parsed.type === "A1_INVOICE" && (
          <div style={{ marginTop: 12 }}>
            <NoteBox type="info" title="Lightning invoice">
              Arrives in seconds with a very small fee. Anchor will pay it for you.
            </NoteBox>

            <DetailsCard>
              <DetailsRow
                label="Amount"
                sublabel="Set by the invoice"
                value={`${parsed.amount} sats`}
                subvalue={`≈ ${parsed.fiat}`}
              />
              <DetailsRow
                label="Expires in"
                value={
                  <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#61666E" }}>
                    <Clock size={15} />
                    {parsed.expiresIn}
                  </span>
                }
              />
            </DetailsCard>

            <div style={{ marginTop: 24 }}>
              <PrimaryButton
                onClick={() =>
                  onProceedToReview({
                    recipient: parsed.raw,
                    displayTo: truncateMiddle(parsed.raw, 10, 6),
                    amount: parsed.amount,
                    network: "lightning",
                    fee: parsed.fee,
                    isInvoiceLocked: true,
                    expiresIn: parsed.expiresIn,
                  })
                }
              >
                Continue
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* EDGE CASE A2: Unified BIP21 QR                                */}
        {/* ------------------------------------------------------------- */}
        {parsed.type === "A2_UNIFIED" && (
          <div style={{ marginTop: 12 }}>
            <NoteBox
              type="info"
              title={
                unifiedSelectedNetwork === "lightning"
                  ? "Paying with Lightning"
                  : "Paying on-chain"
              }
            >
              {unifiedSelectedNetwork === "lightning"
                ? "This request accepts both Lightning and on-chain. Anchor picked Lightning because it is faster and cheaper."
                : "Paying using standard Bitcoin on-chain network."}
            </NoteBox>

            <DetailsCard>
              <DetailsRow
                label="Amount"
                value={`${parsed.amount} sats`}
                subvalue={`≈ ${parsed.fiat}`}
              />
              <DetailsRow
                label="Speed"
                value={unifiedSelectedNetwork === "lightning" ? "Seconds" : "10 to 60 min"}
              />
              <DetailsRow
                label="Fee"
                value={
                  unifiedSelectedNetwork === "lightning" ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      About 2 sats
                      <Pill type="fee-low">Very low</Pill>
                    </span>
                  ) : (
                    "About 140 sats"
                  )
                }
              />
            </DetailsCard>

            <div style={{ margin: "14px 0" }}>
              {unifiedSelectedNetwork === "lightning" ? (
                <button
                  type="button"
                  onClick={() => setUnifiedSelectedNetwork("onchain")}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: "#F4F4F6",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#0051FE" }}>
                    Pay on-chain instead
                  </span>
                  <span style={{ fontSize: 13, color: "#61666E", marginTop: 2 }}>
                    Slower (10 to 60 min) and a higher fee
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setUnifiedSelectedNetwork("lightning")}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: "#F4F4F6",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#0051FE" }}>
                    Switch back to Lightning
                  </span>
                  <span style={{ fontSize: 13, color: "#61666E", marginTop: 2 }}>
                    Faster (seconds) and lower fee
                  </span>
                </button>
              )}
            </div>

            <PrimaryButton
              onClick={() =>
                onProceedToReview({
                  recipient:
                    unifiedSelectedNetwork === "lightning"
                      ? parsed.lightningInvoice
                      : parsed.address,
                  displayTo:
                    unifiedSelectedNetwork === "lightning"
                      ? truncateMiddle(parsed.lightningInvoice, 10, 6)
                      : truncateMiddle(parsed.address, 10, 6),
                  amount: parsed.amount,
                  network: unifiedSelectedNetwork === "lightning" ? "lightning" : "bitcoin",
                  fee: unifiedSelectedNetwork === "lightning" ? 2 : 140,
                  isInvoiceLocked: true,
                })
              }
            >
              Continue
            </PrimaryButton>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* EDGE CASE A3: Could not read                                  */}
        {/* ------------------------------------------------------------- */}
        {parsed.type === "A3_INVALID" && (
          <div style={{ marginTop: 12 }}>
            <NoteBox type="error" title="We couldn't read this">
              Check that you copied all of it. An address or invoice is one long line with no spaces.
            </NoteBox>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#080B0A", marginBottom: 12 }}>
                Anchor understands
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: "#F4F4F6",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 4,
                      background: "#E4ECFF",
                      color: "#0051FE",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <LinkIcon size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#080B0A" }}>
                      Bitcoin address
                    </div>
                    <div style={{ fontSize: 12, color: "#61666E" }}>Starts with bc1 · on-chain</div>
                  </div>
                </div>

                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: "#F4F4F6",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 4,
                      background: "#E4ECFF",
                      color: "#0051FE",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <Zap size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#080B0A" }}>
                      Lightning invoice
                    </div>
                    <div style={{ fontSize: 12, color: "#61666E" }}>Starts with lnbc · Lightning</div>
                  </div>
                </div>

                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: "#F4F4F6",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 4,
                      background: "#E4ECFF",
                      color: "#0051FE",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 700 }}>@</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#080B0A" }}>
                      Lightning address
                    </div>
                    <div style={{ fontSize: 12, color: "#61666E" }}>
                      Looks like name@domain.com · Lightning
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
              <PrimaryButton onClick={handlePaste}>Paste again</PrimaryButton>
              <PrimaryButton variant="text" onClick={onOpenScan}>
                Scan QR code instead
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* EDGE CASE A4: Invoice Expired                                 */}
        {/* ------------------------------------------------------------- */}
        {parsed.type === "A4_EXPIRED" && (
          <div style={{ marginTop: 12 }}>
            <NoteBox type="warning" title="This invoice has expired">
              Lightning invoices only work for a short time. Ask the sender for a new one.
            </NoteBox>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#080B0A", marginBottom: 8 }}>
                Message to send
              </div>
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: 12,
                  background: "#F4F4F6",
                  fontSize: 14,
                  lineHeight: "20px",
                  color: "#080B0A",
                  fontStyle: "italic",
                }}
              >
                "Hi! The invoice you sent has expired. Could you send me a new one?"
              </div>
            </div>

            <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
              <PrimaryButton
                icon={<Share2 size={18} />}
                onClick={() => alert("Message copied to clipboard: Hi! The invoice you sent has expired...")}
              >
                Share message
              </PrimaryButton>
              <PrimaryButton variant="text" onClick={handleClear}>
                Back
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* EDGE CASE A5: Test Network Address                            */}
        {parsed.type === "A5_TESTNET" && (
          <div style={{ marginTop: 12 }}>
            <NoteBox type="error" title="This is a test network address">
              It can't receive real bitcoin, so sending to it would lose the funds. Ask for a regular
              Bitcoin address, one that starts with bc1.
            </NoteBox>

            <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
              <PrimaryButton onClick={onOpenScan}>Scan another code</PrimaryButton>
              <PrimaryButton variant="text" onClick={handleClear}>
                Edit recipient
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* EDGE CASE A6: User's Own Address                              */}
        {parsed.type === "A6_OWN_ADDRESS" && (
          <div style={{ marginTop: 12 }}>
            <NoteBox type="warning" title="This is your own address">
              You would be sending bitcoin to {wallet.account}, your own wallet. You would pay a network fee
              and the funds would stay with you.
            </NoteBox>

            <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
              <PrimaryButton onClick={handleClear}>Choose another recipient</PrimaryButton>
              <PrimaryButton
                variant="text"
                onClick={() =>
                  onProceedToAmount({
                    recipient: parsed.address,
                    displayTo: truncateMiddle(parsed.address, 10, 5),
                    network: "bitcoin",
                  })
                }
              >
                Continue anyway
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* Detected Normal Address: Matching Address row (Frame 231:2520) */}
        {/* ------------------------------------------------------------- */}
        {(parsed.type === "ONCHAIN_ADDRESS" || parsed.type === "LIGHTNING_ADDRESS") && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#080B0A", marginBottom: 12 }}>
              Matching address
            </div>

            <div
              onClick={() =>
                onProceedToAmount({
                  recipient: parsed.raw,
                  displayTo:
                    parsed.type === "ONCHAIN_ADDRESS"
                      ? truncateMiddle(parsed.raw, 10, 5)
                      : parsed.recipient,
                  network: parsed.network,
                })
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                background: "#F4F4F6",
                borderRadius: 12,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 6,
                  background: "#E4ECFF",
                  color: "#0051FE",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {parsed.network === "lightning" ? <Zap size={20} /> : <LinkIcon size={20} />}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: "#080B0A",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {parsed.raw}
                </div>
                <div style={{ fontSize: 12, color: "#989CA3", marginTop: 2 }}>
                  {parsed.network === "lightning" ? "Lightning network" : "Bitcoin on-chain"}
                </div>
              </div>

              <ArrowRight size={18} color="#989CA3" />
            </div>

            <div style={{ marginTop: 24 }}>
              <PrimaryButton
                onClick={() =>
                  onProceedToAmount({
                    recipient: parsed.raw,
                    displayTo:
                      parsed.type === "ONCHAIN_ADDRESS"
                        ? truncateMiddle(parsed.raw, 10, 5)
                        : parsed.recipient,
                    network: parsed.network,
                  })
                }
              >
                Continue
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* Default Empty State: Scan row + Recent list                   */}
        {/* ------------------------------------------------------------- */}
        {parsed.type === "empty" && (
          <div style={{ marginTop: 16 }}>
            {/* Scan QR code row (Frame 231:2359) */}
            <div
              onClick={onOpenScan}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 0",
                cursor: "pointer",
                borderBottom: "1px solid #E7E7E7",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: "#EEF0F4",
                  display: "grid",
                  placeItems: "center",
                  color: "#080B0A",
                  flexShrink: 0,
                }}
              >
                <QrCode size={22} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 500, color: "#080B0A" }}>Scan QR code</div>
                <div style={{ fontSize: 14, color: "#989CA3", marginTop: 2 }}>
                  Tap to scan an address
                </div>
              </div>
            </div>

            {/* Recent list */}
            <div style={{ marginTop: 28 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 600, color: "#080B0A" }}>Recent</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: "#0051FE", cursor: "pointer" }}>
                  View all
                </span>
              </div>

              {DEMO_RECENTS.length === 0 ? (
                <div style={{ fontSize: 14, color: "#989CA3", padding: "16px 0" }}>
                  Recipients you've paid will show up here.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {DEMO_RECENTS.map((recent) => (
                    <div
                      key={recent.id}
                      onClick={() => handleSelectRecent(recent)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "14px 0",
                        cursor: "pointer",
                        borderBottom: "1px solid #E7E7E7",
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 6,
                          background: "#EEF0F4",
                          color: "#61666E",
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        {recent.network === "lightning" ? (
                          <Zap size={16} />
                        ) : (
                          <LinkIcon size={16} />
                        )}
                      </div>

                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 500,
                          color: "#080B0A",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {recent.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <HomeIndicator />
    </div>
  );
}
