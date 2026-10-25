import { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  ArrowRight,
  AlertCircle,
  Delete,
} from 'lucide-react';
import { MerchantAvatar } from '../components/MerchantAvatar';
import { AmountSchema } from '../lib/validation/schemas';

export function EnterAmountScreen({ qrData, onBack, onContinue }) {
  const initialAmt = qrData?.amount ? String(qrData.amount) : '';
  const [amountStr, setAmountStr] = useState(initialAmt);
  const [note, setNote] = useState(qrData?.note || '');
  const [errorMsg, setErrorMsg] = useState('');

  const handleKeypadPress = (val) => {
    setErrorMsg('');
    if (val === '.') {
      if (amountStr.includes('.')) return;
      if (amountStr === '') {
        setAmountStr('0.');
        return;
      }
    }
    if (amountStr.includes('.')) {
      const parts = amountStr.split('.');
      if (parts[1] && parts[1].length >= 2) return;
    }
    if (amountStr.length >= 7) return;
    setAmountStr((prev) => prev + val);
  };

  const handleBackspace = () => {
    setErrorMsg('');
    setAmountStr((prev) => prev.slice(0, -1));
  };

  const handleAddQuickAmount = (val) => {
    setErrorMsg('');
    const current = parseFloat(amountStr) || 0;
    const next = current + val;
    setAmountStr(String(next));
  };

  const handleContinue = () => {
    const num = parseFloat(amountStr);
    const validation = AmountSchema.safeParse(num);
    if (!validation.success) {
      setErrorMsg(validation.error.issues[0]?.message || 'Please enter a valid amount');
      return;
    }

    onContinue({
      amount: validation.data,
      note: note.trim() || null,
    });
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
        <h2>Enter amount</h2>
      </div>

      {/* Mini Merchant Header */}
      <div style={{ textAlign: 'center', margin: '2px 0 10px' }}>
        <MerchantAvatar category={qrData?.category} size={42} />
        <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
          {qrData?.merchantName}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
          {qrData?.upiId}
        </div>
      </div>

      {/* Large Amount Display */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '8px 0 14px',
        }}
      >
        <span
          style={{
            fontSize: 38,
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-1px',
          }}
        >
          ₹{amountStr || '0'}
        </span>
        <span
          style={{
            display: 'inline-block',
            width: 2.5,
            height: 32,
            backgroundColor: 'var(--primary-blue)',
            marginLeft: 4,
            animation: 'blink 1s step-end infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>

      {/* Optional Note */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          backgroundColor: 'var(--bg-input)',
          borderRadius: 'var(--radius-md)',
          padding: '7px 12px',
          border: '1px solid var(--border-light)',
          marginBottom: 10,
        }}
      >
        <FileText size={14} color="var(--text-muted)" />
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (optional)"
          maxLength={60}
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: 12,
            color: 'var(--text-primary)',
            width: '100%',
          }}
        />
      </div>

      {errorMsg && (
        <div
          style={{
            backgroundColor: 'var(--accent-red-bg)',
            color: 'var(--accent-red-text)',
            padding: '7px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 11.5,
            marginBottom: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <AlertCircle size={14} /> {errorMsg}
        </div>
      )}

      {/* Quick Amount Chips */}
      <div className="quick-amount-grid">
        {[50, 100, 200, 500].map((amt) => (
          <button
            key={amt}
            type="button"
            className="quick-amount-chip"
            onClick={() => handleAddQuickAmount(amt)}
          >
            +₹{amt}
          </button>
        ))}
      </div>

      {/* Mobile Numeric Keypad */}
      <div className="mobile-keypad-grid">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((k) => (
          <button
            key={k}
            type="button"
            className="mobile-keypad-key"
            onClick={() => handleKeypadPress(k)}
          >
            {k}
          </button>
        ))}
        <button
          type="button"
          className="mobile-keypad-key"
          onClick={() => handleKeypadPress('.')}
        >
          .
        </button>
        <button
          type="button"
          className="mobile-keypad-key"
          onClick={() => handleKeypadPress('0')}
        >
          0
        </button>
        <button
          type="button"
          className="mobile-keypad-key"
          onClick={handleBackspace}
          aria-label="Backspace"
        >
          <Delete size={20} color="var(--text-secondary)" />
        </button>
      </div>

      {/* Primary CTA */}
      <button
        type="button"
        className="btn-primary"
        onClick={handleContinue}
        disabled={!amountStr || parseFloat(amountStr) <= 0}
        style={{
          marginTop: 'auto',
          opacity: !amountStr || parseFloat(amountStr) <= 0 ? 0.6 : 1,
        }}
      >
        <span>Continue</span>
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
