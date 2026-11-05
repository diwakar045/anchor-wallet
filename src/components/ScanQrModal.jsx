// src/components/ScanQrModal.jsx
import { Camera, QrCode, X } from "lucide-react";
import { PRESET_INPUTS } from "../config";

export default function ScanQrModal({ isOpen, onClose, onScanned }) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div
        className="modal-card"
        style={{
          width: 360,
          maxHeight: "85vh",
          overflowY: "auto",
          padding: "20px 18px",
        }}
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close scanner"
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: "#E7EEFF",
              color: "#0051FE",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 10px",
            }}
          >
            <Camera size={26} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#080B0A" }}>
            Scan QR Code
          </h3>
          <p style={{ fontSize: 13, color: "#61666E", margin: "4px 0 0" }}>
            Select a simulated QR code to scan
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Object.entries(PRESET_INPUTS).map(([key, item]) => (
            <div
              key={key}
              onClick={() => {
                onScanned(item.value);
                onClose();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 10,
                background: "#F4F4F6",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 6,
                  background: "#FFFFFF",
                  border: "1px solid #E7E7E7",
                  display: "grid",
                  placeItems: "center",
                  color: "#0051FE",
                  flexShrink: 0,
                }}
              >
                <QrCode size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#080B0A" }}>
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#61666E",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
