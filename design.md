# Anchor Wallet — design.md

Design spec and description for the Anchor prototype. Read together with `project.md` (goals, scope, logic, build instructions).

Figma file: `RSWqmV8EZpfINsEZFKCxFy` ("Major Project"), page **Final flow** (node `231:2182`).
Frame size everywhere: **393 × 852** (iPhone 16). Light mode only. Font: **DM Sans**.

---

## 0. Source of truth and confidence

The Figma file is the source of truth. This document was written without a complete read of the file (the Figma MCP tool limit was reached), so every value carries a tag:

- **[M]** measured directly from Figma during this project.
- **[A]** approximate, read from screenshots. Verify against the exported SVG/PNG before relying on it.
- **[N]** not inspected. Described from the user's flow notes only.

Rule for the builder: when this file and the exported frames disagree, the exported frames win. Pixel-perfect means the prototype, rendered at 393 × 852, matches the PNG export of each frame.

---

## 1. Foundations

### 1.1 Typeface
DM Sans (Google Fonts), weights **400 Regular, 500 Medium, 600 SemiBold**. No other family. (Figma shows "DM Sans" style names Regular / Medium / SemiBold.)

### 1.2 Type scale (as used) [M]
| Use | Size | Weight |
|---|---|---|
| Amount hero (amount screen) | 108 | SemiBold |
| Amount hero (review screen) | 56 (edge-case review variants: 44) | Medium |
| "sats" unit next to hero | 20 | Regular |
| Fiat under hero | 20 | SemiBold, gray `#81848B` |
| Screen header title | 18 | SemiBold |
| Section label ("Recent", "Transactions") | 18 | SemiBold |
| "To:" label, buttons | 18 | Medium / SemiBold |
| List and row primary text | 16 | Medium |
| Row secondary text | 14 | Regular |
| Captions, hints | 12–13 | Regular |
| Keypad digits | 24 | SemiBold |
| Total on review | 20 | SemiBold, blue |

### 1.3 Colors [M unless noted]
| Token | Hex | Use |
|---|---|---|
| blue (primary) | `#0051FE` | buttons, amounts, links, active states |
| ink | `#080B0A` | text, icons |
| gray | `#989CA3` | secondary text, wallet name in header, placeholders |
| gray-2 | `#61666E` | labels, helper text |
| fiat gray | `#81848B` | fiat amount on amount screen |
| field / card | `#F4F4F6` | cards, input fill [A for the original input fill] |
| key | `#EEF0F4` | keypad keys, icon tiles |
| rule | `#E7E7E7` | dividers |
| chip | `#E4E4E7` | recipient chip |
| blue-soft | `#E7EEFF` | info notes, selected option |
| blue-line | `#C2D6FF` | info note border, clear (X) button fill |
| disabled blue | `#A6C1FE` | disabled primary button |
| red / soft / line | `#D62839` / `#FEEFF0` / `#F6C6CB` | errors |
| amber / soft / line | `#B7791F` / `#FFF6E0` / `#F0DCA0` | warnings |
| green / soft / line | `#19A86B` / `#E6F7EE` / `#BEE6D0` | success, "Low" fee |
| white | `#FFFFFF` | screen background |

Balance card on home: blue gradient with a faint bitcoin watermark [A]. Read the gradient stops from the export.

### 1.4 Shape and spacing [M]
- Screen side padding: **16**.
- Primary button: 361 × 56, **radius 33**, centered, 16 from each side.
- Inputs: radius 8, 1px stroke.
- Cards: radius 16. Notes and option rows: radius 12. Keypad keys: radius 12. Pills and chips: radius 100 (fully rounded).
- Bottom sheet: top radius 24.

### 1.5 Icons
Simple outline icons, 2px stroke, round caps: back arrow, bolt (Lightning), link (on-chain), QR-scan, at-sign, X, check, alert-triangle, info, clock, chevron, swap arrows. Export the originals as SVG from Figma; do not redraw.

---

## 2. Layout system [M]

| Element | Spec |
|---|---|
| Status bar | Library component `StatusBar`, 393 × 47, "9:41", signal, wifi, battery. Dynamic Island hidden. |
| Header row | y = 60, height 40. Back arrow 24 × 24 at x = 16, title starts at x = 52. |
| Title format | `Send Bitcoin - Savings21`, where `Savings21` is gray `#989CA3`. |
| Content area | between header and bottom bar |
| Bottom bar | y = 754, height 98, holds the primary button (y = 754, 56 high), then home indicator |
| Home indicator | Library component `HomeIndicator`, 393 × 34 at y = 818. Black bar 134 × 5, radius 3. |

---

## 3. Components

### 3.1 Primary button
361 × 56, radius 33, fill blue, label 18 SemiBold white. Disabled: fill `#A6C1FE`. Secondary: white fill, 1px blue stroke, blue label. Text button: no fill, 16 SemiBold blue, 40 high.

### 3.2 "To" field [M]
x16 y124, 361 × 57, radius 8, 1px stroke, fill light gray. Left: "To:" (18 Medium) then content.
- Empty: placeholder `bc1...xx or name@domain` (gray) and a **Paste** button (light blue tile, "Paste" 18 Medium blue) on the right.
- Typing: raw text, truncated with an ellipsis, **X** clear button (32 × 32, radius 8, fill `#C2D6FF`, blue X) on the right.
- Resolved: recipient as a **chip** (fill `#E4E4E7`, radius 27, text 16 Medium), e.g. `bc1qxy2kgd…x0wlh`.
- Error state: red border `#D62839`, fill `#FEEFF0`. Warning state: amber border, fill `#FFF6E0`.

### 3.3 Scan row [M]
40 × 40 icon tile (`#EEF0F4`, QR-scan icon) then "Scan QR code" (16 Medium) and "Tap to scan an address" (14 Regular gray).

### 3.4 Recent list [M]
Heading "Recent" (18 SemiBold) and "View all" (14 Medium, right). Rows: 32 × 32 icon tile (bolt = Lightning, link = on-chain), value in 16 Medium, 1px divider `#E7E7E7` starting after the icon. Empty state: "Recipients you've paid will show up here."

### 3.5 Keypad [M]
Block at y = 426, 300 high. Four rows (y = 0, 76, 152, 228), three keys per row, each key **118 × 72**, radius 12, at x = 16, 138, 259. Digits 24 SemiBold. Bottom row: `.`, `0`, backspace (`<`) on the amount screens. The PIN screen (C3) uses the same keypad with the dot key blank. Follow the Figma frame for each screen.

### 3.6 Amount block [M]
Centered. Hero number 108 SemiBold blue; "sats" 20 Regular baseline-aligned to its right; below, fiat (20 SemiBold gray) and a swap icon (16, stroke `#61666E`) to toggle sats and fiat.

### 3.7 Note (info, warning, error) [M, edge-case frames]
Radius 12, padding 14 horizontal and 12–14 vertical, 1px border, icon 20 on the left, title 14–15 SemiBold ink, body 13–14 Regular `#4D4D52`. Color set picked from section 1.3.

### 3.8 Details card [M, edge-case and review frames]
Radius 16, fill `#F4F4F6`. Rows: padding 16 horizontal, 9–12 vertical, label (14 Regular gray-2, optional 12 sublabel in gray) on the left, value (15 Medium, right-aligned, optional 12 sub-value) on the right. 1px `#E7E7E7` dividers inset 16. A **dashed** divider sits above Total on the review screens.

### 3.14 Pills [M]
Radius 100, padding 10 × 4, 12–13 SemiBold. Fee pills: Low (green), Normal (gray), High (amber). Network pill: blue-soft with bolt or link icon.

### 3.9 Bottom sheet [M, edge-case frames]
Scrim black at 50%. Sheet: white, top radius 24, padding 16, grabber 40 × 4 (`#E4E4E7`) centered, title 20 SemiBold, body 14 Regular gray-2, buttons as in 3.1, home indicator at the bottom.

### 3.10 Option row (speed picker) [M]
Radius 12, padding 14 × 12, 1px `#E7E7E7`; selected: fill `#E7EEFF`, 2px blue border. Radio 22 (selected: blue fill, white check). Name 16 SemiBold, optional "Recommended" pill, time 13 Regular gray-2. Right: fee 15 SemiBold and fiat 12 gray.

### 3.11 Checkbox row [M]
Box 22, radius 6, 2px stroke (checked: blue fill, white check), text 14 Regular.

### 3.12 Onboarding dialog (modal over a dimmed screen) [A, measured width/height only]
White card, **361 wide** (seed phrase dialog is **361 × 556**), radius ~16, centered over the dimmed previous screen. X close at top right. Title centered (about 18–20 SemiBold), subtitle centered (12–14 Regular gray). Footer: primary blue button, or a Back (text) plus Next pair. The screen behind is dimmed, with its own "Show seed phrase" button visible.
Seed pills: two columns, fully rounded pills, light gray fill, number then word (e.g. `1 Orbit`). Selected in verify: light-blue fill with number badge.

### 3.13 Progress segments (onboarding intro) [A]
Two small bars centered above the title. Active: blue. Inactive: light gray.

---

## 4. Screens

Frame IDs are in the **Final flow** page. "→" marks the next screen.

### 4.1 Onboarding (section `231:15001`, 13 frames)

| Frame | Screen | Content and behavior |
|---|---|---|
| `231:14385` iPhone 16 - 103 | Splash | Full blue (`#0051FE`) screen, white anchor logo centered, "ANCHOR" wordmark near the bottom. Auto-advance after about 1.5 s → Welcome. |
| `231:14392` - 104 | Welcome | Large illustration placeholder (gray box) top, title "Welcome!", body "With Anchor, smoothly send, recieve and manage cryptocurrencies." (typo "recieve" appears in Figma; **keep as in the design**), Continue. |
| `231:14404` - 105 | Your Keys, Your Coins | Back arrow, "Skip" top right, illustration, progress segment 1 of 2 active, title "Your Keys, Your Coins", body "Anchor is a self custodial wallet. Your funds live on your device, controlled only by you." Continue. |
| `231:14424` - 106 | Two Ways to Pay | Same layout, segment 2 active, body "Lightning for everyday amounts, or on-chain for larger transfers." Continue → Backup. Skip → Backup. |
| `231:14478` - 107 | Backup your recovery phrase | X top left, small image placeholder, title "Backup your recovery phrase", four bullets: (1) "On the next screen, you'll see 12 words. They're the only way to recover your wallet, so keep them private and somewhere safe." (2) "Do not take screen shot, write them down on paper" (3) "Do not share this seed with anyone. Anchor will never ask for your seed." (4) "If you lose your seed (phrase), you've lost your funds." Button "Show seed phrase". |
| `231:14493` - 110 | Seed phrase (dialog) | Title "Seed phrase", sub "Write these phrases down including both numbers and words." 12 pills in 2 columns (1 Orbit, 2 Flame, 3 Drift, 4 Bloom, 5 Spark, 6 Ridge, 7 Frost, 8 Coral, 9 Swift, 10 Haze, 11 Pulse, 12 Dawn). Next → Verify. |
| `231:14564` - 111 | Verify phrase (dialog) | Title "Verify phrase", sub "Tap the words in correct order." Shuffled grid: Swift, Pulse / Flame, Bloom / Frost, Drift / Dawn, Spark / Haze, Ridge / Coral, Orbit. Tapping a word selects it and shows its order number (2 Flame, 3 Drift, 1 Orbit in the frame). Back, Next. |
| `231:14638` - 113 | Verifying phrase | Title "Verifying phrase", sub "Don't cancel the screen while verifying", blue spinner, Back and Next both disabled. About 1.5 s. |
| `231:14670` - 114 | Verified | Green check in a soft green ring, "Verified successfully". Auto-continue → Name wallet. |
| `231:14698` - 115 | Verification failed | Red X in a soft red ring, "Verification Failed", body "There's a mis-match! It happens sometimes. You can review and enter phrase again." Button "Review phrase" (outlined) → Seed phrase dialog (same 12 words). |
| `231:14444` - 108 | Name your wallet (empty) | X top left, title "Name your wallet", sub "Let's start setting up your account. Name your wallet", empty input placeholder "Enter Name", Continue **disabled**. |
| `231:14461` - 109 | Name your wallet (filled) | Input active (blue border) with "Savings21", Continue enabled → Home. |
| `231:14733` - 116 | Home (new wallet) | See 4.2, with balance 0 sats and no transactions (gray illustration placeholder, empty list). |

Correct order for verification: **Orbit, Flame, Drift, Bloom, Spark, Ridge, Frost, Coral, Swift, Haze, Pulse, Dawn.** Any other order → Verification failed.

### 4.2 Home [M for send-flow home, A for the rest]
Header: wallet name "Savings21" with a chevron (wallet switcher), "+" and settings icon buttons on the right. Blue gradient **Balance** card: label "Balance", big number with "sats" and fiat under it (231 sats / $0.34 in the send flow, 0 sats / $0.00 for a new wallet). "Transactions" heading with "View all". Rows: sent arrow icon tile, "Sent to ln9087fgryu…iou", "2 hours ago", "from Savings21", amount on the right ("24 sats", "32 sats"). Bottom bar: **Send | Receive** segmented blue button (arrow-up Send, arrow-down Receive) and a round "?" help button.
After a send (frame `231:2264`, iPhone 16 - 126): balance **218 sats**, the new transaction is at the top of the list.

### 4.3 Send (section `231:2184`)

| Frame | Screen | Notes |
|---|---|---|
| `231:2185` - 117 | Home | See 4.2. Tap Send → guide (first time) or Send screen. |
| `231:2664` - 119 | Guide, step 1 | Bottom sheet over the Send screen. Title "Sending Bitcoin for the first time?", "Lets guide you through it." Steps: **1 Add Recipient** ("Paste, scan or type where the money is going."), **2 Enter Amount** ("Choose how much to send."), **3 Review and Send** ("Check the fee and total, then confirm."), footer note "Sent bitcoin can't be taken back." Next. Header behind reads "Receive Bitcoin" in the old copy. **Check the final frame** for "Send Bitcoin". |
| `231:3553` - 120 | Guide, step 2 | "Choose how you want to send the currency." (check final copy) Options **Scan QR** (selected, "The easiest option when the friend is nearby or sends a QR image.") and **Type / Paste address** ("Type the address in the input field or just paste the address given by someone."). Continue → Send screen. |
| `231:2422` copy (1450,1090) | Send, first time | No history: "Recipients you've paid will show up here." under Recent. |
| `231:2359` copy | Send, empty | `To:` with placeholder and Paste, Scan QR code row, Recent list (`alex@domain.com`, `sam@walletofsatoshi.com`, `bc1qxy2k…x0wlh`). |
| `231:2458` - 121 | Send, typing | `To: bc1qxy2kgdwu4ty48t45ty40wl…` with X, Scan row, Recent. |
| `231:2520` - 122 | Send, detected | `To:` chip `bc1qxy2kgd…x0wlh`. Section "Matching address" with the one matching row. Tap row → Amount. |
| `231:2550` - 123 | Amount, 0 | `To:` chip, "0 sats", "$0.00 ⇅", keypad, Continue. |
| `231:2607` - 124 | Amount, 12 | "12 sats", "$0.001 ⇅". Continue → Review. |
| `231:4430` | Review, on-chain | See 4.4. |
| `231:4501` | Review, Lightning | See 4.4. |
| `231:4570` | Confirm with PIN | See 4.5. |
| `231:2264` - 126 | Home after send | Balance 218 sats, new row at top. |

### 4.4 Review payment [M, built in this project]
Header: back arrow, "Review payment" (18 SemiBold). Hero: "You're sending" (15 Regular gray), amount 56 Medium blue + "sats" 18 Medium gray, "≈ $0.01" 16. Details card:

| Row | On-chain | Lightning |
|---|---|---|
| To | `bc1qxy…hx0wlh` (first and last 6 characters bold) + "View full address" (blue link) | `lnbc1p…x4qz9s` + "Lightning invoice · expires in 09:42" |
| From | Savings21 | Savings21 |
| Network | pill "On-chain" (link icon) + "Usually 10–60 min" | pill "Lightning" (bolt) + "Arrives in seconds" |
| Network fee | "1 sat" + green "Low" pill + "Change speed" link | "1 sat" + green "Low" pill |
| *(dashed divider)* | | |
| Total | "13 sats" (20 SemiBold blue) + "Amount + fee" label + "≈ $0.01" | same |

Amber note below the card: **"Sent bitcoin can't be reversed"** with body "Check the start and end of the address against what your friend sent you." (on-chain) or "Check the amount and recipient before you send." (Lightning). Primary button "Send", hint "Press and hold for 1 second to confirm" (the button is a **hold-to-confirm**, see project.md for timing).

### 4.5 Confirm with PIN [M]
Title "Confirm with your PIN", sub "Enter your 6-digit PIN to send 20,000 sats." (amount is dynamic). Six PIN dots (red outline in the error state), error line "That PIN didn't match. 2 tries left." (red, with alert icon), number keypad without the dot key, text button "Use Face ID instead". Success → Sending status → Home after send. (The frame exists twice in the file, `231:4570`, `231:5443` and `231:5492`; use the **latest** version.)

### 4.6 Receive (section `231:14384`, 15 frames) [N, not inspected this session]
Frames: `231:6109` -87, `231:13154` -98, `231:6456` -88, `231:8111` -89, `231:10587` -92, `231:12287` -94, `231:11437` -93, `231:8938` -90, `231:9762` -91, `231:7280` -96, `231:6188` -95, `231:6285` -97, `231:14029` -102, and two "Filter" frames `231:6412` (393 × 766) and `231:14004` (393 × 766).
From the user's flow notes (confirm each against the export):
- Home / wallet screen → **Receive**. If the wallet has **zero receive transactions**, show a **guiding overlay** first: beginner text ("seems like it's your first time"), choose mode **Lightning** or **On-chain**, short description of each. Otherwise go straight to a Receive screen.
- **Receive – Lightning**: short info about Lightning, QR code (shareable), the user's invoice or address with copy, "valid until" info, **reusable vs single-use** QR/address option, tabs to switch between the two modes, manual **amount** input, manual **expiration** input, Share button.
- **Receive – On-chain**: short info, QR, address with copy, the two-mode switch, manual amount, Share, and **fee information**.
- **Select share**: the request is saved in transactions; selecting it shows its status; Lightning requests expire at their expiry date; the user is notified about all states (waiting, detected, confirmed).
- "Filter" frames are bottom-sheet or dropdown filters for the transactions list.

### 4.7 Send edge cases (section `231:4619`, 16 frames)
Label text in the file: "First time UX". Frames are grouped in three rows. All use the Send header ("Send Bitcoin - Savings21") unless noted.

**Row A — Anchor reads what you paste** (input interpretation)

| Frame | Trigger | Content |
|---|---|---|
| `231:4621` A1 Lightning invoice detected | Valid invoice with amount | Chip `lnbc5u1p…x4qz9s`. Blue note "Lightning invoice", "Arrives in seconds with a very small fee. Anchor will pay it for you." Card: Amount (500 sats, "Set by the invoice", ≈ $0.50), Expires in 09:42. Button Continue. |
| `231:4661` A2 Unified QR | `bitcoin:` URI with a `lightning=` parameter | Chip "Payment request". Blue note "Paying with Lightning", "This request accepts both Lightning and on-chain. Anchor picked Lightning because it is faster and cheaper." Card: Amount 2,000 sats (≈ $2.00), Speed Seconds, Fee About 2 sats ("Very low", green). Link row "Pay on-chain instead" ("Slower (10 to 60 min) and a higher fee"). Continue. |
| `231:4718` A3 Could not read | Unparseable text | Red field. Red note "We couldn't read this", "Check that you copied all of it. An address or invoice is one long line with no spaces." Heading "Anchor understands" with three rows: Bitcoin address (Starts with bc1 · on-chain), Lightning invoice (Starts with lnbc · Lightning), Lightning address (Looks like name@domain.com · Lightning). Buttons "Paste again", text "Scan QR code instead". |
| `231:4769` A4 Invoice expired | Invoice past its expiry | Amber field. Amber note "This invoice has expired", "Lightning invoices only work for a short time. Ask the sender for a new one." Heading "Message to send" and a preview "Hi! The invoice you sent has expired. Could you send me a new one?" Buttons "Share message", text "Back". |
| `231:4800` A5 Test network address | `tb1…`, `m…`, `n…`, `2…` or `lntb…` | Red field. Red note "This is a test network address", "It can't receive real bitcoin, so sending to it would lose the funds. Ask for a regular Bitcoin address, one that starts with bc1." Buttons "Scan another code", text "Edit recipient". |
| `231:4827` A6 Own address | Address belongs to the user's wallet | Amber field. Amber note "This is your own address", "You would be sending bitcoin to Savings21, your own wallet. You would pay a network fee and the funds would stay with you." Buttons "Choose another recipient", text "Continue anyway". |

**Row B — Amount and fee: cost is part of the decision**

| Frame | Trigger | Content |
|---|---|---|
| `231:4855` B1 Amount above balance | amount > balance | Amount shown in **red**, error line "Short by 69 sats" (alert icon), blue-soft chip "You have 231 sats · Send max", keypad, Continue disabled. |
| `231:4910` B2 Fee not covered | amount ≤ balance but amount + fee > balance | Red "231", error "Not enough left for the fee", help "Lightning fee is about 2 sats.", chip "Send max · 229 sats, fee included". Continue disabled. |
| `231:4966` B3 Below on-chain minimum | on-chain amount below 294 sats | Red "200", error "Too small to send on-chain", help "The minimum is 294 sats. For small amounts, ask for a Lightning invoice instead." |
| `231:5020` B4 Change speed | tap "Change speed" on on-chain review | Review screen under a sheet "Choose speed" ("Fees depend on how busy the network is right now."): Slow (About 60 min, 140 sats, ≈ $0.14), **Standard** (About 30 min, 280 sats, ≈ $0.28, "Recommended", selected), Fast (About 10 min, 560 sats, ≈ $0.56). Button Done. |
| `231:5125` B5 Fee changed | fee moved during review | Sheet "Network fees changed", "Fees went up while you were reviewing. Here is the new cost before anything is sent." Card: Network fee 360 sats (amber "was 280 sats"), New total 20,360 sats (≈ $20.36). Buttons "Accept and continue", outlined "Choose a slower speed". |
| `231:5216` B6 High fee warning | fee is a large share of the amount | Review with Fee pill **High** (amber) and sub "≈ $0.28 · 28% of amount". Amber note "The fee is 28% of what you're sending", "On-chain fees are high for small amounts. Pick a slower speed, or ask for a Lightning invoice." Hint "Press and hold for 1 second. This can't be undone." Amount 1,000, total 1,280. |

**Row C — Warnings proportional to the stakes**

| Frame | Trigger | Content |
|---|---|---|
| `231:5286` C1 First-time recipient | address never paid before | Review under a sheet "First time sending to this address", "Compare the start and end with what your friend sent you. If they don't match, don't send." Big address block `bc1qxy…hx0wlh` (26 SemiBold blue, the dots gray), "Starts with bc1qxy · Ends with hx0wlh". Buttons "They match, continue", text "Edit recipient". |
| `231:5365` C2 Large payment | large amount (example 2,500,000 sats ≈ $2,500) | Review with amber note "Large payment", "This is about $2,500. Check both boxes before you send." Two checkboxes: "The address matches what I was given" (checked), "I understand this can't be undone" (unchecked). Button **disabled** until both ticked, hint "Tick both boxes to continue". Fee pill Low, sub "≈ $0.28 · under 0.1% of amount". |
| `231:5443`, `231:5492` C3 Confirm with PIN | before signing | See 4.5. |

---

## 5. Motion and interaction notes

Figma holds the static frames only, so these are the intended behaviors.
- Screen transitions: horizontal push for forward, pop for back. Sheets and dialogs slide or fade up over a scrim.
- Hold-to-send: the Send button fills left to right while held, about 1 s, haptic or visual pulse on completion; releasing early resets it.
- Sending status: a progress screen (Sending → Sent → Confirmed for on-chain, Sending → Sent for Lightning). Final design for this screen is not in the frames above; see the open questions in project.md.
- Lightning invoice countdown ticks every second on A1 and the Lightning review. At 00:00 route to A4.
- Typing an amount: digits append, backspace removes, hero text switches to red when invalid, Continue disables.
- Verifying seed phrase: spinner for about 1.5 s, then success or failure.

---

## 6. Known inconsistencies in the design (decide before building)

1. **Balance vs examples.** Home shows **231 sats**. Several edge-case examples use 20,000 or 2,500,000 sats (B4, B5, B6, C2, C3). The prototype needs either a "large balance" demo mode or dynamic copy.
2. **B3 vs the on-chain happy path.** B3 says on-chain minimum is 294 sats, but the on-chain review sample is 12 sats with a 1 sat fee.
3. **Fees.** The review frames show a 1 sat fee. The edge cases use 140 / 280 / 560 sats (on-chain tiers) and about 2 sats (Lightning).
4. **Guide overlay header** still reads "Receive Bitcoin" in the older frames behind the Send guide.
5. **Copy typos in the design:** "recieve" (Welcome), "self custodial" (could read "self-custodial"), "Lets guide you" (should be "Let's"). Keep as designed unless the designer changes them.
6. **Duplicate frames:** two frames named "copy", and C3 appears three times. Use the frame that matches the flow above and ask the designer which is final.
7. **Receive and Home specs** were not measured. Export them before building.
