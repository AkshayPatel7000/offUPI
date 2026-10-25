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
 * Parses raw QR code string or UPI URI.
 * Handles:
 * 1. Standard UPI URI: `upi://pay?pa=recipient@bank&pn=Recipient+Name&am=250&cu=INR...`
 * 2. Plain UPI ID: `coffeehouse@okaxis`
 * 3. Upper/lower case parameters
 * 4. URL encoded parameters
 *
 * Rejects:
 * - Arbitrary http/https URLs to prevent phishing
 * - Malformed UPI IDs
 * - Unsupported schemes
 */
export function parseUpiQr(rawString) {
  if (!rawString || typeof rawString !== 'string') {
    return {
      success: false,
      error: 'Empty or invalid QR code data received.',
    };
  }

  const trimmed = rawString.trim();

  // Guard against arbitrary web URLs
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return {
      success: false,
      error: 'Security Warning: This QR code points to an external website URL, not a standard UPI payment QR. External links are rejected for your safety.',
    };
  }

  // Check if it's a plain UPI ID
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

  // Standard UPI URI format: upi://pay?...
  if (!trimmed.toLowerCase().startsWith('upi://pay')) {
    return {
      success: false,
      error: 'Unsupported QR format. Expected a standard UPI payment QR code (upi://pay?...).',
    };
  }

  try {
    const questionMarkIndex = trimmed.indexOf('?');
    if (questionMarkIndex === -1) {
      return {
        success: false,
        error: 'Invalid UPI QR: missing payment query parameters.',
      };
    }

    const queryString = trimmed.substring(questionMarkIndex + 1);
    const searchParams = new URLSearchParams(queryString);

    // Extract relevant fields (case-insensitive fallback)
    const getParam = (key) => {
      return searchParams.get(key) || searchParams.get(key.toUpperCase()) || searchParams.get(key.toLowerCase()) || null;
    };

    const pa = getParam('pa'); // Payee VPA / UPI ID
    const pn = getParam('pn'); // Payee name
    const am = getParam('am'); // Amount
    const cu = getParam('cu') || 'INR'; // Currency
    const tn = getParam('tn'); // Transaction note
    const mc = getParam('mc'); // Merchant Category Code
    const tr = getParam('tr'); // Transaction reference

    if (!pa) {
      return {
        success: false,
        error: 'Invalid UPI QR: Payee UPI ID (pa) is missing.',
      };
    }

    // Validate UPI ID
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
  } catch (err) {
    return {
      success: false,
      error: `Failed to parse QR code: ${err.message || 'Unknown parsing error'}`,
    };
  }
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
