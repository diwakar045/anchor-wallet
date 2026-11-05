// src/components/ScreenHeader.jsx
import { ArrowLeft, X } from "lucide-react";
import { track } from "../track";

export default function ScreenHeader({
  title,
  subTitle,
  onBack,
  onClose,
  rightAction,
  screenName = "screen",
  className = "",
}) {
  const handleBack = () => {
    track("tap", { screen: screenName, target: "back_button" });
    track("back_tapped", { screen: screenName });
    if (onBack) onBack();
  };

  const handleClose = () => {
    track("tap", { screen: screenName, target: "close_button" });
    if (onClose) onClose();
  };

  return (
    <header className={`screen-header ${className}`}>
      <div className="screen-header-left">
        {onBack && (
          <button
            type="button"
            className="header-back-button"
            onClick={handleBack}
            aria-label="Go back"
          >
            <ArrowLeft size={24} strokeWidth={2} />
          </button>
        )}
        {onClose && (
          <button
            type="button"
            className="header-close-button"
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={24} strokeWidth={2} />
          </button>
        )}
        {title && (
          <h1 className="screen-title">
            {title}
            {subTitle && <span className="screen-title-sub">- {subTitle}</span>}
          </h1>
        )}
      </div>

      <div className="screen-header-right">{rightAction}</div>
    </header>
  );
}
