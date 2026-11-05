// src/components/StatusBar.jsx
import { BatteryFull, Signal, Wifi } from "lucide-react";

export default function StatusBar({ dark = false }) {
  return (
    <div className={`wallet-status ${dark ? "status-dark" : ""}`} aria-hidden="true">
      <span>9:41</span>
      <div>
        <Signal size={18} strokeWidth={2} />
        <Wifi size={17} strokeWidth={2} />
        <BatteryFull size={27} strokeWidth={1.8} />
      </div>
    </div>
  );
}
