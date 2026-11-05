// src/utils/parser.js
// Recipient parsing logic matching project.md section 6.1 & design.md section 4.7

import { DEMO_OWN_ADDRESS } from "../config";

export function parseRecipient(rawInput, ownAddress = DEMO_OWN_ADDRESS) {
  if (!rawInput) {
    return { type: "empty", raw: "" };
  }

  let text = rawInput.trim();
  if (text.toLowerCase().startsWith("lightning:")) {
    text = text.slice(10).trim();
  }

  // 1. BIP21 / Unified QR
  if (text.toLowerCase().startsWith("bitcoin:")) {
    try {
      const uriBody = text.slice(8);
      const [addressPart, queryPart] = uriBody.split("?");
      const params = new URLSearchParams(queryPart || "");
      const lightningInvoice = params.get("lightning");
      const amountBtc = params.get("amount");
      const amountSats = amountBtc ? Math.round(parseFloat(amountBtc) * 1e8) : null;

      if (lightningInvoice) {
        return {
          type: "A2_UNIFIED",
          address: addressPart,
          lightningInvoice,
          amount: amountSats || 2000,
          fiat: "$2.00",
          speed: "Seconds",
          fee: 2,
          network: "lightning",
          canSwitchToOnchain: true,
          raw: text,
        };
      }

      // If only on-chain in BIP21
      return parseRecipient(addressPart, ownAddress);
    } catch {
      return { type: "A3_INVALID", raw: text };
    }
  }

  // 2. Lightning invoice
  const lower = text.toLowerCase();
  if (lower.startsWith("lntb") || lower.startsWith("lntbs") || lower.startsWith("lnbcrt")) {
    return {
      type: "A5_TESTNET",
      network: "lightning_testnet",
      raw: text,
      message: "This is a test network address. It can't receive real bitcoin.",
    };
  }

  if (lower.startsWith("lnbc")) {
    if (lower.includes("expired")) {
      return {
        type: "A4_EXPIRED",
        network: "lightning",
        raw: text,
        expiresIn: "00:00",
      };
    }

    // Valid BOLT11 invoice
    return {
      type: "A1_INVOICE",
      network: "lightning",
      amount: 500, // Design example: 500 sats ≈ $0.50
      fiat: "$0.50",
      fee: 1,
      expiresIn: "09:42",
      raw: text,
      chip: text.length > 20 ? `${text.slice(0, 10)}…${text.slice(-6)}` : text,
    };
  }

  // 3. Lightning address (e.g. alex@domain.com)
  const lnAddressRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  if (lnAddressRegex.test(text)) {
    return {
      type: "LIGHTNING_ADDRESS",
      network: "lightning",
      recipient: text,
      raw: text,
      chip: text,
    };
  }

  // 4. On-chain address checks
  // 4a. Own address check
  if (text === ownAddress) {
    return {
      type: "A6_OWN_ADDRESS",
      network: "bitcoin",
      address: text,
      raw: text,
      chip: `${text.slice(0, 8)}…${text.slice(-6)}`,
    };
  }

  // 4b. Testnet on-chain check (tb1, m, n, 2)
  if (
    lower.startsWith("tb1") ||
    lower.startsWith("m") ||
    lower.startsWith("n") ||
    lower.startsWith("2")
  ) {
    return {
      type: "A5_TESTNET",
      network: "bitcoin_testnet",
      raw: text,
      message: "This is a test network address. It can't receive real bitcoin, so sending to it would lose the funds.",
    };
  }

  // 4c. Mainnet on-chain (bc1..., 1..., 3...)
  if (
    lower.startsWith("bc1") ||
    lower.startsWith("1") ||
    lower.startsWith("3")
  ) {
    return {
      type: "ONCHAIN_ADDRESS",
      network: "bitcoin",
      address: text,
      raw: text,
      chip: text.length > 18 ? `${text.slice(0, 10)}…${text.slice(-5)}` : text,
    };
  }

  // 5. Unparseable
  return {
    type: "A3_INVALID",
    raw: text,
  };
}

export function truncateMiddle(str, startChars = 6, endChars = 6) {
  if (!str) return "";
  if (str.length <= startChars + endChars) return str;
  return `${str.slice(0, startChars)}…${str.slice(-endChars)}`;
}
