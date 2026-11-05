// src/components/ResearchConsentModal.jsx
// Consent & screener modal displayed before user begins testing the prototype

import { useState } from "react";
import { optInTracking, track } from "../track";

export default function ResearchConsentModal({ onConsentGiven }) {
  const [experienceLevel, setExperienceLevel] = useState("Never");

  const handleContinue = () => {
    track("tap", { screen: "research_consent", target: "consent_continue" });
    optInTracking(experienceLevel);
    if (onConsentGiven) {
      onConsentGiven(experienceLevel);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(8, 11, 10, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#FFFFFF",
          borderRadius: 20,
          padding: 28,
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
          color: "#080B0A",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#E7EEFF",
              color: "#0051FE",
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            ⚓
          </div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>University Research Study</h2>
        </div>

        <p style={{ fontSize: 14, lineHeight: 1.5, color: "#61666E", margin: "0 0 20px" }}>
          Anonymous usage is recorded for a university research project. No personal data is collected.
        </p>

        <div style={{ margin: "20px 0" }}>
          <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 10, color: "#080B0A" }}>
            Have you used a Bitcoin wallet before?
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {["Never", "A few times", "Regularly"].map((opt) => (
              <label
                key={opt}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: experienceLevel === opt ? "1.5px solid #0051FE" : "1px solid #E7E7E7",
                  background: experienceLevel === opt ? "#F0F4FF" : "#FAFAFA",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                <input
                  type="radio"
                  name="experience"
                  value={opt}
                  checked={experienceLevel === opt}
                  onChange={() => {
                    setExperienceLevel(opt);
                    track("tap", { screen: "research_consent", target: `experience_${opt.toLowerCase().replace(/\s+/g, "_")}` });
                  }}
                  style={{ accentColor: "#0051FE", width: 16, height: 16 }}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          style={{
            width: "100%",
            height: 48,
            borderRadius: 24,
            background: "#0051FE",
            color: "#FFFFFF",
            border: "none",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            marginTop: 10,
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
