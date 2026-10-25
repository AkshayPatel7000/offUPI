# Build a Mobile-First Offline UPI Payment Assistant

## Project Overview

Build a production-quality, mobile-first web application called **Offline UPI Assistant**. The app helps users prepare a UPI payment when mobile internet is unavailable by scanning a merchant's UPI QR code, extracting payment details, and guiding them through a supported USSD or voice-based payment service.

The app is a payment preparation and guidance tool. It is NOT a UPI payment processor, bank, wallet, or replacement for an authorized payment application.

The primary design inspiration is Google Pay's simplicity, accessibility, and clarity. Do not copy Google Pay's branding, logo, proprietary assets, or exact screen designs. Create a distinct product identity.

## 1. Technology Stack

- Next.js with App Router
- TypeScript with strict mode
- Tailwind CSS
- shadcn/ui components
- Lucide React icons
- A browser-compatible QR scanning library such as @zxing/browser
- Service worker and Web App Manifest for PWA functionality
- IndexedDB for optional, non-sensitive local preferences
- Zod for validating parsed QR data and application inputs
- Vitest for unit tests
- Playwright for end-to-end tests

Use a modular, maintainable architecture. Keep QR parsing, carrier eligibility, payment guidance, and navigation logic separate.

## 2. Design System

Create a modern, minimal, trustworthy financial utility interface.

Visual direction:

- White and very light blue backgrounds
- Deep blue as the primary action color
- Soft blue cards and subtle neutral borders
- Green for verified or successful states only when justified
- Amber for warnings and uncertain states
- Red for errors and critical safety messages
- Rounded cards, restrained shadows, consistent spacing
- Large, readable typography
- Clear icons and simple illustrations
- Generous whitespace
- Smooth, subtle transitions
- Accessible contrast and large touch targets

Design for mobile screens first, then adapt to tablet and desktop.

Avoid excessive gradients, cluttered dashboards, decorative charts, unnecessary animations, and fake financial data.

Include light mode and an optional dark mode.

## 3. Application Navigation

Create a persistent mobile bottom navigation bar with:

1. Home
2. Scan
3. Help

Add a separate Transactions or Recent Activity screen only for locally recorded preparation history. Never label a locally recorded action as a completed payment unless that status has been independently verified.

On desktop, adapt the navigation to a compact sidebar or top navigation.

## 4. Screen One — Intro and Home

Create a welcoming landing screen.

Headline:
"Pay, even without internet."

Supporting text:
"Scan a UPI QR code, prepare your payment, and follow simple steps using a supported phone-based payment service."

Primary CTA:
"Scan QR code"

Secondary actions:

- Enter UPI ID
- How it works
- Help & Guide

Include:

- A clear illustration of a phone scanning a merchant QR code
- A compact connectivity status indicator
- A payment-method information card
- A short safety reminder
- A concise explanation that cellular service is still required even when mobile data is unavailable

Do not promise that every user or carrier supports every offline payment method.

## 5. Screen Two — QR Scanner

Build a dedicated camera-based QR scanner.

Requirements:

- Request camera permission only when the user opens the scanner
- Show a clear square scanning frame
- Include torch control where the device supports it
- Include a gallery upload option
- Include manual UPI ID entry
- Provide clear camera permission denied, unsupported browser, invalid QR, and scanning error states
- Prevent repeated processing of the same QR code
- Include a back button and an accessible scanning instruction

Parse standard UPI payment URIs locally whenever possible.

Recognize relevant fields such as:

- pa: payee UPI ID
- pn: payee name
- am: amount, when supplied
- tn: transaction note, when supplied
- cu: currency

Validate input formats and reject malformed or unsupported schemes. Do not fetch arbitrary URLs embedded in QR codes.

Treat every scanned QR code as untrusted input.

Do not assume that the payee name is verified merely because it appears in the QR code.

## 6. Screen Three — QR and Merchant Details

After a successful scan, navigate to a merchant details screen.

Display:

- Merchant name, if present
- Full UPI ID
- QR-provided amount, if present
- Editable amount field where appropriate
- Optional payment note
- Copy UPI ID button
- Copy amount button
- Clear warning to verify the recipient and amount

If the QR contains no amount, ask the user to enter one.

If a QR-provided amount exists, display it prominently and make any editing explicit.

Do not claim to verify merchant identity or account ownership without an authorized verification service.

Primary CTA:
"Continue"

Validate the amount and UPI ID before proceeding.

## 7. Screen Four — Network and Payment Method Selection

Create a dedicated carrier and eligibility screen.

Show:

- Selected mobile carrier
- Selected SIM slot, if available through a supported native integration
- Current connectivity state
- Available payment methods
- Eligibility status and its source
- A manual carrier selection option

Supported guidance types should be configurable:

A. USSD-based payment using \*99#

B. Voice or IVR-based payment using an officially verified service, potentially including a supported 124PAY implementation if its current availability and eligibility are confirmed.

IMPORTANT:
Do not hard-code assumptions that Airtel always supports the required flow or that Jio always supports 124PAY. Maintain a configurable eligibility registry with last-verified dates, supported carriers, service codes, bank eligibility notes, and source references.

Distinguish between:

- Supported and verified
- Potentially supported
- Not verified
- Unsupported
- Unable to determine

If the browser cannot determine the carrier, explain why and ask the user to select it manually.

If multiple SIMs are present, ask which SIM is linked to the user's bank account.

Do not claim that a web browser can reliably detect the user's SIM operator or SIM slot across all devices.

Primary CTA:
"Show my payment steps"

## 8. Screen Five — USSD Payment Guide

Build a step-by-step guide for the USSD method.

Header:
"Pay using USSD"

Explain that the service uses cellular signalling and does not require mobile internet, but does require sufficient cellular network service and service eligibility.

Include:

1. Confirm that the selected mobile number is registered with the user's bank and that the service is supported.
2. Review the merchant UPI ID and payment amount.
3. Tap "Open dialer".
4. Open the phone dialer with \*99# prefilled where supported.
5. Follow the official interactive USSD menu displayed by the telecom/banking service.
6. Enter recipient information and amount when requested.
7. Carefully review the transaction details.
8. Authorize the transaction using the official service's secure authentication flow.
9. Check the final transaction result through an authoritative confirmation channel.

Provide:

- A prominent dialer CTA
- Copy UPI ID
- Copy amount
- A progress indicator for reading the guide
- A warning that the app cannot control the USSD session
- A manual fallback if the dialer cannot be opened

Do not invent exact USSD menu numbers or guarantee that every service supports direct UPI ID payments. Explain that the actual menus may differ.

## 9. Screen Six — Voice / IVR Payment Guide

Build a separate guide for a verified voice-based payment service.

Header:
"Pay using voice instructions"

Display:

- Verified service name
- Official dial or call number, only when confirmed
- Supported carrier and bank eligibility notes
- Clear numbered instructions
- Merchant UPI ID and amount for reference
- Copy controls
- An "Open dialer" or "Call service" button where supported

The app must never initiate a call automatically.

Explain that the user must follow the official voice prompts and authorize the payment through the service's supported authentication mechanism.

Do not assume that a service accepts arbitrary UPI IDs, arbitrary QR payments, or the same payment steps as USSD. Implement service-specific instructions only after confirming the official workflow.

If 124PAY eligibility cannot be verified, show a transparent "Availability not verified" state instead of presenting it as guaranteed.

## 10. Screen Seven — Payment Status and Exit

After the user returns from the dialer, display a payment follow-up screen.

Do not automatically mark the payment successful.

Offer these actions:

- "Payment confirmed"
- "Payment still pending"
- "Payment failed"
- "I need help"

When the user selects a status, clearly label it as user-reported unless the result is verified through an authorized provider or trusted confirmation source.

Show a reminder to check the bank's official confirmation SMS, statement, or supported transaction-status service.

Do not store UPI PINs, OTPs, CVVs, bank passwords, or authentication secrets.

Do not ask users to enter their UPI PIN into this app.

## 11. Screen Eight — Help and Guide

Create a dedicated help center with searchable FAQs and separate guides.

Categories:

USSD:

- What is \*99#?
- How does USSD work without mobile internet?
- Why is the USSD menu not opening?
- Why does the service report an unsupported request?
- What if my bank does not support the transaction?

Voice / IVR:

- What is voice-based UPI payment?
- How do I verify the official service number?
- What if the call disconnects?
- How do I check whether my payment succeeded?

Connectivity:

- Internet unavailable
- No cellular signal
- SIM not detected
- Dual-SIM setup
- Carrier eligibility unknown

Safety:

- Verify the recipient before paying
- Never disclose your UPI PIN, OTP, or CVV
- Only authorize a payment you intend to make
- Never enter a UPI PIN to receive money
- What to do if money is debited but the recipient has not received it

Include a troubleshooting flow with clear actions and links back to the relevant screens.

Bundle essential help content locally so that it remains accessible without internet.

## 12. Offline-First Requirements

The app must remain usable when mobile internet is unavailable.

Implement:

- PWA installation support
- Service-worker caching of the application shell
- Offline fallback route
- Locally available help guides
- Local QR parsing
- Local input validation
- Local connectivity messaging
- Optional local preferences
- Clear offline and online states

Do not make the core scanning and guidance flow depend on a backend request.

Explain that camera access generally requires HTTPS or localhost, and that the initial app installation or first load may require internet.

Do not claim the application works without any network signal. The actual payment service still requires cellular connectivity.

## 13. Browser and Device Limitations

Implement capability detection and graceful fallbacks.

For web:

- Use a tel: link or supported dialing intent to open the dialer.
- Never claim that the browser can submit USSD menu responses.
- Never claim that the browser can programmatically complete a phone call.
- Provide manual copy-and-dial instructions if the platform blocks the handoff.
- Clearly document unsupported iOS and desktop behaviours.

If reliable automatic SIM detection is required, document a future native Android integration using appropriate permissions and platform APIs.

Keep the first release fully usable with manual carrier selection.

## 14. Suggested Project Structure

Organize the code into:

- app/page.tsx — Home
- app/scan/page.tsx — QR scanner
- app/merchant/page.tsx — Merchant details
- app/payment-method/page.tsx — Carrier and payment selection
- app/guide/ussd/page.tsx — USSD guide
- app/guide/voice/page.tsx — Voice/IVR guide
- app/payment-status/page.tsx — Payment follow-up
- app/help/page.tsx — Help center
- app/settings/page.tsx — Preferences and privacy
- components/navigation/
- components/qr-scanner/
- components/merchant/
- components/payment-guide/
- components/connectivity/
- components/help/
- lib/qr/
- lib/eligibility/
- lib/payment-guides/
- lib/storage/
- lib/validation/
- public/manifest.json
- public/service-worker.js or the framework-compatible service-worker setup

Adapt this structure if a cleaner App Router organization is appropriate.

## 15. Quality and Testing

Create realistic mock data for merchant QR codes and guide content.

Test:

- Valid and invalid UPI QR codes
- QR codes with and without amounts
- Missing payee names
- Malformed UPI IDs
- Invalid amounts
- Camera permission denial
- Gallery upload failures
- Offline first-load and repeat-load scenarios
- Unknown carrier
- Manual carrier selection
- Dual-SIM fallback
- Unsupported payment service
- Dialer handoff failure
- Payment pending, failed, and user-reported success states
- Small screens and accessibility

No real financial transactions should be executed in the prototype.

## 16. Deliverables

Generate a complete, runnable project with:

1. All application screens
2. Reusable UI components
3. Responsive navigation
4. Mock merchant and carrier data
5. Functional QR parsing and amount entry
6. Step-by-step payment guides
7. Working offline caching and fallback
8. Dialer handoff with manual fallback
9. Help center and safety content
10. Unit and end-to-end tests
11. README with installation, development, testing, and build instructions
12. A clear list of features that require native Android functionality or official service verification

Prioritize a polished, functional prototype over decorative placeholders. Every primary CTA must perform a meaningful action. Never fabricate carrier eligibility, official phone numbers, payment completion, or transaction verification.
