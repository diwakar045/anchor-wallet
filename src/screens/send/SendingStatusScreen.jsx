// src/screens/send/SendingStatusScreen.jsx
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Zap } from "lucide-react";
import HomeIndicator from "../../components/HomeIndicator";
import StatusBar from "../../components/StatusBar";
import { formatSats } from "../../config";

export default function SendingStatusScreen({ sendData, onComplete }) {
  const [phase, setPhase] = useState("sending"); // "sending" | "sent"

  const { amount = 12, network = "lightning" } = sendData;
  const isLightning = network === "lightning";

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setPhase("sent");
    }, 1500);

    const timer2 = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div
      className="wallet-screen"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: "center",
        padding: "0 24px 20px",
      }}
    >
      <StatusBar />

      <div style={{ margin: "auto 0" }}>
        {phase === "sending" ? (
          <div>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "#E7EEFF",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 20px",
                color: "#0051FE",
              }}
            >
              <Loader2 size={42} style={{ animation: "spin 1s linear infinite" }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#080B0A", margin: "0 0 8px" }}>
              Sending Bitcoin...
            </h2>
            <p style={{ fontSize: 15, color: "#61666E", margin: 0 }}>
              {isLightning ? "Routing payment via Lightning..." : "Broadcasting to Bitcoin network..."}
            </p>
          </div>
        ) : (
          <div>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "#E6F7EE",
                color: "#19A86B",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 20px",
              }}
            >
              <CheckCircle2 size={46} strokeWidth={2.2} />
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: "#080B0A", margin: "0 0 8px" }}>
              Sent {formatSats(amount)} sats!
            </h2>
            <p style={{ fontSize: 15, color: "#61666E", margin: 0 }}>
              {isLightning
                ? "Payment delivered in seconds."
                : "Transaction broadcast. Confirmation pending."}
            </p>
          </div>
        )}
      </div>

      <HomeIndicator />
    </div>
  );
}
