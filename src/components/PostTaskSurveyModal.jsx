// src/components/PostTaskSurveyModal.jsx
// Post-task 1-7 Single Ease Question (SEQ) and optional SUS survey

import { useState } from "react";
import { track } from "../track";

const SUS_QUESTIONS = [
  "I think that I would like to use this wallet frequently.",
  "I found the wallet unnecessarily complex.",
  "I thought the wallet was easy to use.",
  "I think that I would need the support of a technical person to be able to use this wallet.",
  "I found the various functions in this wallet were well integrated.",
  "I thought there was too much inconsistency in this wallet.",
  "I would imagine that most people would learn to use this wallet very quickly.",
  "I found the wallet very cumbersome to use.",
  "I felt very confident using the wallet.",
  "I needed to learn a lot of things before I could get going with this wallet.",
];

export default function PostTaskSurveyModal({ task, isLastTask = false, onDismiss }) {
  const [seqScore, setSeqScore] = useState(null);
  const [showSus, setShowSus] = useState(false);
  const [susAnswers, setSusAnswers] = useState(Array(10).fill(3));

  const handleSeqSelect = (score) => {
    setSeqScore(score);
    track("tap", { screen: "task_survey", target: `seq_score_${score}` });
  };

  const handleSeqSubmit = () => {
    if (seqScore !== null) {
      track("task_rating", { task, score: seqScore });
    }
    if (isLastTask) {
      setShowSus(true);
    } else {
      onDismiss();
    }
  };

  const handleSkip = () => {
    track("tap", { screen: "task_survey", target: "skip_survey" });
    if (isLastTask && !showSus) {
      setShowSus(true);
    } else {
      onDismiss();
    }
  };

  const handleSusChange = (index, value) => {
    const updated = [...susAnswers];
    updated[index] = value;
    setSusAnswers(updated);
  };

  const handleSusSubmit = () => {
    // Calculate SUS score standard formula (0-100)
    // Odd questions (1,3,5,7,9): rating - 1
    // Even questions (2,4,6,8,10): 5 - rating
    // Total sum * 2.5
    let total = 0;
    susAnswers.forEach((ans, idx) => {
      if (idx % 2 === 0) {
        total += ans - 1;
      } else {
        total += 5 - ans;
      }
    });
    const calculatedScore = total * 2.5;

    track("sus_response", { answers: susAnswers, score: calculatedScore });
    onDismiss();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        background: "rgba(8, 11, 10, 0.5)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "0 0 20px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#FFFFFF",
          borderRadius: 24,
          padding: "24px 20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          color: "#080B0A",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        {!showSus ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0051FE", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Task completed: {task.replace("_", " ")}
              </span>
              <button
                type="button"
                onClick={handleSkip}
                style={{ background: "none", border: "none", color: "#81848B", fontSize: 14, cursor: "pointer", fontWeight: 500 }}
              >
                Skip
              </button>
            </div>

            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700 }}>
              How easy was that?
            </h3>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#61666E" }}>
              1 = Very difficult, 7 = Very easy
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", gap: 6, marginBottom: 24 }}>
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleSeqSelect(num)}
                  style={{
                    flex: 1,
                    height: 48,
                    borderRadius: 12,
                    border: seqScore === num ? "2px solid #0051FE" : "1px solid #E7E7E7",
                    background: seqScore === num ? "#0051FE" : "#F4F4F6",
                    color: seqScore === num ? "#FFFFFF" : "#080B0A",
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSeqSubmit}
              disabled={seqScore === null}
              style={{
                width: "100%",
                height: 48,
                borderRadius: 24,
                background: seqScore !== null ? "#0051FE" : "#A6C1FE",
                color: "#FFFFFF",
                border: "none",
                fontSize: 15,
                fontWeight: 600,
                cursor: seqScore !== null ? "pointer" : "not-allowed",
              }}
            >
              Submit Feedback
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0051FE", textTransform: "uppercase" }}>
                Final Research Survey
              </span>
              <button
                type="button"
                onClick={handleSkip}
                style={{ background: "none", border: "none", color: "#81848B", fontSize: 14, cursor: "pointer", fontWeight: 500 }}
              >
                Skip
              </button>
            </div>

            <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 700 }}>
              System Usability Scale (SUS)
            </h3>
            <p style={{ margin: "0 0 16px", fontSize: 12, color: "#61666E" }}>
              Please rate your level of agreement from 1 (Strongly disagree) to 5 (Strongly agree).
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
              {SUS_QUESTIONS.map((q, idx) => (
                <div key={idx} style={{ padding: "10px 0", borderBottom: "1px solid #F0F0F0" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                    {idx + 1}. {q}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleSusChange(idx, val)}
                        style={{
                          flex: 1,
                          height: 36,
                          borderRadius: 8,
                          border: susAnswers[idx] === val ? "1.5px solid #0051FE" : "1px solid #E7E7E7",
                          background: susAnswers[idx] === val ? "#E7EEFF" : "#FAFAFA",
                          color: susAnswers[idx] === val ? "#0051FE" : "#080B0A",
                          fontWeight: 600,
                          fontSize: 13,
                          cursor: "pointer",
                        }}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSusSubmit}
              style={{
                width: "100%",
                height: 48,
                borderRadius: 24,
                background: "#0051FE",
                color: "#FFFFFF",
                border: "none",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Complete Study
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
