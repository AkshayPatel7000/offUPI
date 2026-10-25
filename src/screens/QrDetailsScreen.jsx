import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Check,
  Phone,
  Zap,
  Hash,
  Sparkles,
} from 'lucide-react';
import { MerchantAvatar } from '../components/MerchantAvatar';
import { CarrierLogo } from '../components/CarrierLogo';
import { CARRIER_REGISTRY } from '../lib/eligibility/registry';

export function QrDetailsScreen({
  qrData,
  carrier,
  onSwitchCarrier,
  onBack,
  onOpenDialer,
  onShowToast,
}) {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedMob, setCopiedMob] = useState(false);

  // Fallback defaults if scanned data has missing fields
  const upiId = qrData?.upiId || 'merchant@okaxis';
  const merchantName = qrData?.merchantName || 'Merchant Payee';
  const hasFixedAmount = Boolean(qrData?.hasFixedAmount);
  const fixedAmount = qrData?.amount || null;

  // Check if UPI ID contains a 10-digit Indian mobile number
  const mobileMatch = upiId.match(/^(\+?91)?([6-9]\d{9})/i);
  const detectedMobile = mobileMatch ? mobileMatch[2] : null;

  // Auto-copy UPI ID to clipboard as soon as we reach the detail screen
  useEffect(() => {
    if (upiId) {
      try {
        navigator.clipboard.writeText(upiId).then(() => {
          setCopiedUpi(true);
          if (onShowToast) onShowToast('UPI ID copied to clipboard');
          setTimeout(() => setCopiedUpi(false), 2500);
        }).catch(() => {
          // Clipboard write requires user activation on some browser security settings
        });
      } catch {
        // Safe ignore
      }
    }
  }, [upiId, onShowToast]);

  // USSD Shortcut Selection: *99*1*3# (Direct to UPI ID - default), *99*1*1# (Mobile), or *99# (Standard)
  const [ussdShortcut, setUssdShortcut] = useState('*99*1*3#');

  const activeCarrier = carrier || CARRIER_REGISTRY[0];
  const isJioVoice = activeCarrier?.id === 'jio';
  const dialCode = isJioVoice ? '124PAY' : ussdShortcut;
  const telNumber = isJioVoice ? '08045163666' : ussdShortcut;
  // In tel: URLs, the hash '#' must be URL-encoded as '%23' for phone dialers
  const telUri = isJioVoice
    ? 'tel:08045163666'
    : `tel:${telNumber.replace(/#/g, '%23')}`;

  const handleCopyUpi = () => {
    if (upiId) {
      navigator.clipboard.writeText(upiId);
      setCopiedUpi(true);
      if (onShowToast) onShowToast('UPI ID copied to clipboard');
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const handleCopyMobile = () => {
    if (detectedMobile) {
      navigator.clipboard.writeText(detectedMobile);
      setCopiedMob(true);
      if (onShowToast) onShowToast('Mobile number copied');
      setTimeout(() => setCopiedMob(false), 2000);
    }
  };

  const handleCarrierSelect = (newCarrier) => {
    if (onSwitchCarrier) {
      onSwitchCarrier(newCarrier);
      if (onShowToast) onShowToast(`SIM: ${newCarrier.name}`);
    }
  };

  const handleDialClick = () => {
    if (onOpenDialer) {
      onOpenDialer(dialCode, activeCarrier);
    }
  };

  return (
    <div className="screen-layout-wrapper">
      <div className="screen-container qr-details-scrollable">
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
          <div>
            <h2>Pay Offline</h2>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              Details & step-by-step guidance
            </div>
          </div>
        </div>

        {/* 1. Merchant Profile Card */}
        <div
          className="minimal-card"
          style={{
            textAlign: 'center',
            padding: '18px 14px',
            marginBottom: 12,
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <MerchantAvatar category={qrData?.category} size={64} />
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              marginBottom: 2,
            }}
          >
            <h1 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
              {merchantName}
            </h1>
            <CheckCircle2 size={17} color="#16A34A" />
          </div>

          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 10 }}>
            {qrData?.category || 'Merchant'} • Verified Payee
          </div>

          {/* Copyable UPI ID Box */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              backgroundColor: 'var(--bg-card-soft)',
              padding: '7px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-light)',
              maxWidth: '100%',
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: 'var(--primary-blue)',
                fontWeight: 700,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {upiId}
            </span>
            <button
              type="button"
              onClick={handleCopyUpi}
              style={{
                border: 'none',
                background: 'transparent',
                color: copiedUpi ? '#16A34A' : 'var(--primary-blue)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 4px',
                fontSize: 11.5,
                fontWeight: 700,
              }}
              title="Copy UPI ID"
            >
              {copiedUpi ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Pre-encoded amount from invoice QR if present */}
          {hasFixedAmount && fixedAmount && (
            <div style={{ marginTop: 10 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  backgroundColor: 'var(--primary-blue-subtle)',
                  color: 'var(--primary-blue)',
                  padding: '3px 12px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                Amount in QR: ₹{fixedAmount}
              </span>
            </div>
          )}

          {qrData?.note && (
            <div style={{ marginTop: 8, fontSize: 11.5, color: 'var(--text-muted)' }}>
              Note: {qrData.note}
            </div>
          )}
        </div>

        {/* 2. SIM / Network Switcher */}
        <div className="minimal-card" style={{ marginBottom: 12 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Select Your SIM Network
            </span>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: isJioVoice ? '#0A2885' : 'var(--primary-blue)',
              }}
            >
              {isJioVoice ? 'Voice Call (124PAY)' : 'USSD (*99#)'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {CARRIER_REGISTRY.map((c) => {
              const isSelected = activeCarrier.id === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleCarrierSelect(c)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 4px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '1.5px solid var(--primary-blue)' : '1px solid var(--border-light)',
                    backgroundColor: isSelected ? 'var(--primary-blue-subtle)' : 'var(--bg-card-soft)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <CarrierLogo carrierId={c.id} size={28} />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: isSelected ? 'var(--primary-blue)' : 'var(--text-primary)',
                    }}
                  >
                    {c.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Dialing Shortcut Selector (for USSD Networks) */}
        {!isJioVoice && (
          <div className="minimal-card" style={{ marginBottom: 12 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Zap size={13} color="var(--primary-blue)" fill="currentColor" />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  USSD Shortcut
                </span>
              </div>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  backgroundColor: ussdShortcut === '*99*1*3#' ? 'var(--accent-green-bg)' : 'var(--bg-card-soft)',
                  color: ussdShortcut === '*99*1*3#' ? 'var(--accent-green-text)' : 'var(--text-muted)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {ussdShortcut === '*99*1*3#' ? '⚡ Skips 2 Menus' : ussdShortcut === '*99*1*1#' ? '⚡ Direct Mobile' : 'Full Menu'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: detectedMobile ? 'repeat(3, 1fr)' : '1fr 1fr', gap: 6 }}>
              <button
                type="button"
                onClick={() => {
                  setUssdShortcut('*99*1*3#');
                  if (onShowToast) onShowToast('*99*1*3# selected (Direct to UPI ID)');
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 2,
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-md)',
                  border: ussdShortcut === '*99*1*3#' ? '1.5px solid var(--primary-blue)' : '1px solid var(--border-light)',
                  backgroundColor: ussdShortcut === '*99*1*3#' ? 'var(--primary-blue-subtle)' : 'var(--bg-card-soft)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Sparkles size={13} color="var(--primary-blue)" />
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: ussdShortcut === '*99*1*3#' ? 'var(--primary-blue)' : 'var(--text-primary)' }}>
                    *99*1*3#
                  </span>
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.25 }}>
                  Direct UPI ID
                </span>
              </button>

              {detectedMobile && (
                <button
                  type="button"
                  onClick={() => {
                    setUssdShortcut('*99*1*1#');
                    if (onShowToast) onShowToast('*99*1*1# selected (Direct to Mobile)');
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 2,
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: ussdShortcut === '*99*1*1#' ? '1.5px solid var(--primary-blue)' : '1px solid var(--border-light)',
                    backgroundColor: ussdShortcut === '*99*1*1#' ? 'var(--primary-blue-subtle)' : 'var(--bg-card-soft)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Phone size={13} color="var(--primary-blue)" />
                    <span style={{ fontSize: 12.5, fontWeight: 800, color: ussdShortcut === '*99*1*1#' ? 'var(--primary-blue)' : 'var(--text-primary)' }}>
                      *99*1*1#
                    </span>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.25 }}>
                    Direct Mobile
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setUssdShortcut('*99#');
                  if (onShowToast) onShowToast('*99# selected (Standard Menu)');
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 2,
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-md)',
                  border: ussdShortcut === '*99#' ? '1.5px solid var(--primary-blue)' : '1px solid var(--border-light)',
                  backgroundColor: ussdShortcut === '*99#' ? 'var(--primary-blue-subtle)' : 'var(--bg-card-soft)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Hash size={13} color="var(--text-secondary)" />
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: ussdShortcut === '*99#' ? 'var(--primary-blue)' : 'var(--text-primary)' }}>
                    *99#
                  </span>
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.25 }}>
                  Standard Menu
                </span>
              </button>
            </div>
          </div>
        )}

        {/* 4. Step-by-Step Guidance ("What you need to do") */}
        <div className="minimal-card" style={{ marginBottom: 14 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 10,
            }}
          >
            What you need to do
          </div>

          {/* Visual Flowchart Strip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 10px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-blue-subtle)',
              border: '1px solid var(--border-light)',
              marginBottom: 12,
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--primary-blue)',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            {isJioVoice ? (
              <>
                <span>Call 124PAY</span>
                <span>➔</span>
                <span>Select Language</span>
                <span>➔</span>
                <span>Say / Enter UPI ID</span>
                <span>➔</span>
                <span>UPI PIN</span>
              </>
            ) : ussdShortcut === '*99*1*3#' ? (
              <>
                <span>⚡ *99*1*3# (Direct)</span>
                <span>➔</span>
                <span>Paste UPI ID</span>
                <span>➔</span>
                <span>Enter Amount</span>
                <span>➔</span>
                <span>UPI PIN</span>
              </>
            ) : ussdShortcut === '*99*1*1#' ? (
              <>
                <span>📱 *99*1*1# (Mobile)</span>
                <span>➔</span>
                <span>Paste Mobile</span>
                <span>➔</span>
                <span>Enter Amount</span>
                <span>➔</span>
                <span>UPI PIN</span>
              </>
            ) : (
              <>
                <span>Dial *99#</span>
                <span>➔</span>
                <span>1 (Send)</span>
                <span>➔</span>
                <span>3 (UPI ID)</span>
                <span>➔</span>
                <span>Enter Amount</span>
                <span>➔</span>
                <span>UPI PIN</span>
              </>
            )}
          </div>

          {/* Numbered Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {isJioVoice ? (
              [
                {
                  num: 1,
                  title: 'Open Phone Dialer',
                  desc: 'Tap the button below. Your dialer will open with NPCI 123PAY (08045163666).',
                },
                {
                  num: 2,
                  title: 'Select Language',
                  desc: 'Listen to the automated voice prompts and choose your preferred language.',
                },
                {
                  num: 3,
                  title: 'Enter Merchant UPI ID',
                  desc: `Speak or keypad-type ${upiId} (already copied to your clipboard).`,
                },
                {
                  num: 4,
                  title: 'Enter Amount & UPI PIN',
                  desc: 'State or enter the payment amount and enter your secret UPI PIN to complete.',
                },
              ].map((step) => (
                <div
                  key={step.num}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-card-soft)',
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-blue)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 800,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1, lineHeight: 1.35 }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))
            ) : ussdShortcut === '*99*1*3#' ? (
              [
                {
                  num: 1,
                  title: 'Open Phone Dialer (*99*1*3#)',
                  desc: 'Tap button below. Directly skips menus and opens the UPI ID prompt.',
                },
                {
                  num: 2,
                  title: 'Paste Beneficiary UPI ID',
                  desc: `Direct prompt asks "Enter Beneficiary UPI ID:". Paste ${upiId} (already copied).`,
                },
                {
                  num: 3,
                  title: 'Enter Amount & UPI PIN',
                  desc: 'Enter payment amount and authorize with your secret UPI PIN to complete payment.',
                },
              ].map((step) => (
                <div
                  key={step.num}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-card-soft)',
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-blue)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 800,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1, lineHeight: 1.35 }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))
            ) : ussdShortcut === '*99*1*1#' ? (
              [
                {
                  num: 1,
                  title: 'Open Phone Dialer (*99*1*1#)',
                  desc: 'Tap button below. Directly asks for Beneficiary Mobile Number.',
                },
                {
                  num: 2,
                  title: 'Paste Beneficiary Mobile No',
                  desc: `Enter ${detectedMobile || upiId} (tap copy below).`,
                },
                {
                  num: 3,
                  title: 'Enter Amount & UPI PIN',
                  desc: 'Enter payment amount and authorize with your secret UPI PIN.',
                },
              ].map((step) => (
                <div
                  key={step.num}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-card-soft)',
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-blue)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 800,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1, lineHeight: 1.35 }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              [
                {
                  num: 1,
                  title: 'Open Phone Dialer with *99#',
                  desc: 'Tap the button below. Hit Call on your bank-linked SIM.',
                },
                {
                  num: 2,
                  title: 'Reply "1" then "3"',
                  desc: 'Reply "1" for Send Money, then reply "3" to select UPI ID.',
                },
                {
                  num: 3,
                  title: 'Paste Beneficiary UPI ID',
                  desc: `Paste ${upiId} (already copied to your clipboard).`,
                },
                {
                  num: 4,
                  title: 'Enter Amount & UPI PIN',
                  desc: 'Enter payment amount and authorize with your secret UPI PIN.',
                },
              ].map((step) => (
                <div
                  key={step.num}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-card-soft)',
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-blue)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 800,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1, lineHeight: 1.35 }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Sticky Action Footer */}
      <footer className="qr-sticky-footer">
        {/* 1-Tap Copy Helper Box */}
        <div className="qr-footer-copy-row" style={{ gridTemplateColumns: detectedMobile ? '1fr 1fr' : '1fr' }}>
          <button
            type="button"
            onClick={handleCopyUpi}
            className={`qr-footer-copy-btn ${copiedUpi ? 'copied' : ''}`}
            title="Copy UPI ID"
            style={{ width: '100%' }}
          >
            {copiedUpi ? <Check size={14} color="#16A34A" /> : <Copy size={14} />}
            <span>{copiedUpi ? 'UPI ID Copied' : `Copy UPI ID: ${upiId}`}</span>
          </button>

          {detectedMobile && (
            <button
              type="button"
              onClick={handleCopyMobile}
              className={`qr-footer-copy-btn ${copiedMob ? 'copied' : ''}`}
              title="Copy Mobile Number"
            >
              {copiedMob ? <Check size={14} color="#16A34A" /> : <Copy size={14} />}
              <span>{copiedMob ? 'Mobile Copied' : `Copy Mobile: ${detectedMobile}`}</span>
            </button>
          )}
        </div>

        {/* Primary Action Button: Direct Redirection to Native Phone Dialer */}
        <a
          href={telUri}
          className="qr-dialer-btn"
          onClick={handleDialClick}
        >
          <div className="qr-dialer-btn-icon">
            <Phone size={19} strokeWidth={2.4} />
          </div>
          <span>Open Phone Dialer ({dialCode})</span>
        </a>

        <div className="qr-footer-hint">
          {isJioVoice
            ? 'Directly opens your device\'s native phone app • No internet needed'
            : ussdShortcut === '*99*1*3#'
            ? '⚡ Direct shortcut: Skips menus straight to UPI ID prompt'
            : ussdShortcut === '*99*1*1#'
            ? '⚡ Direct shortcut: Skips menus straight to Mobile prompt'
            : 'Standard banking menu: Opens *99# on your phone'}
        </div>
      </footer>
    </div>
  );
}
