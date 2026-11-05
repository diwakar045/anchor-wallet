// src/components/Pill.jsx
import { Link as LinkIcon, Zap } from "lucide-react";

export default function Pill({
  type = "network", // "network" | "fee-low" | "fee-normal" | "fee-high"
  network = "lightning", // "lightning" | "bitcoin"
  label,
  children,
  className = "",
}) {
  if (type === "network") {
    const isLightning = network === "lightning";
    const Icon = isLightning ? Zap : LinkIcon;
    const defaultLabel = isLightning ? "Lightning" : "On-chain";

    return (
      <span className={`pill network-pill ${className}`}>
        <Icon size={12} strokeWidth={2} />
        {label || defaultLabel}
      </span>
    );
  }

  return (
    <span className={`pill ${type} ${className}`}>
      {children || label}
    </span>
  );
}
