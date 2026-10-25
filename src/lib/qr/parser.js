import { UpiIdSchema, AmountSchema } from '../validation/schemas';

/**
 * Standard MCC (Merchant Category Code) mapping to friendly category names
 */
const MCC_MAP = {
  '5411': 'Grocery & Supermarket',
  '5812': 'Food & Dining',
  '5814': 'Fast Food & Cafes',
  '4111': 'Commuter Transport',
  '5912': 'Pharmacy & Health',
  '5999': 'General Retail',
  '5541': 'Fuel & Gas Station',
  '4814': 'Telecommunications',
  '4900': 'Utilities',
};

/**
 * Helper to extract query parameter case-insensitively from a string
 */
function extractParam(str, key) {
  const regex = new RegExp(`(?:[?&;]|^)${key}=([^&;\\s#]+)`, 'i');
  const match = str.match(regex);
  if (match) {
    try {
      return decodeURIComponent(match[1].replace(/\+/g, ' ')).trim();
    } catch {
      return match[1].trim();
    }
  }
  return null;
}

/**
 * Helper to parse EMVCo BharatQR payload (starts with 000201)
 * Used by all physical merchant POS QR stands (PhonePe, Paytm Soundbox, Google Pay, BharatPe)
 */
function parseEmvCoQr(raw) {
  if (!raw.startsWith('000201')) return null;

  try {
    let i = 0;
    const tags = {};
    while (i < raw.length) {
      const tag = raw.substring(i, i + 2);
      const lenStr = raw.substring(i + 2, i + 4);
      const len = parseInt(lenStr, 10);
      if (isNaN(len) || len < 0) break;
      const val = raw.substring(i + 4, i + 4 + len);
      tags[tag] = val;
      i = i + 4 + len;
    }

    // In BharatQR specifications:
    // Tag 26 to Tag 30 represent Merchant Account Information for UPI
    let upiId = null;
    for (const tagNum of ['26', '27', '28', '29', '30']) {
      if (tags[tagNum]) {
        const subRaw = tags[tagNum];
        let j = 0;
        while (j < subRaw.length) {
          const subTag = subRaw.substring(j, j + 2);
          const subLen = parseInt(subRaw.substring(j + 2, j + 4), 10);
          if (isNaN(subLen)) break;
          const subVal = subRaw.substring(j + 4, j + 4 + subLen);
          // Subtag '01' is the VPA / UPI ID in NPCI EMVCo specifications
          if (subTag === '01' && subVal.includes('@')) {
            upiId = subVal;
            break;
          }
          j = j + 4 + subLen;
        }
        if (upiId) break;
      }
    }

    // Fallback: search tags for any valid UPI pattern
    if (!upiId) {
      for (const val of Object.values(tags)) {
        const match = val.match(/[a-zA-Z0-9.\-_]{2,64}@[a-zA-Z0-9.\-_]{2,32}/);
        if (match) {
          upiId = match[0];
          break;
        }
      }
    }

    if (!upiId) return null;

    const validated = UpiIdSchema.safeParse(upiId);
    if (!validated.success) return null;

    const merchantName = tags['59'] || formatMerchantNameFromUpiId(validated.data);
    const amountStr = tags['54'] || null;
    let amount = null;
    let hasFixedAmount = false;
    if (amountStr) {
      const parsedAmt = parseFloat(amountStr);
      if (!isNaN(parsedAmt) && parsedAmt > 0) {
        amount = parsedAmt;
        hasFixedAmount = true;
      }
    }

    return {
      raw,
      upiId: validated.data,
      merchantName,
      amount,
      note: null,
      currency: 'INR',
      category: 'Merchant',
      hasFixedAmount,
    };
  } catch {
    return null;
  }
}

/**
 * Parses raw QR code string or UPI URI.
 * Handles:
 * 1. Standard UPI URI: `upi://pay?pa=recipient@bank&pn=Recipient+Name&am=250&cu=INR...`
 * 2. Mixed/Uppercase variants: `UPI://PAY?PA=...`
 * 3. EMVCo BharatQR strings (`000201...`)
 * 4. URLs with embedded `pa=` query parameters
 * 5. Plain UPI ID: `coffeehouse@okaxis`, `9876543210@paytm`
 * 6. Free-form text containing a valid UPI ID
 *
 * Rejects:
 * - Empty or non-string input
 * - Explicit non-UPI schemes (mailto:, sms:, tel:)
 * - External HTTP/HTTPS websites without UPI parameters (anti-phishing)
 * - Malformed UPI IDs
 */
export function parseUpiQr(rawString) {
  if (!rawString || typeof rawString !== 'string') {
    return {
      success: false,
      error: 'Empty or invalid QR code data received.',
    };
  }

  const trimmed = rawString.trim();

  // Reject explicit non-payment URI schemes
  if (
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('sms:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('ftp:')
  ) {
    return {
      success: false,
      error: 'Unsupported scheme. Expected a UPI payment QR code.',
    };
  }

  // 1. Try EMVCo BharatQR format (common in Indian merchant standees and POS terminals)
  if (trimmed.startsWith('000201')) {
    const emvCoResult = parseEmvCoQr(trimmed);
    if (emvCoResult) {
      return {
        success: true,
        data: emvCoResult,
      };
    }
  }

  // 2. Check if it's a plain UPI ID
  const plainUpiValidation = UpiIdSchema.safeParse(trimmed);
  if (plainUpiValidation.success) {
    return {
      success: true,
      data: {
        raw: trimmed,
        upiId: plainUpiValidation.data,
        merchantName: formatMerchantNameFromUpiId(plainUpiValidation.data),
        amount: null,
        note: null,
        currency: 'INR',
        category: 'Merchant',
        hasFixedAmount: false,
      },
    };
  }

  // Check if string contains an embedded upi://pay URI
  let targetString = trimmed;
  const embeddedUpiMatch = trimmed.match(/upi:\/\/pay[^"'\s]*/i);
  if (embeddedUpiMatch) {
    try {
      targetString = decodeURIComponent(embeddedUpiMatch[0]);
    } catch {
      targetString = embeddedUpiMatch[0];
    }
  }

  // 3. Extract standard parameters (pa, pn, am, cu, tn, mc, tr)
  const pa = extractParam(targetString, 'pa');
  const pn = extractParam(targetString, 'pn');
  const am = extractParam(targetString, 'am');
  const cu = extractParam(targetString, 'cu') || 'INR';
  const tn = extractParam(targetString, 'tn');
  const mc = extractParam(targetString, 'mc');
  const tr = extractParam(targetString, 'tr');

  // Guard against arbitrary web URLs without UPI parameters (anti-phishing security)
  if (
    (trimmed.startsWith('http://') || trimmed.startsWith('https://')) &&
    !pa &&
    !embeddedUpiMatch
  ) {
    return {
      success: false,
      error: 'Security Warning: This QR code points to an external website URL, not a standard UPI payment QR. External links are rejected for your safety.',
    };
  }

  // If `pa` parameter was found
  if (pa) {
    // Validate the UPI ID
    const upiValidation = UpiIdSchema.safeParse(pa);
    if (!upiValidation.success) {
      return {
        success: false,
        error: `Invalid UPI ID format (${pa}): ${upiValidation.error.issues[0]?.message || 'Malformed identifier'}`,
      };
    }

    // Validate amount if present
    let parsedAmount = null;
    let hasFixedAmount = false;
    if (am) {
      const numAm = parseFloat(am);
      const amountValidation = AmountSchema.safeParse(numAm);
      if (amountValidation.success) {
        parsedAmount = amountValidation.data;
        hasFixedAmount = true;
      }
    }

    // Clean merchant name
    let cleanName = pn ? decodeURIComponent(pn).replace(/\+/g, ' ').trim() : '';
    if (!cleanName || cleanName.length === 0) {
      cleanName = formatMerchantNameFromUpiId(pa);
    }

    // Determine category
    let category = 'General Merchant';
    if (mc && MCC_MAP[mc]) {
      category = MCC_MAP[mc];
    } else if (cleanName.toLowerCase().includes('coffee') || cleanName.toLowerCase().includes('cafe') || cleanName.toLowerCase().includes('restaurant')) {
      category = 'Food & Dining';
    } else if (cleanName.toLowerCase().includes('mart') || cleanName.toLowerCase().includes('store') || cleanName.toLowerCase().includes('kirana')) {
      category = 'Grocery & Retail';
    } else if (cleanName.toLowerCase().includes('metro') || cleanName.toLowerCase().includes('rail') || cleanName.toLowerCase().includes('auto')) {
      category = 'Commuter Transport';
    }

    return {
      success: true,
      data: {
        raw: trimmed,
        upiId: upiValidation.data,
        merchantName: cleanName,
        amount: parsedAmount,
        note: tn ? decodeURIComponent(tn).replace(/\+/g, ' ').trim() : null,
        currency: cu.toUpperCase() === 'INR' ? 'INR' : cu.toUpperCase(),
        category,
        merchantCode: mc,
        transactionRef: tr,
        hasFixedAmount,
      },
    };
  }

  // If it explicitly starts with upi://pay but pa is missing
  if (trimmed.toLowerCase().startsWith('upi://pay')) {
    return {
      success: false,
      error: 'Invalid UPI QR: Payee UPI ID (pa) is missing.',
    };
  }

  // 4. Universal Fallback: Search for any valid UPI ID handle in the string
  const genericMatch = trimmed.match(/[a-zA-Z0-9.\-_]{2,64}@[a-zA-Z0-9.\-_]{2,32}/);
  if (genericMatch) {
    const candidate = genericMatch[0];
    const candidateValidation = UpiIdSchema.safeParse(candidate);
    if (candidateValidation.success) {
      return {
        success: true,
        data: {
          raw: trimmed,
          upiId: candidateValidation.data,
          merchantName: formatMerchantNameFromUpiId(candidateValidation.data),
          amount: null,
          note: null,
          currency: 'INR',
          category: 'Merchant',
          hasFixedAmount: false,
        },
      };
    }
  }

  return {
    success: false,
    error: 'Unsupported QR format. Expected a standard UPI payment QR code (upi://pay?...).',
  };
}

/**
 * Derive human-readable name from UPI ID if payee name is not in QR
 * e.g. "coffeehouse@okaxis" -> "Coffeehouse"
 */
function formatMerchantNameFromUpiId(upiId) {
  const [handle] = upiId.split('@');
  if (!handle) return 'Merchant';
  const cleaned = handle.replace(/[^a-zA-Z0-9]/g, ' ').trim();
  if (!cleaned) return 'Merchant';
  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
