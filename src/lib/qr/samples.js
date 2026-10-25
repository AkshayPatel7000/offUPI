/**
 * Realistic Mock UPI QR Codes for demonstration, quick testing, and verification
 * Matches the exact merchants shown in the design flow screenshot!
 */

export const SAMPLE_QR_CODES = [
  {
    id: 'coffee-house',
    title: 'The Coffee House (₹250)',
    subtitle: 'coffeehouse@okaxis • Food & Dining',
    badge: 'Verified Merchant',
    amount: 250,
    raw: 'upi://pay?pa=coffeehouse@okaxis&pn=The+Coffee+House&am=250&cu=INR&tn=Cold+Brew+and+Bagel&mc=5814',
    merchantName: 'The Coffee House',
    upiId: 'coffeehouse@okaxis',
    category: 'Food & Dining',
  },
  {
    id: 'kirana-store',
    title: 'Kirana Store (₹80)',
    subtitle: 'kiranastore@icici • Groceries',
    badge: 'Grocery & Essentials',
    amount: 80,
    raw: 'upi://pay?pa=kiranastore@icici&pn=Kirana+Store&am=80&cu=INR&tn=Daily+Groceries&mc=5411',
    merchantName: 'Kirana Store',
    upiId: 'kiranastore@icici',
    category: 'Grocery & Supermarket',
  },
  {
    id: 'metro-station',
    title: 'Metro Station (₹200)',
    subtitle: 'delhimetro@sbi • Commuter Transport',
    badge: 'Transit',
    amount: 200,
    raw: 'upi://pay?pa=delhimetro@sbi&pn=Metro+Station&am=200&cu=INR&tn=Transit+Ticket&mc=4111',
    merchantName: 'Metro Station',
    upiId: 'delhimetro@sbi',
    category: 'Commuter Transport',
  },
  {
    id: 'local-store-empty',
    title: 'Local Store (No Amount prefilled)',
    subtitle: 'localstore@hdfc • Custom Amount Entry',
    badge: 'Flexible Amount',
    amount: null,
    raw: 'upi://pay?pa=localstore@hdfc&pn=Local+Store&cu=INR',
    merchantName: 'Local Store',
    upiId: 'localstore@hdfc',
    category: 'General Retail',
  },
  {
    id: 'restaurant-dinner',
    title: 'Spice Garden Restaurant (₹320)',
    subtitle: 'spicegarden@yesbank • Dinner Bill',
    badge: 'Restaurant',
    amount: 320,
    raw: 'upi://pay?pa=spicegarden@yesbank&pn=Spice+Garden+Restaurant&am=320&cu=INR&tn=Dinner+Table+4&mc=5812',
    merchantName: 'Spice Garden Restaurant',
    upiId: 'spicegarden@yesbank',
    category: 'Food & Dining',
  },
];
