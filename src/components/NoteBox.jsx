// src/components/NoteBox.jsx
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

export default function NoteBox({
  type = "info", // "info" | "warning" | "error"
  title,
  children,
  icon,
  className = "",
}) {
  const defaultIcon =
    type === "error" ? (
      <AlertCircle size={20} />
    ) : type === "warning" ? (
      <AlertTriangle size={20} />
    ) : (
      <Info size={20} />
    );

  return (
    <div className={`note-box ${type} ${className}`} role="alert">
      <div className="note-box-icon">{icon || defaultIcon}</div>
      <div className="note-box-content">
        {title && <div className="note-box-title">{title}</div>}
        <div className="note-box-body">{children}</div>
      </div>
    </div>
  );
}
