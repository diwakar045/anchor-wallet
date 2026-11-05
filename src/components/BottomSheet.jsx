// src/components/BottomSheet.jsx
import HomeIndicator from "./HomeIndicator";

export default function BottomSheet({
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
      className="sheet-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className={`bottom-sheet ${className}`}>
        <div className="sheet-grabber" />
        {title && <h2 className="sheet-title">{title}</h2>}
        {subtitle && <p className="sheet-subtitle">{subtitle}</p>}
        {children}
        <HomeIndicator />
      </div>
    </div>
  );
}
