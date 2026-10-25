# OffPay — Offline UPI Payment Assistant (Web Application)

A modern, mobile-first responsive web application that helps users prepare and execute UPI transactions when mobile data (internet) is unavailable, by scanning merchant UPI QR codes, extracting payment parameters, and guiding them through official telecommunication USSD (*99#) or Voice (124PAY) channels.

---

## 🚀 Key Features

1. **Responsive Web Application**:
   - Modern desktop navigation with quick access to Home, QR Scanner, Transactions Ledger, and Knowledge Base.
   - Fluid 1200px responsive desktop dashboard with mobile-optimized navigation for small viewports.
   - Built-in Dark Mode and Light Mode support.

2. **100% Offline QR Decoding & Sanitization**:
   - Camera viewfinder with live scanning using `jsQR`.
   - Drag-and-drop gallery image QR scanner.
   - Instant 1-click test scenarios (The Coffee House ₹250, Kirana Store ₹80, Metro Station ₹200).
   - Strict Zod validation: rejects phishing URLs, malformed handles, and invalid amounts.

3. **Configurable Carrier Eligibility Registry**:
   - **Airtel / Vi / BSNL**: National Unified USSD Platform (NUUP `*99#`) operating over base 2G/3G/4G GSM signaling channels (no data pack required).
   - **Jio**: Voice-based IVR payments (`124PAY` / `124729`) tailored for pure VoLTE networks where USSD is restricted.

4. **Interactive Phone Dialer & Session Simulator**:
   - Direct native dialer handoff (`tel:*99%23` / `tel:124PAY`).
   - Interactive in-app telecom terminal simulator to test USSD reply steps on laptops/desktops without an active cellular SIM.

5. **Financial Transactions Ledger**:
   - Local client-side storage of prepared payments.
   - Filter by Confirmed, Pending, and Failed.
   - Interactive modal receipts with copyable merchant UPI ID and amount.

6. **Comprehensive Offline Knowledge Base**:
   - Offline documentation covering USSD protocol mechanics, dual-SIM troubleshooting, and security rules ("Never share your UPI PIN").

---

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite
- **Styling**: Vanilla CSS Design System with CSS Custom Properties
- **QR Decoding**: `jsQR` (Client-side Canvas parser)
- **Validation**: `Zod` schemas for UPI URIs, handles, amounts, and transactions
- **Icons**: `lucide-react`
- **Testing**: `Vitest` unit test suite
- **PWA**: Service Worker (`public/sw.js`) and Web Manifest (`public/manifest.json`)

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

### 3. Run Unit Tests
```bash
npm test
```

### 4. Build Production Bundle
```bash
npm run build
```

### 5. Lint
```bash
npm run lint
```

---

## 📱 Native Android vs Web Sandbox Comparison

| Capability | Web Application (This App) | Native Android (Future APK) |
|---|---|---|
| **QR Code Scanning** | Supported via WebRTC / File Upload | Supported natively with ML Kit |
| **Offline Caching** | PWA Service Worker Cache | Local APK assets |
| **Dialer Handoff** | Supported via `tel:*99#` protocol link | Supported via `ACTION_CALL` or `ACTION_DIAL` |
| **Automatic SIM Slot Query** | Not supported (browser sandbox restriction) | Supported via `SubscriptionManager` |
| **USSD Menu Interception** | Simulated in-app | Supported via `TelephonyManager.sendUssdRequest()` |
