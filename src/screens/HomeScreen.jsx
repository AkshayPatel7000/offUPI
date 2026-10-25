import {
  QrCode,
  Keyboard,
  Image as ImageIcon,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { SAMPLE_QR_CODES } from '../lib/qr/samples';
import { CarrierLogo } from '../components/CarrierLogo';

export function HomeScreen({
  onNavigate,
  onSelectSampleQr,
  carrier = { id: 'airtel', name: 'Airtel', code: '*99#' },
  onSwitchCarrier,
}) {
  return (
    <div className="screen-container">
      {/* Minimal Offline Channel Status Bar */}
      <div className="network-status-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <CarrierLogo carrierId={carrier.id} size={28} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>
                {carrier.name}
              </span>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  backgroundColor: 'var(--accent-green-bg)',
                  color: 'var(--accent-green-text)',
                  padding: '2px 7px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {carrier.code || '*99#'}
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              Offline telecom ready
            </div>
          </div>
        </div>

        {onSwitchCarrier && (
          <button
            type="button"
            onClick={onSwitchCarrier}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--primary-blue)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            Change
          </button>
        )}
      </div>

      {/* Main Interactive Scan & Pay Hero Card */}
      <div
        className="scan-hero-card"
        onClick={() => onNavigate('scan')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onNavigate('scan');
          }
        }}
      >
        <div className="scan-viewfinder-frame">
          <div className="viewfinder-corner corner-tl" />
          <div className="viewfinder-corner corner-tr" />
          <div className="viewfinder-corner corner-bl" />
          <div className="viewfinder-corner corner-br" />
          <QrCode size={44} strokeWidth={2.2} />
        </div>

        <h2 className="scan-hero-title">Scan any UPI QR</h2>
        <p className="scan-hero-subtitle">
          Pay merchants without internet using telecom USSD (*99#) or Voice call.
        </p>

        <div className="scan-badge-pill">
          <QrCode size={15} />
          <span>Tap to Scan</span>
        </div>
      </div>

      {/* 2 Quick Actions Row */}
      <div className="quick-action-row">
        <button
          type="button"
          className="quick-action-pill"
          onClick={() => onNavigate('scan', { manualMode: true })}
        >
          <Keyboard size={16} color="var(--primary-blue)" />
          <span>Enter UPI ID</span>
        </button>

        <button
          type="button"
          className="quick-action-pill"
          onClick={() => onNavigate('scan', { uploadMode: true })}
        >
          <ImageIcon size={16} color="var(--primary-blue)" />
          <span>Upload QR</span>
        </button>
      </div>

      {/* Quick Demo Presets */}
      <div className="presets-section">
        <div className="presets-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={13} color="var(--primary-blue)" />
            <span className="presets-header-title">Quick Demo Presets</span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>1-Tap Pay</span>
        </div>

        <div className="presets-grid">
          {SAMPLE_QR_CODES.slice(0, 3).map((item) => (
            <button
              key={item.id}
              type="button"
              className="preset-card-btn"
              onClick={() => onSelectSampleQr(item)}
            >
              <div
                className="preset-icon-circle"
                style={{
                  backgroundColor:
                    item.category === 'Food & Dining'
                      ? '#FEF3C7'
                      : item.category === 'Shopping'
                      ? '#E0F2FE'
                      : '#DCFCE7',
                }}
              >
                {item.category === 'Food & Dining' ? '☕' : item.category === 'Shopping' ? '🛒' : '🅿️'}
              </div>
              <div className="preset-card-name">{item.merchantName}</div>
              <div className="preset-card-amount">₹{item.amount || 'Custom'}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Security & Offline Trust Pill */}
      <div className="trust-security-pill">
        <ShieldCheck size={16} color="var(--accent-green)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.35 }}>
          <strong>100% Offline & Private.</strong> Runs on your device; never asks for secret UPI PIN or OTP.
        </div>
      </div>
    </div>
  );
}
