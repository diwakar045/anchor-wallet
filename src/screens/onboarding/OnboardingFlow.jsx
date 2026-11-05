// src/screens/onboarding/OnboardingFlow.jsx
import { useEffect, useState } from "react";
import {
  Anchor,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  ShieldAlert,
  Wallet,
  XCircle,
  Zap,
} from "lucide-react";
import HomeIndicator from "../../components/HomeIndicator";
import ModalDialog from "../../components/ModalDialog";
import PrimaryButton from "../../components/PrimaryButton";
import ScreenHeader from "../../components/ScreenHeader";
import StatusBar from "../../components/StatusBar";
import { SEED_PHRASE_WORDS } from "../../config";
import { track } from "../../track";

// 1. Splash Screen
export function SplashScreen({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="wallet-screen"
      style={{
        background: "#0051FE",
        color: "#FFFFFF",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 0 20px",
      }}
      onClick={onDone}
    >
      <StatusBar dark />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            background: "rgba(255, 255, 255, 0.2)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Anchor size={46} color="#FFFFFF" strokeWidth={2.2} />
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "4px",
            color: "#FFFFFF",
          }}
        >
          ANCHOR
        </span>
      </div>

      <HomeIndicator white />
    </div>
  );
}

// 2. Welcome Screen
export function WelcomeScreen({ onContinue }) {
  return (
    <div className="wallet-screen">
      <StatusBar />

      <div className="screen-content" style={{ justifyContent: "space-between", padding: "16px 20px" }}>
        {/* Placeholder Illustration Box */}
        <div
          style={{
            width: "100%",
            height: 290,
            borderRadius: 16,
            background: "#F4F4F6",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              background: "#E7EEFF",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Wallet size={44} color="#0051FE" />
          </div>
          <span style={{ marginTop: 14, fontSize: 13, color: "#989CA3" }}>Anchor Self-Custody</span>
        </div>

        <div style={{ marginTop: 32, marginBottom: "auto" }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#080B0A", margin: "0 0 12px" }}>
            Welcome!
          </h1>
          <p style={{ fontSize: 16, lineHeight: "24px", color: "#61666E", margin: 0 }}>
            With Anchor, smoothly send, recieve and manage cryptocurrencies.
          </p>
        </div>

        <div style={{ width: "100%", paddingBottom: 12 }}>
          <PrimaryButton onClick={onContinue}>Continue</PrimaryButton>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
}

// 3. Your Keys, Your Coins Screen
export function YourKeysScreen({ onContinue, onSkip, onBack }) {
  return (
    <div className="wallet-screen">
      <StatusBar />
      <ScreenHeader
        onBack={onBack}
        rightAction={
          <button type="button" className="header-text-button" onClick={onSkip}>
            Skip
          </button>
        }
      />

      <div className="screen-content" style={{ justifyContent: "space-between", padding: "8px 20px 16px" }}>
        {/* Progress segments: 1 active */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "8px 0 20px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#0051FE" }} />
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#EEF0F4" }} />
        </div>

        <div
          style={{
            width: "100%",
            height: 250,
            borderRadius: 16,
            background: "#F4F4F6",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "#E7EEFF",
              display: "grid",
              placeItems: "center",
            }}
          >
            <KeyRound size={40} color="#0051FE" />
          </div>
          <span style={{ marginTop: 12, fontSize: 13, color: "#989CA3" }}>Private Keys</span>
        </div>

        <div style={{ marginTop: 24, marginBottom: "auto" }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#080B0A", margin: "0 0 10px" }}>
            Your Keys, Your Coins
          </h2>
          <p style={{ fontSize: 16, lineHeight: "24px", color: "#61666E", margin: 0 }}>
            Anchor is a self custodial wallet. Your funds live on your device, controlled only by you.
          </p>
        </div>

        <div style={{ width: "100%", paddingBottom: 12 }}>
          <PrimaryButton onClick={onContinue}>Continue</PrimaryButton>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
}

// 4. Two Ways to Pay Screen
export function TwoWaysScreen({ onContinue, onSkip, onBack }) {
  return (
    <div className="wallet-screen">
      <StatusBar />
      <ScreenHeader
        onBack={onBack}
        rightAction={
          <button type="button" className="header-text-button" onClick={onSkip}>
            Skip
          </button>
        }
      />

      <div className="screen-content" style={{ justifyContent: "space-between", padding: "8px 20px 16px" }}>
        {/* Progress segments: 2 active */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "8px 0 20px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#EEF0F4" }} />
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#0051FE" }} />
        </div>

        <div
          style={{
            width: "100%",
            height: 250,
            borderRadius: 16,
            background: "#F4F4F6",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "#E7EEFF",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Zap size={40} color="#0051FE" />
          </div>
          <span style={{ marginTop: 12, fontSize: 13, color: "#989CA3" }}>Lightning & On-chain</span>
        </div>

        <div style={{ marginTop: 24, marginBottom: "auto" }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#080B0A", margin: "0 0 10px" }}>
            Two Ways to Pay
          </h2>
          <p style={{ fontSize: 16, lineHeight: "24px", color: "#61666E", margin: 0 }}>
            Lightning for everyday amounts, or on-chain for larger transfers.
          </p>
        </div>

        <div style={{ width: "100%", paddingBottom: 12 }}>
          <PrimaryButton onClick={onContinue}>Continue</PrimaryButton>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
}

// 5. Backup Recovery Phrase Screen
export function BackupPromptScreen({ onShowPhrase, onClose }) {
  return (
    <div className="wallet-screen">
      <StatusBar />
      <ScreenHeader onClose={onClose} />

      <div className="screen-content" style={{ padding: "0 20px 16px", justifyContent: "space-between" }}>
        <div>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#FFF6E0",
              color: "#B7791F",
              display: "grid",
              placeItems: "center",
              marginBottom: 16,
            }}
          >
            <ShieldAlert size={32} />
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#080B0A", margin: "0 0 16px" }}>
            Backup your recovery phrase
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 10, fontSize: 14, lineHeight: "20px", color: "#4D4D52" }}>
              <span style={{ fontWeight: 600, color: "#0051FE" }}>1.</span>
              <span>
                On the next screen, you'll see 12 words. They're the only way to recover your wallet, so
                keep them private and somewhere safe.
              </span>
            </div>

            <div style={{ display: "flex", gap: 10, fontSize: 14, lineHeight: "20px", color: "#4D4D52" }}>
              <span style={{ fontWeight: 600, color: "#0051FE" }}>2.</span>
              <span>Do not take screen shot, write them down on paper.</span>
            </div>

            <div style={{ display: "flex", gap: 10, fontSize: 14, lineHeight: "20px", color: "#4D4D52" }}>
              <span style={{ fontWeight: 600, color: "#0051FE" }}>3.</span>
              <span>Do not share this seed with anyone. Anchor will never ask for your seed.</span>
            </div>

            <div style={{ display: "flex", gap: 10, fontSize: 14, lineHeight: "20px", color: "#4D4D52" }}>
              <span style={{ fontWeight: 600, color: "#0051FE" }}>4.</span>
              <span>If you lose your seed (phrase), you've lost your funds.</span>
            </div>
          </div>
        </div>

        <div style={{ width: "100%", paddingBottom: 12 }}>
          <PrimaryButton onClick={onShowPhrase}>Show seed phrase</PrimaryButton>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
}

// 6. Name Your Wallet Screen
export function NameWalletScreen({ onDone, onClose }) {
  const [name, setName] = useState("Savings21");

  return (
    <div className="wallet-screen">
      <StatusBar />
      <ScreenHeader onClose={onClose} />

      <div className="screen-content" style={{ padding: "0 20px 16px", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#080B0A", margin: "10px 0 8px" }}>
            Name your wallet
          </h2>
          <p style={{ fontSize: 14, color: "#61666E", margin: "0 0 28px" }}>
            Let's start setting up your account. Name your wallet
          </p>

          <div
            style={{
              background: "#F4F4F6",
              borderRadius: 8,
              border: `1.5px solid ${name ? "#0051FE" : "#E7E7E7"}`,
              padding: "14px 16px",
            }}
          >
            <input
              type="text"
              value={name}
              placeholder="Enter Name"
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 18,
                fontWeight: 500,
                color: "#080B0A",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        <div style={{ width: "100%", paddingBottom: 12 }}>
          <PrimaryButton disabled={!name.trim()} onClick={() => onDone(name.trim())}>
            Continue
          </PrimaryButton>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
}

// Complete Interactive Onboarding Dialogs Container
export default function OnboardingContainer({ onComplete, onCancel }) {
  const [step, setStep] = useState("splash"); // splash -> welcome -> keys -> ways -> backup -> name
  const [dialogState, setDialogState] = useState(null); // null | "seed" | "verify" | "verifying" | "verified" | "failed"
  const [selectedWords, setSelectedWords] = useState([]);
  const [walletName, setWalletName] = useState("Savings21");

  // Shuffled words for verification screen
  const [shuffledWords, setShuffledWords] = useState([]);
  const [verifyAttempts, setVerifyAttempts] = useState(0);

  const handleShowPhrase = () => {
    setDialogState("seed");
  };

  const handleStartVerify = () => {
    // Generate deterministic or random shuffle
    const shuffled = [...SEED_PHRASE_WORDS].sort(() => 0.5 - Math.random());
    setShuffledWords(shuffled);
    setSelectedWords([]);
    setDialogState("verify");
  };

  const handleSelectWord = (word) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleCheckVerification = () => {
    setDialogState("verifying");

    setTimeout(() => {
      // Check if selectedWords matches SEED_PHRASE_WORDS
      const isCorrect =
        selectedWords.length === SEED_PHRASE_WORDS.length &&
        selectedWords.every((w, idx) => w === SEED_PHRASE_WORDS[idx]);

      if (isCorrect) {
        setDialogState("verified");
        setTimeout(() => {
          setDialogState(null);
          setStep("name");
        }, 1200);
      } else {
        const nextAttempt = verifyAttempts + 1;
        setVerifyAttempts(nextAttempt);
        track("seed_verify_failed", { attempt: nextAttempt });
        setDialogState("failed");
      }
    }, 1500);
  };

  return (
    <>
      {step === "splash" && <SplashScreen onDone={() => setStep("welcome")} />}

      {step === "welcome" && <WelcomeScreen onContinue={() => setStep("keys")} />}

      {step === "keys" && (
        <YourKeysScreen
          onContinue={() => setStep("ways")}
          onSkip={() => setStep("backup")}
          onBack={() => setStep("welcome")}
        />
      )}

      {step === "ways" && (
        <TwoWaysScreen
          onContinue={() => setStep("backup")}
          onSkip={() => setStep("backup")}
          onBack={() => setStep("keys")}
        />
      )}

      {step === "backup" && (
        <BackupPromptScreen
          onShowPhrase={handleShowPhrase}
          onClose={onCancel || (() => setStep("welcome"))}
        />
      )}

      {step === "name" && (
        <NameWalletScreen
          onDone={(name) => {
            setWalletName(name);
            onComplete(name);
          }}
          onClose={() => setStep("backup")}
        />
      )}

      {/* Seed Phrase Modal (Frame 231:14493) */}
      <ModalDialog
        isOpen={dialogState === "seed"}
        onClose={() => setDialogState(null)}
        title="Seed phrase"
        subtitle="Write these phrases down including both numbers and words."
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px 12px",
            marginBottom: 24,
          }}
        >
          {SEED_PHRASE_WORDS.map((word, idx) => (
            <div
              key={word}
              style={{
                background: "#EEF0F4",
                borderRadius: 100,
                padding: "8px 14px",
                fontSize: 14,
                fontWeight: 500,
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <span style={{ color: "#989CA3", fontSize: 13 }}>{idx + 1}</span>
              <span style={{ color: "#080B0A" }}>{word}</span>
            </div>
          ))}
        </div>

        <PrimaryButton onClick={handleStartVerify}>Next</PrimaryButton>
      </ModalDialog>

      {/* Verify Phrase Modal (Frame 231:14564) */}
      <ModalDialog
        isOpen={dialogState === "verify"}
        onClose={() => setDialogState(null)}
        title="Verify phrase"
        subtitle="Tap the words in correct order."
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px 12px",
            marginBottom: 20,
          }}
        >
          {shuffledWords.map((word) => {
            const selectedIndex = selectedWords.indexOf(word);
            const isSelected = selectedIndex !== -1;

            return (
              <button
                type="button"
                key={word}
                onClick={() => handleSelectWord(word)}
                style={{
                  background: isSelected ? "#E7EEFF" : "#EEF0F4",
                  border: isSelected ? "1.5px solid #0051FE" : "1.5px solid transparent",
                  borderRadius: 100,
                  padding: "8px 14px",
                  fontSize: 14,
                  fontWeight: 500,
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                {isSelected ? (
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#0051FE",
                      color: "#FFFFFF",
                      fontSize: 11,
                      fontWeight: 700,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {selectedIndex + 1}
                  </span>
                ) : (
                  <span style={{ color: "#989CA3", fontSize: 13 }}>•</span>
                )}
                <span style={{ color: isSelected ? "#0051FE" : "#080B0A" }}>{word}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <PrimaryButton variant="secondary" onClick={() => setDialogState("seed")}>
            Back
          </PrimaryButton>
          <PrimaryButton
            disabled={selectedWords.length !== SEED_PHRASE_WORDS.length}
            onClick={handleCheckVerification}
          >
            Next
          </PrimaryButton>
        </div>
      </ModalDialog>

      {/* Verifying Phrase Spinner (Frame 231:14638) */}
      <ModalDialog
        isOpen={dialogState === "verifying"}
        title="Verifying phrase"
        subtitle="Don't cancel the screen while verifying"
      >
        <div style={{ display: "grid", placeItems: "center", padding: "30px 0" }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              border: "4px solid #E7EEFF",
              borderTopColor: "#0051FE",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </ModalDialog>

      {/* Verified Successfully (Frame 231:14670) */}
      <ModalDialog isOpen={dialogState === "verified"} title="" subtitle="">
        <div style={{ textAlign: "center", padding: "10px 0 20px" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#E6F7EE",
              color: "#19A86B",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 16px",
            }}
          >
            <CheckCircle2 size={38} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 6px", color: "#080B0A" }}>
            Verified successfully
          </h3>
        </div>
      </ModalDialog>

      {/* Verification Failed Modal (Frame 231:14698) */}
      <ModalDialog isOpen={dialogState === "failed"} title="" subtitle="">
        <div style={{ textAlign: "center", padding: "10px 0 20px" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#FEEFF0",
              color: "#D62839",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 16px",
            }}
          >
            <XCircle size={38} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px", color: "#080B0A" }}>
            Verification Failed
          </h3>
          <p style={{ fontSize: 14, color: "#61666E", margin: "0 0 20px", lineHeight: "20px" }}>
            There's a mis-match! It happens sometimes. You can review and enter phrase again.
          </p>

          <PrimaryButton variant="secondary" onClick={() => setDialogState("seed")}>
            Review phrase
          </PrimaryButton>
        </div>
      </ModalDialog>
    </>
  );
}
