import { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Check,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { MerchantAvatar } from '../components/MerchantAvatar';

export function QrDetailsScreen({ qrData, onBack, onContinue, onShowToast }) {
  const [copied, setCopied] = useState(false);

  const handleCopyUpi = () => {
    if (qrData?.upiId) {
      navigator.clipboard.writeText(qrData.upiId);
      setCopied(true);
      if (onShowToast) onShowToast('UPI ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="screen-container">
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
        <h2>QR code details</h2>
      </div>

      {/* Merchant Profile */}
      <div style={{ textAlign: 'center', margin: '14px 0 20px' }}>
        <MerchantAvatar category={qrData?.category} size={70} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            marginTop: 12,
            marginBottom: 2,
          }}
        >
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
            {qrData?.merchantName || 'The Coffee House'}
          </h1>
          <CheckCircle2 size={18} color="#16A34A" />
        </div>

        {/* Copyable UPI ID Box */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: 'var(--bg-card-soft)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            marginTop: 6,
            border: '1px solid var(--border-light)',
          }}
        >
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
            {qrData?.upiId}
          </span>
          <button
            type="button"
            onClick={handleCopyUpi}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--primary-blue)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 2,
            }}
            title="Copy UPI ID"
          >
            {copied ? <Check size={16} color="#16A34A" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* Parameters Card */}
      <div className="minimal-card" style={{ marginBottom: 16 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: 12,
          }}
        >
          Detected from QR code
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Name</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {qrData?.merchantName}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>UPI ID</span>
            <span style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>
              {qrData?.upiId}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Category</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              {qrData?.category || 'Food & Dining'}
            </span>
          </div>

          {qrData?.note && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Note</span>
              <span style={{ color: 'var(--text-muted)' }}>{qrData.note}</span>
            </div>
          )}
        </div>
      </div>

      {/* Safety Notice */}
      <div
        style={{
          backgroundColor: 'var(--bg-card-soft)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 12px',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          marginBottom: 'auto',
        }}
      >
        <ShieldAlert size={16} color="var(--accent-amber)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          Confirm recipient name matches the counter before authorizing payment.
        </div>
      </div>

      {/* Primary CTA */}
      <div style={{ marginTop: 20 }}>
        <button
          type="button"
          className="btn-primary"
          onClick={onContinue}
        >
          <span>Continue to pay</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
