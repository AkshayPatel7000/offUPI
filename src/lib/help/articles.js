/**
 * Comprehensive Offline Knowledge Base Articles & Troubleshooting
 * Directly bundled locally in the client bundle for 100% offline availability.
 */

export const HELP_CATEGORIES = [
  { id: 'all', label: 'All Topics' },
  { id: 'guides', label: 'Payment Guides' },
  { id: 'ussd', label: 'USSD (*99#)' },
  { id: 'voice', label: 'Voice / 124PAY' },
  { id: 'connectivity', label: 'Connectivity & SIM' },
  { id: 'safety', label: 'Safety & PIN Rules' },
];

export const PAYMENT_GUIDES = [
  {
    id: 'airtel-ussd-guide',
    title: 'Airtel – USSD (*99#)',
    subtitle: 'Step by step guide with USSD interactive navigation',
    carrier: 'Airtel',
    badge: 'USSD Signaling',
    steps: [
      {
        step: 1,
        title: 'Open Phone Dialer with *99#',
        description: 'Ensure your phone is using the SIM card registered with your bank account. Dial *99# and press the call button.',
      },
      {
        step: 2,
        title: 'Select "Send Money"',
        description: 'The interactive USSD menu will pop up on your screen. Reply with "1" to choose "Send Money".',
      },
      {
        step: 3,
        title: 'Choose "UPI ID"',
        description: 'Select option "3" (UPI ID / VPA) from the payment destination options.',
      },
      {
        step: 4,
        title: 'Enter Merchant UPI ID & Amount',
        description: 'Paste or type the merchant UPI ID (e.g. coffeehouse@okaxis) and enter the exact payment amount.',
      },
      {
        step: 5,
        title: 'Authorize with your official UPI PIN',
        description: 'Enter your 4 or 6 digit UPI PIN on the secure telecom prompt. Your bank will send an authoritative confirmation SMS immediately.',
      },
    ],
  },
  {
    id: 'jio-voice-guide',
    title: 'Jio – 124PAY (Call)',
    subtitle: 'Step by step guide with IVR voice prompts',
    carrier: 'Jio',
    badge: 'Voice Call',
    steps: [
      {
        step: 1,
        title: 'Call official 124PAY (124729)',
        description: 'Dial 124PAY (124729) or backup number 08045163666 from your bank-linked Jio SIM number.',
      },
      {
        step: 2,
        title: 'Select Language & Say "Pay Merchant"',
        description: 'The automated voice assistant will ask your preferred language (Hindi, English, etc.) and what you want to do.',
      },
      {
        step: 3,
        title: 'Speak or Key in UPI ID / Phone number',
        description: 'Follow the voice prompt to specify the merchant UPI ID or registered merchant phone number.',
      },
      {
        step: 4,
        title: 'Confirm Amount & Enter UPI PIN on Keypad',
        description: 'Listen carefully as the system repeats the recipient name and amount. Authorize with your bank UPI PIN via your phone dialpad tones.',
      },
    ],
  },
];

export const HELP_ARTICLES = [
  {
    id: 'what-is-99',
    category: 'ussd',
    title: 'What is *99# and how does it work?',
    summary: 'National Unified USSD Platform (NUUP) by NPCI that provides banking services over mobile cellular signaling.',
    content: `*99# is an official banking service operated by the National Payments Corporation of India (NPCI) and telecom service providers.
It uses Unstructured Supplementary Service Data (USSD) protocol. Unlike 4G/5G mobile data, USSD operates over the base GSM signaling channel (the same system your phone uses to check balance or make standard phone calls).
This means *99# works even when you have ZERO mobile data, no 4G signal, or no active data pack, as long as your phone has basic 2G/3G/4G network reception bars.`,
  },
  {
    id: 'ussd-not-opening',
    category: 'ussd',
    title: 'Why is the USSD menu not opening or giving "Connection problem"?',
    summary: 'Common causes include dialer restrictions, VoLTE-only networks, or dual-SIM slot confusion.',
    content: `1. Ensure you dialed from the correct SIM card that is registered with your bank account.
2. If using dual SIM, check which SIM is set as default for voice/calls in your phone settings.
3. Jio SIM cards do not support 2G USSD (*99#) because Jio is a pure 4G/5G VoLTE network. For Jio users, use 124PAY Voice instead.
4. Temporary telecom tower congestion: wait 30 seconds and try dialing again.
5. Check your phone has at least 1 bar of mobile signal.`,
  },
  {
    id: 'what-is-124pay',
    category: 'voice',
    title: 'What is voice-based 124PAY and how does it work?',
    summary: 'RBI approved IVR voice payment system designed for non-internet UPI transactions.',
    content: `124PAY (also part of the 123PAY initiative launched by Reserve Bank of India and NPCI) allows users to perform digital UPI payments through standard interactive voice response (IVR) phone calls.
You dial an authorized number (124729 or 08045163666), hear automated voice prompts in your language, enter or speak recipient details, and authorize the transaction using your secret UPI PIN through the dialpad. No mobile internet is required.`,
  },
  {
    id: 'connectivity-requirements',
    category: 'connectivity',
    title: 'What cellular signal is required? Does it work with Airplane mode?',
    summary: 'Cellular network signal is required. Airplane mode will NOT work.',
    content: `Important: While Offline UPI does not need mobile data (Internet/Wi-Fi), it DOES require basic cellular signaling to reach the telecom tower and bank servers.
Therefore:
- You do NOT need 4G/5G mobile data or Wi-Fi.
- You CANNOT use Airplane mode or be in a total zero-signal dead zone.
- You need at least 1-2 bars of standard mobile reception to exchange USSD packets or make a voice call.`,
  },
  {
    id: 'dual-sim-guidance',
    category: 'connectivity',
    title: 'How do I handle Dual-SIM phones?',
    summary: 'Banks only recognize and authorize transactions originating from your registered mobile number.',
    content: `Your bank links your UPI identity strictly to the phone number registered in your bank account records.
When dialing *99# or 124PAY:
1. Ensure your phone dialer initiates the call using the exact SIM card linked to your bank.
2. In Android Settings > Network & Internet > SIMs, you can set the preferred SIM for calls.
3. If the USSD menu states "Mobile number not registered", switch to the other SIM slot and re-dial.`,
  },
  {
    id: 'safety-pin-rules',
    category: 'safety',
    title: 'Safety Rule #1: NEVER share your UPI PIN or enter PIN to receive money',
    summary: 'Critical security precautions when performing UPI transactions offline or online.',
    content: `CRITICAL SAFETY RULES:
1. NEVER disclose your UPI PIN, OTP, CVV, or bank password to anyone—including merchants, bank agents, or this application.
2. This application (Offline UPI Assistant) NEVER asks for your UPI PIN. Your UPI PIN is only entered in the official telecom/bank secure prompt during the USSD/call session.
3. Remember: You NEVER need to enter your UPI PIN to RECEIVE money. UPI PIN is solely required to DEDUCT money from your account.
4. Always verify the merchant name displayed in the QR and on the USSD screen before approving the payment.`,
  },
  {
    id: 'money-debited-troubleshooting',
    category: 'safety',
    title: 'What if money is debited but the merchant says payment not received?',
    summary: 'How to verify bank confirmation SMS and NPCI settlement turnaround times.',
    content: `1. Check your bank SMS: If your bank sent an SMS confirming deduction with a 12-digit UPI Transaction Reference Number (RRN), the money has left your account.
2. In offline transactions, the merchant terminal or soundbox might take 1-3 minutes to announce payment confirmation due to network delays.
3. Show the official bank deduction SMS to the merchant as reference.
4. If a transaction fails to credit the merchant, NPCI automated reversal guidelines require banks to auto-reverse the funds back to your account within 24 to 48 hours.`,
  },
];
