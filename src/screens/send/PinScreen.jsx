// src/screens/send/PinScreen.jsx
import { useEffect, useState } from "react";
import { AlertCircle, ScanFace } from "lucide-react";
import HomeIndicator from "../../components/HomeIndicator";
import Keypad from "../../components/Keypad";
import PrimaryButton from "../../components/PrimaryButton";
import ScreenHeader from "../../components/ScreenHeader";
import StatusBar from "../../components/StatusBar";
import { DEMO_PIN, formatSats } from "../../config";
import { track } from "../../track";

export default function PinScreen({ sendData, onBack, onSuccess }) {
  const [pin, setPin] = useState("");
  const [triesLeft, setTriesLeft] = useState(3);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    track("edge_case_shown", { case_id: "C3", screen: "send_pin" });
  }, []);

  const amount = sendData.amount || 20000;

  const handleDigit = (digit) => {
    if (pin.length < 6) {
      setHasError(false);
      const nextPin = pin + digit;
      setPin(nextPin);

      if (nextPin.length === 6) {
        // Validate PIN
        if (nextPin === DEMO_PIN) {
          setTimeout(() => {
            onSuccess();
          }, 200);
        } else {
          setHasError(true);
          setTriesLeft((prev) => Math.max(0, prev - 1));
          setTimeout(() => {
            setPin("");
          }, 800);
        }
      }
    }
  };

  const handleDelete = () => {
    setHasError(false);
    setPin((prev) => prev.slice(0, -1));
  };

  const handleFaceId = () => {
    // Face ID simulation
    onSuccess();
  };

  return (
    <div className="wallet-screen">
      <StatusBar />
      <ScreenHeader onBack={onBack} screenName="send_pin" />

      <div
        className="screen-content"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "8px 16px 4px",
        }}
      >
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#080B0A", margin: "0 0 8px" }}>
            Confirm with your PIN
          </h2>
          <p style={{ fontSize: 14, color: "#61666E", margin: 0 }}>
            Enter your 6-digit PIN to send {formatSats(amount)} sats.
          </p>

          {/* 6 PIN Dots */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              margin: "36px 0 16px",
            }}
          >
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const isFilled = pin.length > index;
              return (
                <div
                  key={index}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: hasError
                      ? "#D62839"
                      : isFilled
                      ? "#0051FE"
                      : "#E4E4E7",
                    border: hasError ? "2px solid #D62839" : "none",
                    transition: "all 0.15s ease",
                  }}
                />
              );
            })}
          </div>

          {/* Error Message */}
          {hasError && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                color: "#D62839",
                fontSize: 14,
                fontWeight: 600,
                marginTop: 8,
              }}
            >
              <AlertCircle size={16} />
              <span>
                That PIN didn't match. {triesLeft} {triesLeft === 1 ? "try" : "tries"} left.
              </span>
            </div>
          )}
        </div>

        {/* Keypad & Face ID button */}
        <div>
          <Keypad onDigit={handleDigit} onDelete={handleDelete} hideDot screenName="send_pin" />

          <div style={{ display: "flex", justifyContent: "center", margin: "8px 0 4px" }}>
            <button
              type="button"
              onClick={() => {
                track("tap", { screen: "send_pin", target: "face_id" });
                handleFaceId();
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: "#0051FE",
                fontSize: 16,
                fontWeight: 600,
                padding: "8px 16px",
              }}
            >
              <ScanFace size={20} />
              Use Face ID instead
            </button>
          </div>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
}
