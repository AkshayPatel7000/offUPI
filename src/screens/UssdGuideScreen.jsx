import { useState } from 'react';
import {
  ArrowLeft,
  Phone,
  Lightbulb,
  Copy,
  Check,
} from 'lucide-react';
import { CarrierLogo } from '../components/CarrierLogo';

export function UssdGuideScreen({
  qrData,
  paymentData,
  carrier,
  onBack,
  onOpenDialer,
  onShowToast,
}) {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAmt, setCopiedAmt] = useState(false);

  const upiId = qrData?.upiId || 'coffeehouse@okaxis';
  const amount = paymentData?.amount || qrData?.amount || 250;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    if (onShowToast) onShowToast('UPI ID copied');
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopyAmt = () => {
    navigator.clipboard.writeText(String(amount));
    setCopiedAmt(true);
    if (onShowToast) onShowToast('Amount copied');
    setTimeout(() => setCopiedAmt(false), 2000);
  };

  return (
    <div className="screen-container" style={{ paddingBottom: 110 }}>
      {/* Header */}
      <div className="nav-header">
        <button
          type="button"
          className="back-btn"
          onClick={onBack}
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <h2>Pay using USSD</h2>
      </div>

      {/* Carrier Info */}
      <div style={{ textAlign: 'center', margin: '4px 0 16px' }}>
        <CarrierLogo carrierId={carrier?.id || 'airtel'} size={46} />
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginTop: 8 }}>
          {carrier?.name || 'Airtel'} – USSD based UPI
        </h3>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
          You will be redirected to your phone dialer with *99#.
        </p>
      </div>

      {/* Visual USSD Pathway Flowchart */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--primary-blue-subtle)',
          border: '1px solid var(--border-light)',
          marginBottom: 14,
          fontSize: 11.5,
          fontWeight: 700,
          color: 'var(--primary-blue)',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          gap: 6,
        }}
      >
        <span>*99#</span>
        <span>➔</span>
        <span>1 (Send)</span>
        <span>➔</span>
        <span>3 (UPI ID)</span>
        <span>➔</span>
        <span>Amount</span>
        <span>➔</span>
        <span>UPI PIN</span>
      </div>

      {/* Step by Step Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {[
          { num: 1, title: 'Dial *99#', desc: 'Call from your bank-linked SIM card' },
          { num: 2, title: 'Reply "1" for Send Money', desc: 'Main menu has: 1 Send Money, 3 Balance, 4 Profile, 5 Pending, 6 Txns, 7 UPI PIN' },
          { num: 3, title: 'Reply "3" for UPI ID', desc: 'Submenu has: 1 Mobile No, 3 UPI ID, 4 Saved Benfi, 5 IFSC/A/C' },
          { num: 4, title: 'Enter Beneficiary UPI ID', desc: `Enter ${upiId} (tap copy below)` },
          { num: 5, title: 'Enter Payment Amount', desc: `Enter ₹${amount}` },
          { num: 6, title: 'Authorize with UPI PIN', desc: 'Enter your 4 or 6 digit PIN on secure telecom prompt' },
        ].map((step) => (
          <div
            key={step.num}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                backgroundColor: 'var(--primary-blue-subtle)',
                color: 'var(--primary-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 11.5,
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              {step.num}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                {step.title}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.35 }}>
                {step.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Big Action Button */}
      <button
        type="button"
        className="btn-primary"
        onClick={() => onOpenDialer('*99#')}
        style={{ marginBottom: 12 }}
      >
        <Phone size={18} />
        <span>Open Dialer with *99#</span>
      </button>

      {/* Tip Card */}
      <div
        style={{
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: 'var(--radius-md)',
          padding: '10px 12px',
          display: 'flex',
          gap: 8,
          alignItems: 'flex-start',
        }}
      >
        <Lightbulb size={16} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 11.5, color: '#92400E', lineHeight: 1.4 }}>
          <strong>Tip:</strong> Your UPI ID ({upiId}) and amount (₹{amount}) will be shown below for easy input.
        </div>
      </div>

      {/* Bottom Sticky Copy Drawer */}
      <div className="bottom-sticky-drawer">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              UPI ID
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              {upiId}
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopyUpi}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: 'var(--primary-blue-subtle)',
              color: 'var(--primary-blue)',
              fontSize: 11.5,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {copiedUpi ? <Check size={13} color="#16A34A" /> : <Copy size={13} />}
            <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Amount
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--primary-blue)' }}>
              ₹{amount}
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopyAmt}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: 'var(--primary-blue-subtle)',
              color: 'var(--primary-blue)',
              fontSize: 11.5,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {copiedAmt ? <Check size={13} color="#16A34A" /> : <Copy size={13} />}
            <span>{copiedAmt ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
