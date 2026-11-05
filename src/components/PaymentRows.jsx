// src/components/PaymentRows.jsx
// Implementation of WaitingPaymentRow and ReceivedPaymentRow matching Figma Frame 87 & TransactionListItem

import { ArrowDownLeft, Clock, Zap, Link as LinkIcon } from "lucide-react";
import { formatSats } from "../config";

/**
 * WaitingPaymentRow:
 * Displays an incoming / waiting invoice in the transaction list.
 * Props:
 * - amount: number (e.g. 12)
 * - time: string (e.g. "1 minute ago" or "Just now")
 * - expiresAt: string (e.g. "2:51 PM")
 * - network: "lightning" | "bitcoin"
 */
export function WaitingPaymentRow({
  amount = 12,
  time = "1 minute ago",
  expiresAt = "2:51 PM",
  network = "lightning",
  onClick,
}) {
  const NetworkIcon = network === "lightning" ? Zap : LinkIcon;

  return (
    <article
      className="wallet-transaction"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
      aria-label={`Waiting for payment ${amount} sats, expires at ${expiresAt}`}
    >
      {/* Icon: Yellow soft tile with clock, exact 40x40 matching other list items */}
      <div
        className="wallet-transaction-icon"
        style={{
          background: "#FEF7D6",
          color: "#E5A000",
        }}
        aria-hidden="true"
      >
        <Clock size={22} strokeWidth={2.2} />
      </div>

      <div className="wallet-transaction-body">
        {/* Align with other transaction items; waiting state uses main row directly */}
        <div className="wallet-transaction-main" style={{ marginTop: 2 }}>
          <div className="wallet-recipient">
            <NetworkIcon size={16} strokeWidth={1.5} aria-hidden="true" />
            <span>Waiting for payment</span>
          </div>

          <div className="wallet-transaction-amount">
            <strong>{amount ? formatSats(amount) : "12"}</strong>
            <span>sats</span>
          </div>
        </div>

        <div className="wallet-transaction-meta">
          <span>{time}</span>
          <span>Expires at: {expiresAt}</span>
        </div>
      </div>
    </article>
  );
}

/**
 * ReceivedPaymentRow:
 * Displays a completed / received payment in the transaction list.
 * Props:
 * - invoice: string (e.g. "Invoice321")
 * - amount: number (e.g. 12)
 * - time: string (e.g. "Just now")
 * - account: string (e.g. "Savings21")
 * - network: "lightning" | "bitcoin"
 */
export function ReceivedPaymentRow({
  invoice = "Invoice321",
  amount = 12,
  time = "Just now",
  account = "Savings21",
  network = "lightning",
  onClick,
}) {
  const NetworkIcon = network === "lightning" ? Zap : LinkIcon;

  return (
    <article
      className="wallet-transaction"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
      aria-label={`Received ${amount} sats for ${invoice}`}
    >
      {/* Icon: Soft green tile with green downward-left incoming arrow, exact 40x40 */}
      <div
        className="wallet-transaction-icon"
        style={{
          background: "#DDF8E9",
          color: "#12B76A",
        }}
        aria-hidden="true"
      >
        <ArrowDownLeft size={22} strokeWidth={2.4} />
      </div>

      <div className="wallet-transaction-body">
        <div className="wallet-transaction-label">
          Received
        </div>

        <div className="wallet-transaction-main">
          <div className="wallet-recipient">
            <NetworkIcon size={16} strokeWidth={1.5} aria-hidden="true" />
            <span title={invoice}>{invoice}</span>
          </div>

          <div className="wallet-transaction-amount">
            <strong>{amount ? formatSats(amount) : "12"}</strong>
            <span>sats</span>
          </div>
        </div>

        <div className="wallet-transaction-meta">
          <span>{time}</span>
          <span>to {account}</span>
        </div>
      </div>
    </article>
  );
}
