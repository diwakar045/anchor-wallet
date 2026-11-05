// src/screens/HomeScreen.jsx
import { ArrowDown, ArrowUp, ArrowUpRight, ChevronDown, Link as LinkIcon, Plus, Settings, Zap } from "lucide-react";
import HomeIndicator from "../components/HomeIndicator";
import { ReceivedPaymentRow, WaitingPaymentRow } from "../components/PaymentRows";
import StatusBar from "../components/StatusBar";
import { formatSats } from "../config";

export function HomeHeader({
  account = "Savings21",
  balance = 567,
  fiat = "$0.79",
  onAccountClick,
  onAdd,
  onSettings,
}) {
  return (
    <header className="wallet-header">
      <div className="wallet-toolbar">
        <button
          type="button"
          className="wallet-account"
          onClick={onAccountClick}
          aria-label={`Choose account, current account ${account}`}
        >
          {account}
          <ChevronDown size={16} />
        </button>

        <div className="wallet-toolbar-actions">
          <button
            type="button"
            className="wallet-icon-button"
            aria-label="Add account"
            onClick={onAdd}
          >
            <Plus size={18} />
          </button>

          <button
            type="button"
            className="wallet-icon-button"
            aria-label="Settings"
            onClick={onSettings}
          >
            <Settings size={17} />
          </button>
        </div>
      </div>

      <section className="wallet-balance" aria-label="Account balance">
        <span className="wallet-balance-label">Balance</span>

        <div className="wallet-balance-values">
          <div>
            <strong>{formatSats(balance)}</strong>
            <span className="wallet-balance-unit">sats</span>
          </div>
          <span className="wallet-fiat">{fiat}</span>
        </div>

        {/* Bitcoin Watermark */}
        <span className="wallet-bitcoin" aria-hidden="true">
          ₿
        </span>
      </section>
    </header>
  );
}

export function TransactionListItem({
  address = "ln9087fgryu...iou",
  amount = 24,
  time = "2 hours ago",
  account = "Savings21",
  network = "lightning",
  isRequest = false,
}) {
  const NetworkIcon = network === "lightning" ? Zap : LinkIcon;

  return (
    <article
      className="wallet-transaction"
      aria-label={`${isRequest ? "Requested" : "Sent"} ${amount} sats ${isRequest ? "from" : "to"} ${address}`}
    >
      <div className="wallet-transaction-icon" aria-hidden="true">
        <ArrowUpRight
          size={25}
          strokeWidth={1.4}
          style={{ transform: isRequest ? "rotate(180deg)" : "none" }}
        />
      </div>

      <div className="wallet-transaction-body">
        <div className="wallet-transaction-label">
          {isRequest ? "Receive request" : "Sent to"}
        </div>

        <div className="wallet-transaction-main">
          <div className="wallet-recipient">
            <NetworkIcon size={16} strokeWidth={1.5} aria-hidden="true" />
            <span title={address}>{address}</span>
          </div>

          <div className="wallet-transaction-amount">
            <strong>{amount ? formatSats(amount) : "Any"}</strong>
            <span>sats</span>
          </div>
        </div>

        <div className="wallet-transaction-meta">
          <span>{time}</span>
          <span>from {account}</span>
        </div>
      </div>
    </article>
  );
}

export function NavBar({ onSend, onReceive, onHelp }) {
  return (
    <nav className="wallet-nav" aria-label="Wallet actions">
      <div className="wallet-nav-primary">
        <button type="button" onClick={onSend}>
          <ArrowUp size={24} strokeWidth={1.6} />
          Send
        </button>

        <span className="wallet-nav-divider" aria-hidden="true" />

        <button type="button" onClick={onReceive}>
          <ArrowDown size={24} strokeWidth={1.6} />
          Receive
        </button>
      </div>

      <button
        type="button"
        className="wallet-help"
        onClick={onHelp}
        aria-label="Help"
      >
        ?
      </button>
    </nav>
  );
}

export default function HomeScreen({
  wallet,
  onAccountClick,
  onAdd,
  onSettings,
  onViewAll,
  onSend,
  onReceive,
  onHelp,
}) {
  const { account, balance, fiat, transactions = [] } = wallet;

  return (
    <div className="wallet-screen">
      <StatusBar />

      <main className="wallet-content">
        <HomeHeader
          account={account}
          balance={balance}
          fiat={fiat}
          onAccountClick={onAccountClick}
          onAdd={onAdd}
          onSettings={onSettings}
        />

        <section className="wallet-transactions">
          <div className="wallet-section-heading">
            <h2>Transactions</h2>
            <button type="button" onClick={onViewAll}>
              View all
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="wallet-empty-transactions">
              <div style={{ fontSize: 16, fontWeight: 600, color: "#080B0A" }}>
                No transactions yet
              </div>
              <p>Receive your first bitcoin or test sending funds.</p>
            </div>
          ) : (
            <div className="wallet-transaction-list">
              {transactions.map((tx) => {
                if (tx.status === "waiting") {
                  return (
                    <WaitingPaymentRow
                      key={tx.id}
                      amount={tx.amount || 12}
                      time={tx.time || "1 minute ago"}
                      expiresAt={tx.expiresAt || tx.expirationTime || "2:51 PM"}
                      network={tx.network || "lightning"}
                    />
                  );
                }

                if (tx.status === "received" || tx.type === "received") {
                  return (
                    <ReceivedPaymentRow
                      key={tx.id}
                      invoice={tx.invoice || "Invoice321"}
                      amount={tx.amount || 12}
                      time={tx.time || "Just now"}
                      account={account}
                      network={tx.network || "lightning"}
                    />
                  );
                }

                return (
                  <TransactionListItem
                    key={tx.id}
                    account={account}
                    {...tx}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="wallet-footer">
        <NavBar onSend={onSend} onReceive={onReceive} onHelp={onHelp} />
        <HomeIndicator />
      </footer>
    </div>
  );
}
