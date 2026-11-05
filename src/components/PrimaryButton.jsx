// src/components/PrimaryButton.jsx
import { useEffect, useRef, useState } from "react";
import { track } from "../track";

export default function PrimaryButton({
  children,
  onClick,
  disabled = false,
  variant = "primary", // "primary" | "secondary" | "text"
  holdToConfirm = false,
  holdDurationMs = 1000,
  hint,
  icon,
  screenName = "screen",
  targetName,
  className = "",
  style = {},
}) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);

  const buttonText = typeof children === "string" ? children : "primary_btn";
  const targetId = targetName || buttonText.toLowerCase().replace(/\s+/g, "_");

  const handleClick = (e) => {
    track("tap", { screen: screenName, target: targetId });
    if (onClick) onClick(e);
  };

  useEffect(() => {
    if (!holdToConfirm || !isHolding) {
      setProgress(0);
      return;
    }

    startTimeRef.current = Date.now();
    const interval = 25; // 40fps

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, (elapsed / holdDurationMs) * 100);
      setProgress(pct);

      if (elapsed >= holdDurationMs) {
        clearInterval(timerRef.current);
        setIsHolding(false);
        setProgress(0);
        track("tap", { screen: screenName, target: `${targetId}_confirmed` });
        if (onClick) onClick();
      }
    }, interval);

    return () => clearInterval(timerRef.current);
  }, [isHolding, holdToConfirm, holdDurationMs, onClick]);

  const handlePointerDown = () => {
    if (disabled) return;
    if (holdToConfirm) {
      setIsHolding(true);
    }
  };

  const handlePointerUp = () => {
    if (disabled) return;
    if (holdToConfirm) {
      setIsHolding(false);
      setProgress(0);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      track("tap", { screen: screenName, target: targetId });
      if (onClick) onClick();
    }
  };

  const handlePointerLeave = () => {
    if (holdToConfirm && isHolding) {
      setIsHolding(false);
      setProgress(0);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  if (variant === "text") {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          track("tap", { screen: screenName, target: targetId });
          if (onClick) onClick(e);
        }}
        className={`btn-text ${className}`}
        style={style}
      >
        {children}
      </button>
    );
  }

  const btnClass = variant === "secondary" ? "btn-secondary" : "btn-primary";

  return (
    <div className="hold-button-wrapper">
      <button
        type="button"
        disabled={disabled}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        className={`${btnClass} ${className}`}
        style={style}
      >
        {holdToConfirm && progress > 0 && (
          <div
            className="hold-progress-fill"
            style={{ width: `${progress}%` }}
          />
        )}
        {icon}
        <span>{children}</span>
      </button>

      {hint && <div className="button-hint">{hint}</div>}
    </div>
  );
}
