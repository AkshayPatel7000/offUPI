/**
 * Local transaction preparation and history storage
 * Purely offline-first: runs locally in the user's browser without backend dependency.
 *
 * NOTE: Transactions stored here represent user-prepared or user-reported transactions.
 * They are NEVER marked as completed bank payments unless the user explicitly reports confirmation.
 */

const STORAGE_KEY = 'offpay_prepared_transactions_v1';
const PREFS_KEY = 'offpay_user_preferences_v1';

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-101',
    merchantName: 'The Coffee House',
    upiId: 'coffeehouse@okaxis',
    amount: 250,
    note: 'Cold Brew and Bagel',
    category: 'Food & Dining',
    method: 'USSD_99',
    carrier: 'Airtel',
    status: 'initiated', // 'initiated' | 'successful' | 'pending' | 'failed'
    statusSource: 'user_reported',
    timestamp: '2026-10-28T17:42:00.000Z',
    formattedTime: '5:42 PM',
    group: 'Today',
    dialCode: '*99#',
  },
  {
    id: 'tx-102',
    merchantName: 'Local Store',
    upiId: 'localstore@hdfc',
    amount: 120,
    note: 'Stationery and pens',
    category: 'General Retail',
    method: 'USSD_99',
    carrier: 'Airtel',
    status: 'successful',
    statusSource: 'user_reported',
    timestamp: '2026-10-28T12:10:00.000Z',
    formattedTime: '12:10 PM',
    group: 'Today',
    dialCode: '*99#',
  },
  {
    id: 'tx-103',
    merchantName: 'Kirana Store',
    upiId: 'kiranastore@icici',
    amount: 80,
    note: 'Milk and bread',
    category: 'Grocery & Supermarket',
    method: 'VOICE_124PAY',
    carrier: 'Jio',
    status: 'successful',
    statusSource: 'user_reported',
    timestamp: '2026-10-28T10:22:00.000Z',
    formattedTime: '10:22 AM',
    group: 'Today',
    dialCode: '124PAY',
  },
  {
    id: 'tx-104',
    merchantName: 'Metro Station',
    upiId: 'delhimetro@sbi',
    amount: 200,
    note: 'Smart card recharge',
    category: 'Commuter Transport',
    method: 'USSD_99',
    carrier: 'Airtel',
    status: 'successful',
    statusSource: 'user_reported',
    timestamp: '2026-10-27T18:15:00.000Z',
    formattedTime: '6:15 PM',
    group: 'Yesterday',
    dialCode: '*99#',
  },
  {
    id: 'tx-105',
    merchantName: 'Restaurant',
    upiId: 'restaurant@yesbank',
    amount: 320,
    note: 'Lunch special',
    category: 'Food & Dining',
    method: 'VOICE_124PAY',
    carrier: 'Jio',
    status: 'failed',
    statusSource: 'user_reported',
    timestamp: '2026-10-27T13:30:00.000Z',
    formattedTime: '1:30 PM',
    group: 'Yesterday',
    dialCode: '124PAY',
  },
];

export function getStoredTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_TRANSACTIONS;
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

export function saveTransaction(tx) {
  try {
    const current = getStoredTransactions();
    const newTx = {
      ...tx,
      id: tx.id || `tx-${Date.now()}`,
      timestamp: tx.timestamp || new Date().toISOString(),
      formattedTime: tx.formattedTime || formatTime(new Date()),
      group: 'Today',
      statusSource: 'user_reported',
    };
    const updated = [newTx, ...current.filter((item) => item.id !== newTx.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newTx;
  } catch (e) {
    console.error('Failed to save transaction locally', e);
    return tx;
  }
}

export function updateTransactionStatus(id, newStatus) {
  try {
    const current = getStoredTransactions();
    const updated = current.map((tx) =>
      tx.id === id ? { ...tx, status: newStatus, statusSource: 'user_reported' } : tx
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to update transaction status', e);
    return getStoredTransactions();
  }
}

export function clearStoredTransactions() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch {
    return [];
  }
}

export function getUserPreferences() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) {
      const defaults = {
        defaultCarrier: 'airtel',
        darkMode: false,
        simSlot: 'SIM 1 (Bank Linked)',
        offlineSimulated: false,
      };
      localStorage.setItem(PREFS_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  } catch {
    return {
      defaultCarrier: 'airtel',
      darkMode: false,
      simSlot: 'SIM 1 (Bank Linked)',
      offlineSimulated: false,
    };
  }
}

export function saveUserPreferences(prefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save preferences', e);
  }
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
