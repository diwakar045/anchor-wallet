// src/config.js
// Configuration, constants, and sample test data for Anchor wallet prototype

export const FIAT_RATE_PER_SAT = 0.0014; // $0.0014 / sat (matches 231 sats ≈ $0.34)

export const formatSats = (sats) => Number(sats || 0).toLocaleString("en-US");

export const satsToFiat = (sats) => {
  const usd = Number(sats || 0) * FIAT_RATE_PER_SAT;
  if (usd === 0) return "$0.00";
  if (usd < 0.01) return "<$0.01";
  return `$${usd.toFixed(2)}`;
};

export const DEMO_PIN = "123456";

export const ONCHAIN_MIN_SATS = 294; // B3 requirement
export const LARGE_PAYMENT_USD_THRESHOLD = 1000; // C2 requirement (~2,500,000 sats)

export const DEMO_OWN_ADDRESS = "bc1qown0demo0wallet0addressxxxxxxxxxxxxxx";

export const DEMO_RECENTS = [
  {
    id: "recent-1",
    label: "alex@domain.com",
    network: "lightning",
    type: "lightning_address",
  },
  {
    id: "recent-2",
    label: "sam@walletofsatoshi.com",
    network: "lightning",
    type: "lightning_address",
  },
  {
    id: "recent-3",
    label: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    network: "bitcoin",
    type: "onchain_address",
  },
];

export const INITIAL_TRANSACTIONS = [
  {
    id: "tx-1",
    address: "ln9087fgryu...iou",
    amount: 24,
    time: "2 hours ago",
    network: "lightning",
  },
  {
    id: "tx-2",
    address: "bc9087fgryu...iou",
    amount: 32,
    time: "2 hours ago",
    network: "bitcoin",
  },
];

export const ONCHAIN_FEE_TIERS = {
  slow: {
    id: "slow",
    name: "Slow",
    time: "About 60 min",
    fee: 140,
    fiat: "$0.14",
    recommended: false,
  },
  standard: {
    id: "standard",
    name: "Standard",
    time: "About 30 min",
    fee: 280,
    fiat: "$0.28",
    recommended: true,
  },
  fast: {
    id: "fast",
    name: "Fast",
    time: "About 10 min",
    fee: 560,
    fiat: "$0.56",
    recommended: false,
  },
};

export const SEED_PHRASE_WORDS = [
  "Orbit",
  "Flame",
  "Drift",
  "Bloom",
  "Spark",
  "Ridge",
  "Frost",
  "Coral",
  "Swift",
  "Haze",
  "Pulse",
  "Dawn",
];

export const PRESET_INPUTS = {
  normalOnchain: {
    label: "Normal On-Chain Address",
    value: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    desc: "Happy path on-chain transfer",
  },
  lightningAddress: {
    label: "Lightning Address",
    value: "alex@domain.com",
    desc: "Happy path Lightning address send",
  },
  lightningInvoiceA1: {
    label: "Valid Invoice with Amount (A1)",
    value: "lnbc5u1p3x0wlhpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdpk22ex2cqzpgxq97zvuq8vqqx4qz9s",
    amount: 500,
    desc: "Pre-set 500 sats amount, skips amount screen",
  },
  unifiedQrA2: {
    label: "Unified BIP21 QR (A2)",
    value: "bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh?amount=0.00002000&lightning=lnbc20u1p3x0wlhpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdpk22ex2cqzpgxq97zvuq8vqqx4qz9s",
    amount: 2000,
    desc: "Dual Lightning & On-chain, defaults Lightning",
  },
  invalidA3: {
    label: "Unparseable Text (A3)",
    value: "not_a_valid_bitcoin_or_lightning_string",
    desc: "Triggers red error & Anchor Understands help",
  },
  expiredA4: {
    label: "Expired Invoice (A4)",
    value: "lnbc100n1p_expired_invoice_sample_timestamp_past",
    desc: "Triggers expired warning & message sharing",
  },
  testnetA5: {
    label: "Testnet Address (A5)",
    value: "tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx",
    desc: "Triggers testnet warning to prevent fund loss",
  },
  ownAddressA6: {
    label: "User's Own Address (A6)",
    value: DEMO_OWN_ADDRESS,
    desc: "Triggers sending-to-yourself warning",
  },
};
