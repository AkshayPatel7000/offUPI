import { describe, it, expect } from 'vitest';
import { parseUpiQr } from './parser';
import { UpiIdSchema, AmountSchema } from '../validation/schemas';
import { getCarrierEligibility } from '../eligibility/registry';

describe('UPI QR Parsing and Validation', () => {
  it('parses a standard UPI payment QR code with payee, amount, and note', () => {
    const raw = 'upi://pay?pa=coffeehouse@okaxis&pn=The+Coffee+House&am=250&cu=INR&tn=Cold+Brew+and+Bagel&mc=5814';
    const result = parseUpiQr(raw);

    expect(result.success).toBe(true);
    expect(result.data.upiId).toBe('coffeehouse@okaxis');
    expect(result.data.merchantName).toBe('The Coffee House');
    expect(result.data.amount).toBe(250);
    expect(result.data.currency).toBe('INR');
    expect(result.data.note).toBe('Cold Brew and Bagel');
    expect(result.data.category).toBe('Fast Food & Cafes');
  });

  it('parses a QR code without prefilled amount', () => {
    const raw = 'upi://pay?pa=sharmastore@icici&pn=Sharma+Store&cu=INR';
    const result = parseUpiQr(raw);

    expect(result.success).toBe(true);
    expect(result.data.upiId).toBe('sharmastore@icici');
    expect(result.data.amount).toBeNull();
    expect(result.data.hasFixedAmount).toBe(false);
  });

  it('parses a plain UPI ID entered manually', () => {
    const result = parseUpiQr('coffeehouse@okaxis');
    expect(result.success).toBe(true);
    expect(result.data.upiId).toBe('coffeehouse@okaxis');
  });

  it('rejects external HTTP/HTTPS phishing URLs', () => {
    const result = parseUpiQr('https://scam-bank.com/pay');
    expect(result.success).toBe(false);
    expect(result.error).toContain('Security Warning');
  });

  it('rejects malformed UPI ID format', () => {
    const result = parseUpiQr('upi://pay?pa=invalid_without_at_symbol&pn=Fake');
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid UPI ID');
  });

  it('rejects non-UPI schemes', () => {
    const result = parseUpiQr('mailto:someone@example.com');
    expect(result.success).toBe(false);
  });
});

describe('Zod Validation Schemas', () => {
  it('validates correct UPI IDs', () => {
    expect(UpiIdSchema.safeParse('coffeehouse@okaxis').success).toBe(true);
    expect(UpiIdSchema.safeParse('user.name@okhdfcbank').success).toBe(true);
    expect(UpiIdSchema.safeParse('9876543210@paytm').success).toBe(true);
  });

  it('rejects invalid UPI IDs', () => {
    expect(UpiIdSchema.safeParse('nodomain').success).toBe(false);
    expect(UpiIdSchema.safeParse('user@').success).toBe(false);
    expect(UpiIdSchema.safeParse('@bank').success).toBe(false);
  });

  it('validates amount limits', () => {
    expect(AmountSchema.safeParse(250).success).toBe(true);
    expect(AmountSchema.safeParse(1).success).toBe(true);
    expect(AmountSchema.safeParse(100000).success).toBe(true);
    expect(AmountSchema.safeParse(0).success).toBe(false);
    expect(AmountSchema.safeParse(-50).success).toBe(false);
    expect(AmountSchema.safeParse(100001).success).toBe(false);
  });
});

describe('Carrier Eligibility Registry', () => {
  it('returns verified Airtel registry with *99# USSD channel', () => {
    const airtel = getCarrierEligibility('airtel');
    expect(airtel.name).toBe('Airtel');
    expect(airtel.primaryMethod).toBe('USSD_99');
    expect(airtel.dialCode).toBe('*99#');
  });

  it('returns verified Jio registry with 124PAY Voice channel', () => {
    const jio = getCarrierEligibility('jio');
    expect(jio.name).toBe('Jio');
    expect(jio.primaryMethod).toBe('VOICE_124PAY');
    expect(jio.dialCode).toBe('124PAY');
  });

  it('gracefully handles unknown carrier without crashing', () => {
    const unknown = getCarrierEligibility('unknown-carrier');
    expect(unknown.status).toBe('Unable to determine');
  });
});
