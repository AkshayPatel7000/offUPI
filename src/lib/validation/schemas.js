import { z } from 'zod';

/**
 * Zod validation schema for Indian UPI IDs (Virtual Payment Address - VPA)
 * Matches standard handles like coffeehouse@okaxis, merchant@icici, user@upi, etc.
 */
export const UpiIdSchema = z
  .string()
  .trim()
  .min(3, 'UPI ID must be at least 3 characters long')
  .max(100, 'UPI ID cannot exceed 100 characters')
  .regex(
    /^[a-zA-Z0-9.\-_]{2,64}@[a-zA-Z0-9.\-_]{2,32}$/,
    'Invalid UPI ID format. Expected format: username@bankhandle (e.g. coffeehouse@okaxis)'
  );

/**
 * Zod schema for transaction amount (INR)
 * UPI has a standard per-transaction limit of ₹1,00,000 (some categories allow more)
 * Minimum ₹1, maximum ₹1,00,000
 */
export const AmountSchema = z
  .number({ invalid_type_error: 'Amount must be a valid number' })
  .positive('Amount must be greater than zero')
  .min(1, 'Minimum payment amount is ₹1')
  .max(100000, 'Maximum allowed amount per offline transaction is ₹1,00,000');

/**
 * Zod schema for UPI QR Code raw payload
 */
export const UpiPayloadSchema = z.object({
  pa: UpiIdSchema, // Payee UPI ID (required)
  pn: z.string().trim().max(100).optional().default('Merchant'), // Payee Name
  am: z.string().optional().nullable(), // Amount (optional in static QRs)
  cu: z.string().optional().default('INR'), // Currency (default INR)
  tn: z.string().trim().max(120).optional().nullable(), // Transaction note
  mc: z.string().optional().nullable(), // Merchant category code
  tr: z.string().optional().nullable(), // Transaction reference ID
  mode: z.string().optional().nullable(),
  orgid: z.string().optional().nullable(),
});

/**
 * Schema for stored transaction record
 */
export const TransactionRecordSchema = z.object({
  id: z.string(),
  merchantName: z.string(),
  upiId: UpiIdSchema,
  amount: AmountSchema,
  note: z.string().optional().nullable(),
  category: z.string().default('Food & Dining'),
  method: z.enum(['USSD_99', 'VOICE_124PAY', 'MANUAL_DIAL']),
  carrier: z.string(),
  status: z.enum(['initiated', 'successful', 'pending', 'failed']),
  statusSource: z.enum(['user_reported', 'unverified']),
  timestamp: z.string(),
  dialCode: z.string(),
});
