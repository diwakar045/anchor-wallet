// src/components/ModalDialog.jsx
import { X } from "lucide-react";

export default function ModalDialog({
  isOpen = true,
  onClose,
  title,
  subtitle,
  children,
  className = "",
}) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className={`modal-card ${className}`}>
        {onClose && (
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} strokeWidth={2} />
          </button>
        )}
        {title && (
          <h2
            style={{
              textAlign: "center",
              fontSize: "20px",
              fontWeight: 600,
              margin: "0 0 6px",
              color: "#080B0A",
            }}
          >
            {title}
          </h2>
        )}
        {subtitle && (
          <p
            style={{
              textAlign: "center",
              fontSize: "13px",
              lineHeight: "18px",
              color: "#61666E",
              margin: "0 0 20px",
            }}
          >
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
