// src/App.jsx
// Anchor Wallet Prototype: Master App & Screen Router
// DM Sans font, 393 x 852 viewport, clean component composition with research tracking

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import DemoControlPanel from "./components/DemoControlPanel";
import PostTaskSurveyModal from "./components/PostTaskSurveyModal";
import ResearchConsentModal from "./components/ResearchConsentModal";
import ScanQrModal from "./components/ScanQrModal";
import {
  DEMO_OWN_ADDRESS,
  formatSats,
  INITIAL_TRANSACTIONS,
  satsToFiat,
} from "./config";
import HomeScreen from "./screens/HomeScreen";
import OnboardingContainer from "./screens/onboarding/OnboardingFlow";
import OnChainReceive from "./screens/receive/OnChainReceive";
import ReceiveBitcoin from "./screens/receive/ReceiveBitcoin";
import ReceiveMethodChooser from "./screens/receive/ReceiveMethodChooser";
import AmountScreen from "./screens/send/AmountScreen";
import PinScreen from "./screens/send/PinScreen";
import ReviewScreen from "./screens/send/ReviewScreen";
import SendGuideSheet from "./screens/send/SendGuideSheet";
import SendInputScreen from "./screens/send/SendInputScreen";
import SendingStatusScreen from "./screens/send/SendingStatusScreen";
import { hasUserConsented, track, trackBeacon } from "./track";
import "./app.css";

const PHONE_WIDTH = 393;
const PHONE_HEIGHT = 852;

// Custom fit hook from screen.md
function useFitScale(containerRef) {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const fit = ({ width, height }) => {
      const availableW = width - 40;
      const availableH = height - 40;
      setScale(Math.max(0.4, Math.min(availableW / PHONE_WIDTH, availableH / PHONE_HEIGHT, 1)));
    };

    fit(container.getBoundingClientRect());

    const observer = new ResizeObserver(([entry]) => fit(entry.contentRect));
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef]);

  return scale;
}

export default function App() {
  const containerRef = useRef(null);
  const scale = useFitScale(containerRef);

  // App Navigation State
  const [screen, setScreen] = useState("home");
  const previousScreenRef = useRef(null);

  // Wallet State
  const [wallet, setWallet] = useState({
    account: "Savings21",
    balance: 567,
    fiat: "$0.79",
    transactions: INITIAL_TRANSACTIONS,
    ownAddress: DEMO_OWN_ADDRESS,
  });

  // Send Flow Data
  const [sendData, setSendData] = useState({
    recipient: "",
    displayTo: "",
    amount: 12,
    fee: 1,
    network: "bitcoin",
    isInvoiceLocked: false,
    expiresIn: "09:42",
  });

  // UI state
  const [isSendGuideOpen, setIsSendGuideOpen] = useState(false);
  const [hasSeenSendGuide, setHasSeenSendGuide] = useState(false);
  const [isReceiveChooserOpen, setIsReceiveChooserOpen] = useState(false);
  const [hasSeenReceiveGuide, setHasSeenReceiveGuide] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  // Research tracking & screener state
  const [showConsentModal, setShowConsentModal] = useState(!hasUserConsented());
  const [activeTask, setActiveTask] = useState(null); // "onboarding" | "first_receive" | "first_send"
  const taskStartTimeRef = useRef(0);
  const taskTapCountRef = useRef(0);
  const idleTimeDeductedRef = useRef(0);
  const lastActiveTimestampRef = useRef(Date.now());
  const isIdleRef = useRef(false);

  // Post-task survey modal
  const [surveyTask, setSurveyTask] = useState(null);
  const [isLastSurvey, setIsLastSurvey] = useState(false);
  const completedTasksRef = useRef(new Set());

  // Screen View tracking & Flow determination
  useEffect(() => {
    let flow = "general";
    if (screen === "onboarding") flow = "onboarding";
    else if (screen.startsWith("send_") || screen === "sending_status") flow = "send";
    else if (screen.startsWith("receive_")) flow = "receive";

    track("screen_view", {
      screen,
      previous_screen: previousScreenRef.current,
      flow,
    });
    previousScreenRef.current = screen;
  }, [screen]);

  // Global Tap Counter & Idle Detection & Abandon Tracking
  useEffect(() => {
    const handleGlobalClick = () => {
      taskTapCountRef.current += 1;
      lastActiveTimestampRef.current = Date.now();
      isIdleRef.current = false;
    };

    window.addEventListener("click", handleGlobalClick, true);

    // 60-second Idle detection interval
    const idleInterval = setInterval(() => {
      const now = Date.now();
      const idleDuration = now - lastActiveTimestampRef.current;
      if (idleDuration >= 60000 && !isIdleRef.current) {
        isIdleRef.current = true;
        idleTimeDeductedRef.current += idleDuration;
        track("idle_timeout", { current_screen: screen, active_task: activeTask });
      }
    }, 5000);

    // Abandon on visibilitychange (hidden) or pagehide using sendBeacon
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        const timeOnScreen = Date.now() - (taskStartTimeRef.current || Date.now());
        trackBeacon("abandon", {
          screen,
          task: activeTask,
          time_on_screen_ms: Math.max(0, timeOnScreen - idleTimeDeductedRef.current),
        });
      }
    };

    const handlePageHide = () => {
      const timeOnScreen = Date.now() - (taskStartTimeRef.current || Date.now());
      trackBeacon("abandon", {
        screen,
        task: activeTask,
        time_on_screen_ms: Math.max(0, timeOnScreen - idleTimeDeductedRef.current),
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("click", handleGlobalClick, true);
      clearInterval(idleInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [screen, activeTask]);

  // Task Helpers
  const startTask = (taskName) => {
    setActiveTask(taskName);
    taskStartTimeRef.current = Date.now();
    taskTapCountRef.current = 0;
    idleTimeDeductedRef.current = 0;
    lastActiveTimestampRef.current = Date.now();
    isIdleRef.current = false;
    track("task_start", { task: taskName });
  };

  const completeTask = (taskName) => {
    const totalTime = Date.now() - taskStartTimeRef.current;
    const durationMs = Math.max(0, totalTime - idleTimeDeductedRef.current);
    const taps = taskTapCountRef.current;

    track("task_complete", {
      task: taskName,
      duration_ms: durationMs,
      tap_count: taps,
    });

    completedTasksRef.current.add(taskName);
    const allDone = completedTasksRef.current.size >= 3;

    setActiveTask(null);
    setSurveyTask(taskName);
    setIsLastSurvey(allDone);
  };

  // Navigation handlers
  const handleHomeSendClick = () => {
    track("tap", { screen: "home", target: "send_button" });
    if (!activeTask) startTask("first_send");
    setScreen("send_input");
    if (!hasSeenSendGuide) {
      setIsSendGuideOpen(true);
    }
  };

  const handleHomeReceiveClick = () => {
    track("tap", { screen: "home", target: "receive_button" });
    if (!activeTask) startTask("first_receive");
    if (!hasSeenReceiveGuide) {
      setIsReceiveChooserOpen(true);
    } else {
      setScreen("receive_lightning");
    }
  };

  const handleSendGuideComplete = (selectedMethod) => {
    setHasSeenSendGuide(true);
    setIsSendGuideOpen(false);
    if (selectedMethod === "scan") {
      setIsScanModalOpen(true);
    }
  };

  const handleProceedToAmount = (parsedData) => {
    setSendData((prev) => ({
      ...prev,
      ...parsedData,
    }));
    setScreen("send_amount");
  };

  const handleProceedToReview = (parsedData) => {
    setSendData((prev) => ({
      ...prev,
      ...parsedData,
    }));
    setScreen("send_review");
  };

  const handleProceedToPin = (reviewData) => {
    setSendData((prev) => ({
      ...prev,
      ...reviewData,
    }));
    setScreen("send_pin");
  };

  const handlePinSuccess = () => {
    setScreen("sending_status");
  };

  const handleSendingComplete = () => {
    const deduction = (sendData.amount || 0) + (sendData.fee || 0);
    const newBalance = Math.max(0, wallet.balance - deduction);

    const newTx = {
      id: `tx-${Date.now()}`,
      address: sendData.displayTo || sendData.recipient || "bc1qxy...x0wlh",
      amount: sendData.amount || 12,
      time: "just now",
      account: wallet.account,
      network: sendData.network || "bitcoin",
    };

    setWallet((prev) => ({
      ...prev,
      balance: newBalance,
      fiat: satsToFiat(newBalance),
      transactions: [newTx, ...prev.transactions],
    }));

    if (activeTask === "first_send") {
      completeTask("first_send");
    }

    setScreen("home");
  };

  const handleOnboardingComplete = (walletName) => {
    setWallet({
      account: walletName || "Savings21",
      balance: 0,
      fiat: "$0.00",
      transactions: [],
      ownAddress: DEMO_OWN_ADDRESS,
    });

    if (activeTask === "onboarding") {
      completeTask("onboarding");
    }

    setScreen("home");
  };

  const handleReceiveRequestCreated = (requestData) => {
    const txId = `req-${Date.now()}`;
    const receivedAmount = requestData.amount || 12;

    const waitingTx = {
      id: txId,
      status: "waiting",
      amount: receivedAmount,
      time: "1 minute ago",
      expiresAt: requestData.expirationTime || "2:51 PM",
      network: requestData.network || "lightning",
      address: requestData.previewAddress || "ln9087fgryu...iou",
    };

    setWallet((prev) => ({
      ...prev,
      transactions: [waitingTx, ...prev.transactions],
    }));

    // Complete receive task
    if (activeTask === "first_receive") {
      completeTask("first_receive");
    }

    setTimeout(() => {
      setWallet((prev) => {
        const updatedTransactions = prev.transactions.map((tx) => {
          if (tx.id === txId) {
            return {
              ...tx,
              status: "received",
              invoice: "Invoice321",
              time: "Just now",
              account: prev.account,
            };
          }
          return tx;
        });

        const newBalance = prev.balance + receivedAmount;

        return {
          ...prev,
          balance: newBalance,
          fiat: satsToFiat(newBalance),
          transactions: updatedTransactions,
        };
      });
    }, 10000);
  };

  const handleQuickFillRecipient = (val) => {
    setSendData((prev) => ({
      ...prev,
      recipient: val,
    }));
    setScreen("send_input");
  };

  return (
    <div className="preview-page">
      {/* ── Research Consent & Screener Modal ──────────────────── */}
      {showConsentModal && (
        <ResearchConsentModal
          onConsentGiven={(exp) => {
            setShowConsentModal(false);
          }}
        />
      )}

      {/* ── Post-Task Survey Modal ──────────────────────────────── */}
      {surveyTask && (
        <PostTaskSurveyModal
          task={surveyTask}
          isLastTask={isLastSurvey}
          onDismiss={() => setSurveyTask(null)}
        />
      )}

      <div className="preview-available-space" ref={containerRef}>
        <div
          className="preview-scaled-frame"
          style={{
            width: PHONE_WIDTH * scale,
            height: PHONE_HEIGHT * scale,
          }}
        >
          <div
            className="preview-phone"
            style={{ transform: `scale(${scale})` }}
          >
            {/* 1. Onboarding Flow */}
            {screen === "onboarding" && (
              <OnboardingContainer
                onComplete={handleOnboardingComplete}
                onCancel={() => setScreen("home")}
              />
            )}

            {/* 2. Home Screen */}
            {screen === "home" && (
              <HomeScreen
                wallet={wallet}
                onSend={handleHomeSendClick}
                onReceive={handleHomeReceiveClick}
                onAccountClick={() => {
                  track("tap", { screen: "home", target: "account_switcher" });
                  alert(`Account switcher: currently active ${wallet.account}`);
                }}
                onAdd={() => {
                  track("tap", { screen: "home", target: "add_account" });
                  alert("Add account dialog");
                }}
                onSettings={() => {
                  track("tap", { screen: "home", target: "settings_button" });
                  alert("Wallet settings");
                }}
                onViewAll={() => {
                  track("tap", { screen: "home", target: "view_all_transactions" });
                  alert("Viewing all transactions");
                }}
                onHelp={() => {
                  track("tap", { screen: "home", target: "help_button" });
                  alert("Anchor Help & Major Technical Project documentation");
                }}
              />
            )}

            {/* 3. Send Input Screen */}
            {screen === "send_input" && (
              <SendInputScreen
                wallet={wallet}
                initialRecipient={sendData.recipient}
                onBack={() => setScreen("home")}
                onProceedToAmount={handleProceedToAmount}
                onProceedToReview={handleProceedToReview}
                onOpenScan={() => {
                  track("tap", { screen: "send_input", target: "scan_qr_row" });
                  setIsScanModalOpen(true);
                }}
              />
            )}

            {/* 4. Send Amount Screen */}
            {screen === "send_amount" && (
              <AmountScreen
                sendData={sendData}
                wallet={wallet}
                onBack={() => setScreen("send_input")}
                onProceedToReview={handleProceedToReview}
              />
            )}

            {/* 5. Send Review Screen */}
            {screen === "send_review" && (
              <ReviewScreen
                sendData={sendData}
                wallet={wallet}
                onBack={() => {
                  if (sendData.isInvoiceLocked) {
                    setScreen("send_input");
                  } else {
                    setScreen("send_amount");
                  }
                }}
                onProceedToPin={handleProceedToPin}
                onEditRecipient={() => setScreen("send_input")}
              />
            )}

            {/* 6. Send PIN Screen */}
            {screen === "send_pin" && (
              <PinScreen
                sendData={sendData}
                onBack={() => setScreen("send_review")}
                onSuccess={handlePinSuccess}
              />
            )}

            {/* 7. Sending Status Screen */}
            {screen === "sending_status" && (
              <SendingStatusScreen
                sendData={sendData}
                onComplete={handleSendingComplete}
              />
            )}

            {/* 8. Receive – Lightning */}
            {screen === "receive_lightning" && (
              <ReceiveBitcoin
                lightningInvoice="lnbc2500u1p3x0wlhpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdpk22ex2cqzpgxq97zvuq8vqqx4qz9s"
                onChainAddress={wallet.ownAddress}
                walletName={wallet.account}
                onBack={() => setScreen("home")}
                onSwitchToOnChain={() => {
                  track("tap", { screen: "receive_lightning", target: "tab_onchain" });
                  setScreen("receive_onchain");
                }}
                onShare={(requestData) => {
                  track("tap", { screen: "receive_lightning", target: "share_button" });
                  handleReceiveRequestCreated(requestData);
                  setScreen("home");
                }}
              />
            )}

            {/* 9. Receive – On-chain */}
            {screen === "receive_onchain" && (
              <OnChainReceive
                onChainAddress={wallet.ownAddress}
                lightningInvoice="lnbc2500u1p3x0wlhpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdpk22ex2cqzpgxq97zvuq8vqqx4qz9s"
                walletName={wallet.account}
                onBack={() => setScreen("home")}
                onSwitchToLightning={() => {
                  track("tap", { screen: "receive_onchain", target: "tab_lightning" });
                  setScreen("receive_lightning");
                }}
                onShare={(requestData) => {
                  track("tap", { screen: "receive_onchain", target: "share_button" });
                  handleReceiveRequestCreated(requestData);
                  setScreen("home");
                }}
              />
            )}

            {/* Send Guide Sheet (Steps 1 & 2) */}
            <SendGuideSheet
              isOpen={isSendGuideOpen}
              onClose={() => setIsSendGuideOpen(false)}
              onComplete={handleSendGuideComplete}
            />

            {/* First-time Receive Method Chooser Bottom Sheet */}
            <ReceiveMethodChooser
              isOpen={isReceiveChooserOpen}
              onClose={() => setIsReceiveChooserOpen(false)}
              onContinue={(method) => {
                setHasSeenReceiveGuide(true);
                setIsReceiveChooserOpen(false);
                if (method === "lightning") {
                  setScreen("receive_lightning");
                } else {
                  setScreen("receive_onchain");
                }
              }}
            />

            {/* Scan QR Modal */}
            <ScanQrModal
              isOpen={isScanModalOpen}
              onClose={() => setIsScanModalOpen(false)}
              onScanned={(scannedValue) => {
                track("tap", { screen: "scan_modal", target: "qr_scanned" });
                setSendData((prev) => ({ ...prev, recipient: scannedValue }));
                setScreen("send_input");
              }}
            />
          </div>
        </div>
      </div>

      {/* Floating Demo Control Bar */}
      <DemoControlPanel
        wallet={wallet}
        setWallet={setWallet}
        currentScreen={screen}
        goToScreen={(s) => {
          if (s === "onboarding") {
            startTask("onboarding");
          }
          setScreen(s);
        }}
        onQuickFillRecipient={handleQuickFillRecipient}
      />
    </div>
  );
}
