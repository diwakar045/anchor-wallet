# Anchor Wallet — project.md

Everything about the project: what it is, why, the scope of this task, the product logic, and how to build and verify the prototype. Read together with `design.md` (visual specs and screens).

---

## 1. What this is

**Anchor** is a self-custody Bitcoin wallet concept designed for first-time users. It supports **Lightning** and **on-chain** payments. The design work is part of a final-year Major Technical Project (MTP) in HCI at IIIT Gwalior, titled **"Trust Before the First Transaction: Making Bitcoin Wallets More Understandable for New Users."**

The research studied Wallet of Satoshi, BlueWallet and Phoenix (a UX audit, plus 1,875 Google Play reviews), and found three moments where new users lose trust. Those became the three design problems:

1. **Onboarding** (first launch)
2. **First receive**
3. **First send**

Designer: Diwakar (UX / product design, moving into product management). The Figma file is the design source of truth.

---

## 2. The task for this phase

Build an **interactive, clickable web prototype** of the final Figma design.

- It is **not** a real wallet. No real Bitcoin, no network, no backend.
- It runs in a browser at **mobile size (393 × 852)**. On desktop it sits centered in a phone-shaped frame; on a phone it fills the screen. It should feel like a Figma prototype, but with real behavior: typing, parsing, validation, timers.
- It must be **pixel-perfect**: each screen rendered at 393 × 852 matches the PNG export of its Figma frame.
- Font **DM Sans**. **Light mode only.** Dark-mode frames in older versions of the file are out of scope.
- Cover **all three flows** plus the **send edge cases**. Edge cases must appear **because of what the user does or types**, not from a hidden scenario picker. (A small, optional "demo hints" toggle that lists sample values to paste is welcome, off by default.)

Deliverable: a hosted or locally runnable web page plus its source, with a short README. Keep it simple (a single-page app, no backend).

---

## 3. Inputs you have

- `design.md`: tokens, components, every screen with copy, frame IDs, open questions.
- The Figma file `RSWqmV8EZpfINsEZFKCxFy`, page **Final flow** (`231:2182`). Sections: **Onboarding** `231:15001`, **Recieve** `231:14384` (sic), **Send** `231:2184`, **Send - Edge cases** `231:4619`.
- Exports of every frame (SVG for building, PNG @2x for pixel comparison), expected in `figma-export/` (see section 8). The Figma MCP on the free Starter plan hits a tool-call limit, so prefer exports over live calls.
- This document for behavior.

If something is not in the exports or `design.md`, **do not invent it**. Ask, or mark it clearly as an assumption.

---

## 4. Product principles (these drove the design; keep them in the logic)

The three insight sets from the research:

**Onboarding**
- Explain the custody model before asking the user to choose or accept it.
- Introduce concepts progressively. Sequencing matters more than coverage.
- Introduce the seed phrase when its stakes feel real, not as a final setup step.
- Set light expectations about fees and payment types (Lightning vs on-chain) early.
- Calm, guided, illustrated tone builds trust as much as the information.

**First receive**
- First-time users need guidance at the payment-method decision point.
- Keep the receive experience simple and low in cognitive load.
- Give clear feedback during the waiting period.
- Contextual onboarding improves confidence during the first receive.

**First send**
- The wallet interprets what the user pastes (the system tells address from invoice, not the user).
- Fees are part of the decision: show them before confirmation, with context.
- Warnings are proportional to the stakes and tied to a specific risk.
- Feedback after sending is part of the send flow: the user sees what happened next.

Design consequence for the prototype: **in Send, the user never picks Lightning or on-chain.** The input decides the method. In Receive, the user does choose.

---

## 5. Flows

```
App open → Splash → Welcome → Your Keys, Your Coins → Two Ways to Pay
        → Backup your recovery phrase → Seed phrase (dialog) → Verify phrase
        → Verifying → Verified (or Verification failed → Review phrase → back to Seed phrase)
        → Name your wallet → Home (0 sats, no transactions)

Home → Receive (first time: guiding overlay → choose mode) → Receive Lightning / On-chain → Share → saved request in Transactions
Home → Send (first time: guide sheet steps 1–2) → Send screen → Amount → Review → (checks) → PIN → Sending → Home with new balance
```

Skip on Your Keys / Two Ways to Pay jumps to "Backup your recovery phrase". The close (X) on Backup and Name wallet screens should confirm before leaving (use the Figma frames if present; otherwise return to the previous screen).

For demo purposes, the prototype can offer two entry points: start from Splash (new user, 0 sats), or start from Home with the funded wallet (Savings21, 231 sats, existing transactions), because the Send flow in Figma starts from a funded wallet.

---

## 6. Send logic (this is where the edge cases live)

### 6.1 Recipient parser
Run on every change of the To field (typing, paste, scan). Trim whitespace. Strip a leading `lightning:`. Order matters:

1. **BIP21 / unified**: starts with `bitcoin:`. Parse address plus `?amount=` and `lightning=`. If a valid `lightning=` invoice is present → **A2 Unified QR** (Lightning chosen, option "Pay on-chain instead"). If only an on-chain address → treat as on-chain with a fixed amount.
2. **Lightning invoice**: `^ln(bc|tb|tbs|bcrt)1…` (bech32 chars, long).
   - Testnet prefix (`lntb`, `lntbs`, `lnbcrt`) → **A5 test network**.
   - Decode amount (HRP multiplier: `m`, `u`, `n`, `p`) and expiry (timestamp + expiry tag, default 3600 s). Use a BOLT11 decoding library (for example `bolt11` or `light-bolt11-decoder`).
   - Expired → **A4**. Valid → **A1** (amount locked to the invoice, skip the amount screen and go to Review). An invoice without an amount behaves like a normal send.
3. **Lightning address**: `^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$` → Lightning, amount entered by the user.
4. **On-chain address**:
   - Mainnet: `bc1q…` (42 chars), `bc1p…` (62), legacy `1…` / `3…` (26–35 base58).
   - Testnet: `tb1…`, `m…`, `n…`, `2…` → **A5**.
   - If the address is one of the user's own addresses (demo list below) → **A6**.
   - Format check only (a bech32 checksum is optional; the design's sample addresses are not checksum-valid and must still work).
5. Anything else → **A3 could not read**.

Demo list of "own" addresses: `bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh` is **not** own (it's the send example); define a separate demo own address (for example `bc1qown0demo0wallet0addressxxxxxxxxxxxxxx`) and show it in the receive screen so users can copy it and paste it into Send.

Demo recent recipients, in the order shown by the design: `alex@domain.com` (Lightning), `sam@walletofsatoshi.com` (Lightning), `bc1qxy2k…x0wlh` (on-chain). Tapping one fills the To field and resolves like a paste.

### 6.2 First-time recipient
Track recipients paid so far (in memory). A recipient not in that list triggers **C1** after the user taps Send on Review. Recents shown in the list do count as known.

### 6.3 Amount rules (Amount screen)
Validate on every keypress.

| Condition | Result |
|---|---|
| amount = 0 | Continue disabled, no error |
| amount > balance | **B1**: red amount, "Short by {amount − balance} sats", chip "You have {balance} sats · Send max" |
| amount ≤ balance but amount + fee > balance | **B2**: "Not enough left for the fee", chip "Send max · {balance − fee} sats, fee included" |
| on-chain and amount < minimum | **B3**: "Too small to send on-chain", help text with the minimum. Minimum 294 sats |
| otherwise | Continue enabled → Review |

"Send max" sets the amount to balance − fee.

### 6.4 Fee model (demo, assumptions to confirm)
- **Lightning:** 1 sat if amount ≤ 100, else 2 sats. Label "Low".
- **On-chain:** the design's happy path shows 1 sat for 12 sats (matches the Review frame). For larger amounts use tiers: Slow 140, **Standard 280**, Fast 560 sats. Fee label: "Low" if fee < 1% of amount, "Normal" for 1–5%, **"High"** if ≥ 5% (B6 example: 280 on 1,000 = 28% → High).
- Fiat conversion: use one fixed demo rate, **$0.0014 per sat** if you want to match "231 sats ≈ $0.34" and "13 sats ≈ $0.01". (The 12-sat Amount frame shows $0.001, so confirm rounding with the exports.)

### 6.5 Review screen
Built from section 4.4 of `design.md`. Behavior:
- **To** row: on-chain shows the address with first and last 6 characters bold and a "View full address" toggle that expands the full address. Lightning invoice shows the truncated invoice with its expiry countdown.
- **Change speed** (on-chain only) opens **B4**. Choosing a tier updates fee, total and time live.
- **B5 Fee changed:** a demo trigger for "fees changed while reviewing" (for example, after about 20 seconds on an on-chain Review, or when a tester taps the fee row after selecting Standard twice). Pick one trigger and document it. Shows the sheet with old vs new fee.
- **High fee warning (B6):** show the amber note when the fee is ≥ 5% of the amount.
- **Large payment (C2):** when the amount is ≥ **$1,000 equivalent** (design example is 2,500,000 sats ≈ $2,500; set the threshold in config). Amber note, two checkboxes, Send disabled until both are ticked.
- **Send is hold-to-confirm:** about 1 s hold fills the button. Early release cancels.
- After confirm → C1 if first-time recipient → PIN (C3) → Sending.

### 6.6 PIN (C3)
Six-digit PIN, demo PIN `123456`. Wrong PIN: dots turn red, "That PIN didn't match. {n} tries left." Three tries, then a short lock (for example 30 s) or return to Review. "Use Face ID instead" immediately succeeds (simulated).

### 6.7 Sending and after
The frames for the Sending status screen and the transaction detail view must come from the final Figma export. If no such frames exist, treat this as **an open question**; do not invent the screens. Minimum behavior: on success return to Home with the balance reduced by amount + fee (231 → 218 for the 12-sat example, where 12 + 1 = 13) and a new transaction at the top of the list: "Sent to {recipient}", "just now", "−{amount} sats", "from Savings21".
Lightning: instant. On-chain: show Pending (waiting for confirmation) and flip to Confirmed after a demo delay.

### 6.8 Demo-friendly config
One `config.js`: balance, rate, fee tiers, on-chain minimum, large-payment threshold, demo PIN, timer speeds, the own-address list, the recents. The design needs a large balance to reach B4–B6 and C2. Add an optional **"large balance" toggle** in the hidden demo menu that sets the balance to, say, 5,000,000 sats, and keep the default at 231 sats.

---

## 7. Receive logic [from the designer's notes, confirm against the frames]

- Zero receive transactions → guiding overlay (beginner text, choose Lightning or On-chain, one-line description each).
- Two modes with a switch. Each shows: a short explanation, a QR code, the address or invoice with a copy action, manual **amount** input, and Share.
  - **Lightning:** valid-until info, **reusable vs single-use** toggle, manual **expiration** input.
  - **On-chain:** fee information.
- Sharing saves the **request** into Transactions. Selecting it shows its status.
- Lightning requests expire at their expiry date. The wallet notifies on state changes: waiting → detected → confirmed (on-chain also shows "unconfirmed" before confirmations).
- QR codes: use the images from the Figma export, or generate real QR codes for the demo values so the Send screen's "Scan QR" can read them if camera support is added. Camera scanning itself can be a simulated screen.

---

## 8. Build instructions

**Stack:** any lightweight single-page app (plain HTML/CSS/JS, or React with Vite). No backend. DM Sans from Google Fonts (400, 500, 600).

**Approach for pixel-perfect:**
1. Put exports in `figma-export/`:
   ```
   figma-export/
     svg/onboarding|receive|send|edge-cases/<frame name>.svg
     png@2x/onboarding|receive|send|edge-cases/<frame name>.png
   ```
2. Build every screen at exactly **393 × 852** with absolute positioning taken from the exported SVG geometry (x, y, width, height, radius, colors, text size and weight). Prefer reading values from the SVG over measuring by eye.
3. Reuse real SVG icons and images from the export. Do not redraw icons.
4. Make the dynamic parts live elements placed at the exact positions of the static text: typed address, amount, fiat value, keypad press states, countdown, selected words, PIN dots, balance.
5. Navigation: a small router or state machine; every tap target equals its Figma element bounds.

**Verification (required):**
- For every screen, render in headless Chromium at 393 × 852 and DPR 2, then compare with the matching `png@2x` using a pixel diff (for example `pixelmatch`). Target: **under 0.5% differing pixels** per screen, with text anti-aliasing differences excepted. Fix every larger diff.
- Keep a `diff-report` (screen name, diff %). Include it in the final hand-off.
- Click-through test of: the full onboarding path including a failed verification; receive in both modes; send for each edge case in `design.md` section 4.7, triggered **by input**.

**Phone-frame wrapper:** on screens wider than 480 px show the 393 × 852 app centered on a neutral background with a rounded device bezel; on phones, scale the app to the viewport width. Disable page zoom and text-size inflation so layout cannot shift.

---

## 9. Acceptance checklist

- [ ] All frames in Onboarding, Receive, Send and Send - Edge cases are reachable.
- [ ] Every edge case triggers from real input (paste, typing, amount, tapping), not a scenario switch.
- [ ] DM Sans everywhere; no dark mode.
- [ ] Each screen is within the pixel-diff target; diff report included.
- [ ] Send never asks the user to choose Lightning vs on-chain; the network appears as a read-only label.
- [ ] Irreversibility is stated once, at Review ("Sent bitcoin can't be reversed").
- [ ] Hold-to-send works and cancels on early release.
- [ ] No real keys, no real network calls. A short on-screen or README note says it is a design prototype.

---

## 10. Open questions for the designer (Diwakar)

1. Balance vs example amounts (231 sats on Home, 20,000 and 2,500,000 in edge cases). Use the large-balance demo toggle?
2. B3 (on-chain minimum 294 sats) conflicts with the 12-sat on-chain review. Which one stands?
3. Where is the **Sending / Sent / Confirmed** status screen and the **transaction detail** screen? They aren't in the frames listed in `design.md`.
4. Which duplicate frames are final (two "copy" frames, three C3 frames)?
5. Should typos in the design ("recieve", "Lets") stay in the prototype?
6. For B5 (fee changed), which trigger should the prototype use?
7. Are the Receive screens final, and do they include a share sheet and a request-detail screen?
