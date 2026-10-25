/**
 * Configurable Eligibility Registry for Offline Payment Channels
 *
 * Grounded in official NPCI *99# (NUUP) and Voice UPI (123PAY / 124PAY) specifications.
 * Tracks carrier support, verification status, service codes, and constraints.
 */

export const ELIGIBILITY_STATUS = {
  VERIFIED: 'Supported and verified',
  POTENTIALLY_SUPPORTED: 'Potentially supported',
  NOT_VERIFIED: 'Not verified',
  UNSUPPORTED: 'Unsupported',
  UNABLE_TO_DETERMINE: 'Unable to determine',
};

export const CARRIER_REGISTRY = [
  {
    id: 'airtel',
    name: 'Airtel',
    brandColor: '#ED1C24',
    logoType: 'airtel',
    status: ELIGIBILITY_STATUS.VERIFIED,
    primaryMethod: 'USSD_99',
    primaryMethodTitle: 'Supports USSD based UPI',
    primaryMethodSubtitle: 'Pay using *99#',
    dialCode: '*99#',
    lastVerifiedDate: '2026-10-15',
    verificationSource: 'NPCI NUUP Partner Telecom Directory & Field Testing',
    technology: 'USSD (Unstructured Supplementary Service Data) Channel',
    requiresMobileData: false,
    requiresCellularSignal: true,
    supportedBanks: 'All major UPI-member banks (SBI, HDFC, ICICI, Axis, PNB, etc.)',
    notes: 'Cellular network signaling session. Carrier fee of up to ₹0.50 may be levied by telecom as per TRAI guidelines.',
    supportedChannels: [
      {
        channel: 'USSD',
        code: '*99#',
        label: 'Pay using *99# (Standard USSD)',
        status: ELIGIBILITY_STATUS.VERIFIED,
      },
      {
        channel: 'VOICE',
        code: '124PAY',
        number: '124729',
        label: '124PAY Voice IVR',
        status: ELIGIBILITY_STATUS.POTENTIALLY_SUPPORTED,
      },
    ],
  },
  {
    id: 'jio',
    name: 'Jio',
    brandColor: '#0A2885',
    logoType: 'jio',
    status: ELIGIBILITY_STATUS.VERIFIED,
    primaryMethod: 'VOICE_124PAY',
    primaryMethodTitle: 'Supports call based payment',
    primaryMethodSubtitle: 'Pay using 124PAY (IVR call)',
    dialCode: '124PAY',
    dialNumber: '124729',
    fallbackNumber: '08045163666',
    lastVerifiedDate: '2026-09-28',
    verificationSource: 'RBI / NPCI 123PAY / 124PAY Voice Consortium Documentation',
    technology: 'Standard GSM Voice Call / IVR (Interactive Voice Response)',
    requiresMobileData: false,
    requiresCellularSignal: true,
    supportedBanks: 'NPCI Onboarded Banks supporting Voice Authentication',
    notes: 'Because Jio is a pure 4G/5G VoLTE network, native 2G USSD (*99#) is restricted on some SIM profiles. Voice-based 124PAY (IVR) is recommended.',
    supportedChannels: [
      {
        channel: 'VOICE',
        code: '124PAY',
        number: '124729',
        label: 'Pay using 124PAY (Interactive Voice Call)',
        status: ELIGIBILITY_STATUS.VERIFIED,
      },
      {
        channel: 'USSD',
        code: '*99#',
        label: 'USSD *99#',
        status: ELIGIBILITY_STATUS.NOT_VERIFIED,
        notes: 'May fail on Jio handsets due to carrier USSD routing restrictions.',
      },
    ],
  },
  {
    id: 'vi',
    name: 'Vodafone Idea (Vi)',
    brandColor: '#E60000',
    logoType: 'vi',
    status: ELIGIBILITY_STATUS.VERIFIED,
    primaryMethod: 'USSD_99',
    primaryMethodTitle: 'Supports USSD based UPI',
    primaryMethodSubtitle: 'Pay using *99#',
    dialCode: '*99#',
    lastVerifiedDate: '2026-08-10',
    verificationSource: 'NPCI National Unified USSD Platform (NUUP)',
    technology: 'USSD Signaling Protocol',
    requiresMobileData: false,
    requiresCellularSignal: true,
    supportedBanks: 'All major UPI banks',
    notes: 'Works across 2G, 3G, and 4G network coverage.',
    supportedChannels: [
      {
        channel: 'USSD',
        code: '*99#',
        label: 'Pay using *99#',
        status: ELIGIBILITY_STATUS.VERIFIED,
      },
    ],
  },
  {
    id: 'bsnl',
    name: 'BSNL',
    brandColor: '#005BBB',
    logoType: 'bsnl',
    status: ELIGIBILITY_STATUS.VERIFIED,
    primaryMethod: 'USSD_99',
    primaryMethodTitle: 'Supports USSD based UPI',
    primaryMethodSubtitle: 'Pay using *99#',
    dialCode: '*99#',
    lastVerifiedDate: '2026-07-22',
    verificationSource: 'BSNL National USSD Portal',
    technology: 'USSD GSM Gateway',
    requiresMobileData: false,
    requiresCellularSignal: true,
    supportedBanks: 'All major UPI banks',
    notes: 'Extensive rural coverage over 2G/3G networks.',
    supportedChannels: [
      {
        channel: 'USSD',
        code: '*99#',
        label: 'Pay using *99#',
        status: ELIGIBILITY_STATUS.VERIFIED,
      },
    ],
  },
];

/**
 * Gets carrier eligibility information by carrier ID
 */
export function getCarrierEligibility(carrierId) {
  const carrier = CARRIER_REGISTRY.find((c) => c.id === carrierId);
  if (!carrier) {
    return {
      id: 'unknown',
      name: 'Other / Unknown Carrier',
      brandColor: '#64748B',
      status: ELIGIBILITY_STATUS.UNABLE_TO_DETERMINE,
      primaryMethod: 'USSD_99',
      dialCode: '*99#',
      notes: 'Browser sandbox cannot query telecom SIM profiles directly. Try *99# or 124PAY manually.',
      lastVerifiedDate: 'Unverified',
    };
  }
  return carrier;
}
