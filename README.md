# Anchor Wallet — Interactive Prototype

Anchor is a self-custody Bitcoin wallet concept tailored for first-time users, addressing 3 key friction moments identified in UX research: **Onboarding**, **First Receive**, and **First Send**.

Built with React + Vite, DM Sans typography, exact Figma visual tokens, and running inside a responsive 393 × 852 phone frame preview.

---

## Getting Started

The development preview server is currently running:

- **Local Preview:** [http://localhost:5173/](http://localhost:5173/)

To run or build manually:
```bash
# Start development server
npm run dev

# Production build
npm run build
```

---

## Architecture & Reusable Components

All components are modular and organized under `src/components/`:

- `StatusBar.jsx` — Universal mobile status bar (time 9:41, signal, wifi, battery).
- `ScreenHeader.jsx` — Screen header with back arrow, close button, title and account label.
- `PrimaryButton.jsx` — 361 × 56 pill button (`#0051FE`, disabled state, secondary outline variant, and 1-second **hold-to-confirm** with smooth progress fill).
- `Keypad.jsx` — 12-key keypad (`118 × 72` keys, radius 12, 24 SemiBold digits, with optional blank dot for PIN mode).
- `NoteBox.jsx` — Contextual alert boxes for info, warning, and error states with 20px icons.
- `DetailsCard.jsx` — Inset review rows with gray labels, right-aligned values, subvalues, and dashed divider before total.
- `Pill.jsx` — Fee pills (Low, Normal, High) and Network pills (Lightning bolt, On-chain link).
- `BottomSheet.jsx` — Modal bottom sheet with 50% scrim, 24px top radius, 40 × 4 grabber, and smooth slide-up animation.
- `ModalDialog.jsx` — Centered modal dialog with dimmed overlay for onboarding seed phrase & verification.
- `ToField.jsx` — Interactive input field with paste button, typing clear button (X), resolved chip state, and error/warning borders.
- `ScanQrModal.jsx` — Simulated QR scanner modal with sample QR code presets.
- `DemoControlPanel.jsx` — Floating toolbar outside the phone frame to switch entry points, toggle 5M sat balance for edge cases, and quick-fill test inputs.

---

## Flows Covered

### 1. Onboarding Flow (`src/screens/onboarding/`)
- **Splash Screen**: Auto-advances after 1.5 seconds.
- **Welcome**: "With Anchor, smoothly send, recieve and manage cryptocurrencies."
- **Your Keys, Your Coins**: Progress indicator 1/2, self-custody education.
- **Two Ways to Pay**: Progress indicator 2/2, Lightning vs on-chain concept.
- **Backup your recovery phrase**: 4 security rules before revealing seed.
- **Seed phrase dialog**: 12 words in 2 columns (`Orbit, Flame, Drift, Bloom, Spark, Ridge, Frost, Coral, Swift, Haze, Pulse, Dawn`).
- **Verify phrase dialog**: Interactive shuffled grid. Tapping words assigns order; checks correctness.
- **Verifying phrase**: Animated spinner (1.5s).
- **Verified / Failed**: Green checkmark auto-advance on success; mismatch warning with "Review phrase" button on failure.
- **Name your wallet**: "Savings21" input (disabled when empty).
- **Home (New Wallet)**: 0 sats balance and empty state placeholder.

### 2. First Send & Edge Cases (`src/screens/send/`)
- **First-time Guide Sheet**: Step 1 (Add Recipient, Enter Amount, Review and Send) + Step 2 (Scan QR vs Type/Paste).
- **Intelligent Recipient Parser**:
  - `A1`: Valid Lightning invoice with amount detected (locks amount, skips amount screen directly to Review).
  - `A2`: Unified BIP21 QR (defaults Lightning, option to switch to on-chain).
  - `A3`: Unparseable input (red error box with "Anchor understands" helper rows).
  - `A4`: Expired invoice (amber warning with shareable request message).
  - `A5`: Test network address (`tb1...`, `lntb...`, prevents fund loss).
  - `A6`: Own wallet address (sending to yourself warning).
  - Normal on-chain (`bc1...`) / Lightning address (`user@domain.com`) -> matching address row.
- **Amount Screen**:
  - Keypad entry, live sats formatting, fiat conversion (`$0.0014 / sat`), sats/fiat swap toggle.
  - `B1`: Amount > balance (red hero, "Short by X sats", "Send max" chip).
  - `B2`: Amount + fee > balance ("Not enough left for the fee", "Send max" chip).
  - `B3`: On-chain below 294 sats ("Too small to send on-chain", minimum 294 sats warning).
- **Review Screen**:
  - Full details card with recipient truncation, "View full address" toggle, network badge, and fee context.
  - `B4`: "Change speed" bottom sheet (Slow 140 sats, Standard 280 sats, Fast 560 sats).
  - `B5`: Network fee changed simulation sheet.
  - `B6`: High fee warning when fee ≥ 5% of amount.
  - `C1`: First-time recipient verification sheet (prompts to compare start and end).
  - `C2`: Large payment warning (≥ $1,000 / 2.5M sats with dual mandatory checkboxes).
  - **Hold-to-confirm button**: 1-second press-and-hold with visual progress fill. Early release cancels.
- **PIN Screen (C3)**:
  - 6-digit PIN pad (`123456`), dots turn red on error with attempts countdown, and "Use Face ID instead" shortcut.
- **Sending Status**:
  - Settle animation (Sending -> Sent), then updates balance to **218 sats** and prepends transaction to history.

### 3. Receive Flow (`src/screens/receive/`)
- **First-Time Receive Guiding Overlay**: Explains Lightning vs On-chain before first payment.
- **Lightning Mode**: QR code, invoice/address string with copy button, valid-until time, reusable vs single-use toggle, optional amount input.
- **On-chain Mode**: QR code for on-chain address, copy button, sender fee information, optional amount input.
- **Share**: Adds a pending receive request directly into the transaction list.
