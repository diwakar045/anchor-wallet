import { useState } from "react";
import { ArrowRight, QrCode, TextCursorInput } from "lucide-react";
import BottomSheet from "../../components/BottomSheet";
import PrimaryButton from "../../components/PrimaryButton";
import { track } from "../../track";

export default function SendGuideSheet({ isOpen, onComplete, onClose }) {
  const [guideStep, setGuideStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState("scan"); // "scan" | "type"

  if (!isOpen) return null;

  const handleClose = () => {
    track("guide_dismissed", { step: guideStep });
    if (onClose) onClose();
  };

  const handleNextStep = () => {
    track("tap", { screen: "send_guide", target: "guide_next_step" });
    setGuideStep(2);
  };

  const handleFinishGuide = () => {
    track("guide_completed", { step: 2 });
    track("tap", { screen: "send_guide", target: `guide_method_${selectedMethod}` });
    if (onComplete) onComplete(selectedMethod);
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose}>
      {guideStep === 1 ? (
        <div style={{ padding: "4px 0 10px" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 6px", color: "#080B0A" }}>
            Sending Bitcoin for the first time?
          </h2>
          <p style={{ fontSize: 14, color: "#61666E", margin: "0 0 20px" }}>
            Lets guide you through it.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "#E7EEFF",
                  color: "#0051FE",
                  fontWeight: 700,
                  fontSize: 13,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                1
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#080B0A" }}>Add Recipient</div>
                <div style={{ fontSize: 13, color: "#61666E", marginTop: 2 }}>
                  Paste, scan or type where the money is going.
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "#E7EEFF",
                  color: "#0051FE",
                  fontWeight: 700,
                  fontSize: 13,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                2
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#080B0A" }}>Enter Amount</div>
                <div style={{ fontSize: 13, color: "#61666E", marginTop: 2 }}>
                  Choose how much to send.
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "#E7EEFF",
                  color: "#0051FE",
                  fontWeight: 700,
                  fontSize: 13,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                3
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#080B0A" }}>Review and Send</div>
                <div style={{ fontSize: 13, color: "#61666E", marginTop: 2 }}>
                  Check the fee and total, then confirm.
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "10px 14px",
              background: "#FFF6E0",
              borderRadius: 8,
              fontSize: 13,
              color: "#B7791F",
              marginBottom: 20,
              fontWeight: 500,
            }}
          >
            Sent bitcoin can't be taken back.
          </div>

          <PrimaryButton onClick={handleNextStep}>Next</PrimaryButton>
        </div>
      ) : (
        <div style={{ padding: "4px 0 10px" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 6px", color: "#080B0A" }}>
            Choose how you want to send
          </h2>
          <p style={{ fontSize: 14, color: "#61666E", margin: "0 0 20px" }}>
            Choose the method that works best for you right now.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            {/* Option 1: Scan QR */}
            <div
              onClick={() => setSelectedMethod("scan")}
              style={{
                border: `1.5px solid ${selectedMethod === "scan" ? "#0051FE" : "#E7E7E7"}`,
                background: selectedMethod === "scan" ? "#E7EEFF" : "#FFFFFF",
                borderRadius: 12,
                padding: "14px 16px",
                display: "flex",
                gap: 14,
                cursor: "pointer",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: selectedMethod === "scan" ? "#FFFFFF" : "#EEF0F4",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  color: "#0051FE",
                }}
              >
                <QrCode size={22} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#080B0A" }}>Scan QR</div>
                <div style={{ fontSize: 13, color: "#61666E", marginTop: 3, lineHeight: "18px" }}>
                  The easiest option when the friend is nearby or sends a QR image.
                </div>
              </div>
            </div>

            {/* Option 2: Type / Paste address */}
            <div
              onClick={() => setSelectedMethod("type")}
              style={{
                border: `1.5px solid ${selectedMethod === "type" ? "#0051FE" : "#E7E7E7"}`,
                background: selectedMethod === "type" ? "#E7EEFF" : "#FFFFFF",
                borderRadius: 12,
                padding: "14px 16px",
                display: "flex",
                gap: 14,
                cursor: "pointer",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: selectedMethod === "type" ? "#FFFFFF" : "#EEF0F4",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  color: "#0051FE",
                }}
              >
                <TextCursorInput size={22} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#080B0A" }}>Type / Paste address</div>
                <div style={{ fontSize: 13, color: "#61666E", marginTop: 3, lineHeight: "18px" }}>
                  Type the address in the input field or just paste the address given by someone.
                </div>
              </div>
            </div>
          </div>

          <PrimaryButton onClick={handleFinishGuide}>Continue</PrimaryButton>
        </div>
      )}
    </BottomSheet>
  );
}
