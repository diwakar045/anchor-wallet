// src/screens/receive/ReceiveGuideOverlay.jsx
// First-time overlay shown when wallet has zero receive transactions.
// Allows the user to choose Lightning or On-chain before seeing the receive screen.

import { Info, Link as LinkIcon, Zap } from "lucide-react";
import HomeIndicator from "../../components/HomeIndicator";
import PrimaryButton from "../../components/PrimaryButton";
import ScreenHeader from "../../components/ScreenHeader";
import StatusBar from "../../components/StatusBar";

export default function ReceiveGuideOverlay({
  onChooseLightning,
  onChooseOnChain,
  onBack,
  walletName = "Savings21",
}) {
  return (
    <div className="wallet-screen">
      <StatusBar />
      <ScreenHeader
        title="Receive Bitcoin"
        subTitle={walletName}
        onBack={onBack}
      />

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

          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#080B0A",
              margin: "0 0 8px",
            }}
          >
            Receiving for the first time?
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "#61666E",
              lineHeight: "20px",
              margin: "0 0 24px",
            }}
          >
            Bitcoin has two ways to receive funds. Choose the one that matches
            how you're being paid.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {/* Lightning option */}
            <div
              onClick={onChooseLightning}
              style={{
                border: "1.5px solid #0051FE",
                background: "#E7EEFF",
                borderRadius: 14,
                padding: "16px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 4,
                }}
              >
                <Zap size={20} color="#0051FE" />
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#0051FE",
                  }}
                >
                  Lightning (Recommended)
                </span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "#4D4D52",
                  margin: 0,
                  lineHeight: "18px",
                }}
              >
                Fastest and cheapest. Perfect for small, everyday amounts.
                Arrives in seconds with almost zero fees.
              </p>
            </div>

            {/* On-chain option */}
            <div
              onClick={onChooseOnChain}
              style={{
                border: "1px solid #E7E7E7",
                background: "#FFFFFF",
                borderRadius: 14,
                padding: "16px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 4,
                }}
              >
                <LinkIcon size={20} color="#61666E" />
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#080B0A",
                  }}
                >
                  Bitcoin On-chain
                </span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "#61666E",
                  margin: 0,
                  lineHeight: "18px",
                }}
              >
                Direct on the Bitcoin blockchain. Best for larger transfers or
                cold storage wallets. Takes 10–60 minutes.
              </p>
            </div>
          </div>
        </div>

        <div style={{ paddingBottom: 8 }}>
          <PrimaryButton onClick={onChooseLightning}>Continue</PrimaryButton>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
}
